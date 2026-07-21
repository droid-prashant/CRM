using ERP.Identity.Constants;
using ERP.Identity.Services.Interfaces;
using Leads.Application.DTOs;
using Leads.Application.Repositories;
using Leads.Application.ViewModels;
using Leads.Domain.Enums;
using Partners.Application.Services;
using Partners.Domain.Constants;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace Leads.Application.Services
{
    public class LeadService : ILeadService
    {
        private const string NepalContactNumberPattern = @"^\d{10}$";

        private readonly ILeadRepository _leadRepository;
        private readonly IPartnerLookupService _partnerLookupService;
        private readonly IUserContextService _userContextService;

        public LeadService(ILeadRepository leadRepository, IPartnerLookupService partnerLookupService, IUserContextService userContextService)
        {
            _leadRepository = leadRepository;
            _partnerLookupService = partnerLookupService;
            _userContextService = userContextService;
        }

        public Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken)
        {
            if (HasOverrideAccess())
            {
                return _leadRepository.GetLeadListAsync(null, cancellationToken);
            }

            var currentUserId = _userContextService.GetUserId();
            return currentUserId.HasValue
                ? _leadRepository.GetLeadListAsync(currentUserId.Value, cancellationToken)
                : Task.FromResult(new List<LeadListItemViewModel>());
        }

        public Task<List<DeletedLeadLogViewModel>> GetDeletedLeadLogsAsync(CancellationToken cancellationToken)
        {
            if (!HasOverrideAccess())
            {
                throw new UnauthorizedAccessException("Only Admin and SuperAdmin users can view deleted lead logs.");
            }

            return _leadRepository.GetDeletedLeadLogsAsync(cancellationToken);
        }

        public async Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return null;
            }

            return await _leadRepository.GetLeadDetailAsync(id, cancellationToken);
        }

        public async Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return null;
            }

            return await _leadRepository.GetLeadEditAsync(id, cancellationToken);
        }

        public Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken)
        {
            if (HasOverrideAccess())
            {
                return _leadRepository.GetLeadLookupsAsync(null, cancellationToken);
            }

            var currentUserId = _userContextService.GetUserId();
            return currentUserId.HasValue
                ? _leadRepository.GetLeadLookupsAsync(currentUserId.Value, cancellationToken)
                : Task.FromResult(new List<LeadLookupViewModel>());
        }

        public async Task<LeadQualificationViewModel?> GetLeadQualificationAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return null;
            }

            return await _leadRepository.GetLeadQualificationAsync(id, cancellationToken);
        }

        public async Task<List<LeadStatusHistoryItemViewModel>?> GetLeadStatusHistoryAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return null;
            }

            return await _leadRepository.GetLeadStatusHistoryAsync(id, cancellationToken);
        }

        public async Task<LeadConversionViewModel?> GetLeadConversionAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return null;
            }

            return await _leadRepository.GetLeadConversionAsync(id, cancellationToken);
        }

        public Task<List<ClientLookupViewModel>> GetClientLookupsAsync(CancellationToken cancellationToken) => _leadRepository.GetClientLookupsAsync(cancellationToken);
        public Task<List<ContactLookupViewModel>> GetAllClientContactsAsync(CancellationToken cancellationToken) => _leadRepository.GetAllClientContactsAsync(cancellationToken);
        public Task<List<ContactLookupViewModel>?> GetClientContactsAsync(Guid clientId, CancellationToken cancellationToken) => _leadRepository.GetClientContactsAsync(clientId, cancellationToken);
        public async Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return false;
            }

            return await _leadRepository.DeleteLeadAsync(id, cancellationToken);
        }

        public async Task<CreateLeadResult> CreateLeadAsync(CreateLeadRequest request, CancellationToken cancellationToken)
        {
            var errors = await ValidateCreateRequestAsync(request, cancellationToken);
            if (errors.Count > 0)
            {
                return new CreateLeadResult { Errors = errors };
            }

            var leadNumber = await _leadRepository.GenerateNextLeadNumberAsync(cancellationToken);
            var lead = await _leadRepository.CreateLeadAsync(request, leadNumber, cancellationToken);

            return new CreateLeadResult { Lead = lead };
        }

        public async Task<CreateLeadResult> UpdateLeadAsync(Guid id, UpdateLeadRequest request, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return new CreateLeadResult { Errors = new List<string> { "Lead was not found." } };
            }

            var existingLead = await _leadRepository.GetLeadDetailAsync(id, cancellationToken);
            if (existingLead == null)
            {
                return new CreateLeadResult { Errors = new List<string> { "Lead was not found." } };
            }

            if (existingLead.Status.Equals(LeadStatus.Converted.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                return new CreateLeadResult { Errors = new List<string> { "Converted leads cannot be updated." } };
            }

            var errors = await ValidateUpdateRequestAsync(id, request, cancellationToken);
            if (errors.Count > 0)
            {
                return new CreateLeadResult { Errors = errors };
            }

            var lead = await _leadRepository.UpdateLeadAsync(id, request, cancellationToken);
            if (lead == null)
            {
                return new CreateLeadResult { Errors = new List<string> { "Lead cannot be updated." } };
            }

            return new CreateLeadResult { Lead = lead };
        }

        public Task<LeadQualificationResult> QualifyLeadAsync(Guid id, QualifyLeadRequest request, CancellationToken cancellationToken)
        {
            return UpdateLeadStatusAsync(id, new UpdateLeadStatusRequest
            {
                Status = LeadStatus.Qualified.ToString(),
                Remarks = request.QualificationRemarks
            }, cancellationToken);
        }

        public Task<LeadQualificationResult> DisqualifyLeadAsync(Guid id, DisqualifyLeadRequest request, CancellationToken cancellationToken)
        {
            return UpdateLeadStatusAsync(id, new UpdateLeadStatusRequest
            {
                Status = LeadStatus.Disqualified.ToString(),
                DisqualificationReason = request.DisqualificationReason,
                Remarks = request.DisqualificationRemarks
            }, cancellationToken);
        }

        public async Task<LeadQualificationResult> UpdateLeadStatusAsync(Guid id, UpdateLeadStatusRequest request, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return new LeadQualificationResult { Errors = new List<string> { "Lead was not found." } };
            }

            var errors = ValidateStatusRequest(request);
            if (errors.Count > 0)
            {
                return new LeadQualificationResult { Errors = errors };
            }

            var current = await _leadRepository.GetLeadQualificationAsync(id, cancellationToken);
            if (current == null)
            {
                return new LeadQualificationResult { Errors = new List<string> { "Lead was not found." } };
            }

            if (string.Equals(current.CurrentStatus, LeadStatus.Converted.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                return new LeadQualificationResult { Errors = new List<string> { "Converted leads cannot be qualified or disqualified." } };
            }

            if (string.Equals(current.CurrentStatus, request.Status, StringComparison.OrdinalIgnoreCase))
            {
                return new LeadQualificationResult { Errors = new List<string> { $"Lead is already {current.CurrentStatus}." } };
            }

            var qualification = await _leadRepository.UpdateLeadStatusAsync(
                id,
                request.Status.Trim(),
                request.DisqualificationReason,
                request.Remarks,
                cancellationToken);

            if (qualification == null)
            {
                return new LeadQualificationResult { Errors = new List<string> { "Lead status could not be updated." } };
            }

            return new LeadQualificationResult { Qualification = qualification };
        }

        public async Task<LeadConversionResult> ConvertLeadAsync(Guid id, ConvertLeadRequest request, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return new LeadConversionResult { Errors = new List<string> { "Lead was not found." } };
            }

            var errors = await ValidateConversionRequestAsync(id, request, cancellationToken);
            if (errors.Count > 0)
            {
                return new LeadConversionResult { Errors = errors };
            }

            var opportunityNumber = await GenerateNextOpportunityNumberAsync(cancellationToken);
            var opportunity = await _leadRepository.ConvertLeadAsync(id, request, opportunityNumber, cancellationToken);
            if (opportunity == null)
            {
                return new LeadConversionResult { Errors = new List<string> { "Lead could not be converted." } };
            }

            return new LeadConversionResult { Opportunity = opportunity };
        }

        public async Task<LeadAssignmentResult> AssignLeadAsync(Guid id, AssignLeadRequest request, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return new LeadAssignmentResult { Errors = new List<string> { "Lead was not found." } };
            }

            var errors = await ValidateAssignmentRequestAsync(id, request, cancellationToken);
            if (errors.Count > 0)
            {
                return new LeadAssignmentResult { Errors = errors };
            }

            var assignment = await _leadRepository.AssignLeadAsync(id, request, cancellationToken);
            if (assignment == null)
            {
                return new LeadAssignmentResult { Errors = new List<string> { "Lead was not found or cannot be assigned." } };
            }

            return new LeadAssignmentResult { Assignment = assignment };
        }

        public Task<List<LeadInteractionViewModel>?> GetLeadInteractionsAsync(Guid id, CancellationToken cancellationToken)
        {
            return GetLeadInteractionsWithAccessAsync(id, cancellationToken);
        }

        public async Task<LeadInteractionResult> CreateLeadInteractionAsync(Guid id, CreateLeadInteractionRequest request, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return new LeadInteractionResult { Errors = new List<string> { "Lead was not found." } };
            }

            var errors = ValidateInteractionRequest(id, request);
            if (errors.Count > 0)
            {
                return new LeadInteractionResult { Errors = errors };
            }

            if (!await _leadRepository.LeadExistsAsync(id, cancellationToken))
            {
                return new LeadInteractionResult { Errors = new List<string> { "Lead was not found." } };
            }

            var interaction = await _leadRepository.CreateLeadInteractionAsync(id, request, cancellationToken);
            if (interaction == null)
            {
                return new LeadInteractionResult { Errors = new List<string> { "Lead interaction could not be saved." } };
            }

            return new LeadInteractionResult { Interaction = interaction };
        }

        private async Task<List<string>> ValidateCreateRequestAsync(CreateLeadRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            errors.AddRange(await ValidateLeadFieldsAsync(
                request.SourceId,
                request.CategoryId,
                request.PartnerId,
                request.CampaignName,
                request.SourceStartDate,
                request.SourceEndDate,
                request.Address,
                request.ClientId,
                request.ClientContactId,
                request.ProductIds,
                request.Phone,
                request.AlternatePhone,
                null,
                cancellationToken));

            return errors;
        }

        private Task<List<string>> ValidateUpdateRequestAsync(Guid id, UpdateLeadRequest request, CancellationToken cancellationToken)
        {
            return ValidateLeadFieldsAsync(
                request.SourceId,
                request.CategoryId,
                request.PartnerId,
                request.CampaignName,
                request.SourceStartDate,
                request.SourceEndDate,
                request.Address,
                request.ClientId,
                request.ClientContactId,
                request.ProductIds,
                request.Phone,
                request.AlternatePhone,
                id,
                cancellationToken);
        }

        private async Task<List<string>> ValidateLeadFieldsAsync(
            Guid sourceId,
            Guid categoryId,
            Guid? partnerId,
            string? campaignName,
            DateTime? sourceStartDate,
            DateTime? sourceEndDate,
            string? address,
            Guid clientId,
            Guid clientContactId,
            List<Guid> productIds,
            string? phone,
            string? alternatePhone,
            Guid? excludingLeadId,
            CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (sourceId == Guid.Empty) errors.Add("SourceId is required.");
            if (categoryId == Guid.Empty) errors.Add("CategoryId is required.");
            if (clientId == Guid.Empty) errors.Add("ClientId is required.");
            if (clientContactId == Guid.Empty) errors.Add("ClientContactId is required.");
            if (productIds.Count == 0) errors.Add("At least one product interest is required.");
            if (productIds.Count != productIds.Distinct().Count()) errors.Add("ProductIds must be unique.");
            ValidateContactNumber(errors, phone, "Phone");
            ValidateContactNumber(errors, alternatePhone, "Alternate phone");

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _leadRepository.SourceExistsAsync(sourceId, cancellationToken)) errors.Add("SourceId is invalid.");
            if (!await _leadRepository.CategoryExistsAsync(categoryId, cancellationToken)) errors.Add("CategoryId is invalid.");
            if (!await _leadRepository.ClientExistsAsync(clientId, cancellationToken)) errors.Add("ClientId is invalid.");
            if (!await _leadRepository.ContactBelongsToClientAsync(clientContactId, clientId, cancellationToken)) errors.Add("ClientContactId does not belong to the selected client.");
            if (partnerId.HasValue && !await _partnerLookupService.PartnerExistsAsync(partnerId.Value, cancellationToken)) errors.Add("PartnerId is invalid.");
            errors.AddRange(await ValidateSourceDetailsAsync(sourceId, partnerId, campaignName, sourceStartDate, sourceEndDate, address, cancellationToken));

            errors.AddRange(await ValidateProductInterestAvailabilityAsync(sourceId, partnerId, productIds, cancellationToken));

            return errors;
        }

        private async Task<List<string>> ValidateSourceDetailsAsync(
            Guid sourceId,
            Guid? partnerId,
            string? campaignName,
            DateTime? sourceStartDate,
            DateTime? sourceEndDate,
            string? address,
            CancellationToken cancellationToken)
        {
            var errors = new List<string>();
            var sourceCode = (await _leadRepository.GetLeadSourceCodeAsync(sourceId, cancellationToken))?.Trim().ToUpperInvariant();

            if (sourceCode == "CAMPAIGN" && string.IsNullOrWhiteSpace(campaignName))
            {
                errors.Add("CampaignName is required when Source is Campaign.");
            }

            if (sourceCode == "PARTNER" && !partnerId.HasValue)
            {
                errors.Add("PartnerId is required when Source is Partner.");
            }

            if (sourceCode != "CAMPAIGN")
            {
                return errors;
            }

            if (!sourceStartDate.HasValue) errors.Add("SourceStartDate is required when Source is Campaign.");
            if (!sourceEndDate.HasValue) errors.Add("SourceEndDate is required when Source is Campaign.");
            if (string.IsNullOrWhiteSpace(address)) errors.Add("Address is required when Source is Campaign.");
            if (sourceStartDate.HasValue && sourceEndDate.HasValue && sourceStartDate.Value.Date > sourceEndDate.Value.Date)
            {
                errors.Add("SourceStartDate must be earlier than or equal to SourceEndDate.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateProductInterestAvailabilityAsync(Guid sourceId, Guid? partnerId, List<Guid> productIds, CancellationToken cancellationToken)
        {
            var errors = new List<string>();
            var activeProductIds = await _leadRepository.GetActiveProductIdsAsync(productIds, cancellationToken);
            var inactiveOrMissingProducts = productIds.Except(activeProductIds).ToList();
            if (inactiveOrMissingProducts.Count > 0)
            {
                errors.Add("All ProductIds must exist in active product master data.");
                return errors;
            }

            if (await RequiresAssignedPartnerProductsAsync(sourceId, partnerId, cancellationToken))
            {
                var assignedProductIds = (await _partnerLookupService.GetPartnerProductIdsAsync(partnerId!.Value, cancellationToken)).ToHashSet();
                if (productIds.Any(productId => !assignedProductIds.Contains(productId)))
                {
                    errors.Add("Supplier and Vendor partner leads can only use products assigned to the selected partner.");
                }

                return errors;
            }

            var inHouseProductIds = (await _leadRepository.GetActiveInHouseProductIdsAsync(productIds, cancellationToken)).ToHashSet();
            if (productIds.Any(productId => !inHouseProductIds.Contains(productId)))
            {
                errors.Add("Product Interest can only include in-house products unless the selected Partner is Supplier or Vendor.");
            }

            return errors;
        }

        private async Task<bool> RequiresAssignedPartnerProductsAsync(Guid sourceId, Guid? partnerId, CancellationToken cancellationToken)
        {
            var sourceCode = (await _leadRepository.GetLeadSourceCodeAsync(sourceId, cancellationToken))?.Trim().ToUpperInvariant();
            if (sourceCode != "PARTNER" || !partnerId.HasValue)
            {
                return false;
            }

            var partnerTypeCode = await _partnerLookupService.GetPartnerTypeCodeAsync(partnerId.Value, cancellationToken);
            var normalizedPartnerTypeCode = PartnerTypeCodes.Normalize(partnerTypeCode);
            return normalizedPartnerTypeCode == PartnerTypeCodes.Vendor || normalizedPartnerTypeCode == PartnerTypeCodes.Supplier;
        }

        private static List<string> ValidateStatusRequest(UpdateLeadStatusRequest request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.Status))
            {
                errors.Add("Status is required.");
                return errors;
            }

            if (!Enum.TryParse<LeadStatus>(request.Status, true, out var status))
            {
                errors.Add("Status is invalid.");
                return errors;
            }

            if (status != LeadStatus.Qualified && status != LeadStatus.Disqualified)
            {
                errors.Add("Only Qualified or Disqualified status can be set from this story.");
            }

            if (status == LeadStatus.Disqualified && string.IsNullOrWhiteSpace(request.DisqualificationReason))
            {
                errors.Add("Disqualification reason is required.");
            }

            if (status == LeadStatus.Qualified && !string.IsNullOrWhiteSpace(request.DisqualificationReason))
            {
                errors.Add("Qualification request cannot include disqualification reason.");
            }

            if (request.Remarks?.Length > 1000)
            {
                errors.Add("Remarks must be 1000 characters or fewer.");
            }

            if (request.DisqualificationReason?.Length > 500)
            {
                errors.Add("Disqualification reason must be 500 characters or fewer.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateConversionRequestAsync(Guid id, ConvertLeadRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();
            var conversion = await _leadRepository.GetLeadConversionAsync(id, cancellationToken);

            if (conversion == null)
            {
                return new List<string> { "Lead was not found." };
            }

            if (!conversion.CanConvert)
            {
                errors.Add("Only qualified, assigned, not-yet-converted leads can be converted.");
            }

            if (!conversion.ProductInterests.Any(x => x.ProductId == request.ProductId))
            {
                errors.Add("ProductId must be one of the lead product interests.");
            }

            if (string.IsNullOrWhiteSpace(request.OpportunityTitle))
            {
                errors.Add("OpportunityTitle is required.");
            }

            if (request.EstimatedValue < 0)
            {
                errors.Add("EstimatedValue must be greater than or equal to 0.");
            }

            if (request.CurrencyId == Guid.Empty)
            {
                errors.Add("CurrencyId is required.");
            }

            ValidateContactNumber(errors, request.NewContact?.Phone, "New contact phone");

            if (!conversion.DefaultOwnerUserId.HasValue)
            {
                errors.Add("Lead must be assigned before conversion.");
            }
            else if (request.OwnerUserId != Guid.Empty && request.OwnerUserId != conversion.DefaultOwnerUserId.Value)
            {
                errors.Add("Opportunity owner must match the assigned lead user.");
            }

            if (!conversion.SelectedClientId.HasValue || !conversion.SelectedContactId.HasValue)
            {
                errors.Add("Lead must be linked to a client and contact before conversion.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateAssignmentRequestAsync(Guid id, AssignLeadRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            var status = await _leadRepository.GetLeadStatusAsync(id, cancellationToken);
            if (!status.HasValue)
            {
                errors.Add("Lead was not found.");
            }
            else if (status.Value != LeadStatus.Qualified)
            {
                errors.Add("Only qualified leads can be assigned.");
            }

            if (request.AssignedToUserId == Guid.Empty)
            {
                errors.Add("AssignedToUserId is required.");
            }
            else if (!await _leadRepository.UserExistsAsync(request.AssignedToUserId))
            {
                errors.Add("AssignedToUserId is invalid.");
            }

            if (request.Remarks?.Length > 1000)
            {
                errors.Add("Remarks must be 1000 characters or fewer.");
            }

            return errors;
        }

        private static List<string> ValidateInteractionRequest(Guid leadId, CreateLeadInteractionRequest request)
        {
            var errors = new List<string>();

            if (leadId == Guid.Empty)
            {
                errors.Add("LeadId is required.");
            }

            if (request.LeadId == Guid.Empty)
            {
                errors.Add("LeadId is required.");
            }
            else if (request.LeadId != leadId)
            {
                errors.Add("LeadId must match the route lead id.");
            }

            if (string.IsNullOrWhiteSpace(request.InteractionType))
            {
                errors.Add("InteractionType is required.");
            }
            else if (!Enum.TryParse<LeadInteractionType>(request.InteractionType, true, out _))
            {
                errors.Add("InteractionType is invalid.");
            }

            if (string.IsNullOrWhiteSpace(request.Notes))
            {
                errors.Add("Notes is required.");
            }

            if (request.Subject?.Length > 250)
            {
                errors.Add("Subject must be 250 characters or fewer.");
            }

            if (request.Notes?.Length > 2000)
            {
                errors.Add("Notes must be 2000 characters or fewer.");
            }

            return errors;
        }

        private async Task<string> GenerateNextOpportunityNumberAsync(CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            return $"OPP-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
        }

        private async Task<List<LeadInteractionViewModel>?> GetLeadInteractionsWithAccessAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await EnsureCanAccessLeadAsync(id, cancellationToken))
            {
                return null;
            }

            return await _leadRepository.GetLeadInteractionsAsync(id, cancellationToken);
        }

        private async Task<bool> EnsureCanAccessLeadAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await _leadRepository.LeadExistsAsync(id, cancellationToken))
            {
                return false;
            }

            var currentUserId = _userContextService.GetUserId();
            if (!currentUserId.HasValue)
            {
                throw new UnauthorizedAccessException("You are not allowed to access this lead.");
            }

            if (!await _leadRepository.UserCanAccessLeadAsync(id, currentUserId.Value, HasOverrideAccess(), cancellationToken))
            {
                throw new UnauthorizedAccessException("You are not allowed to access this lead.");
            }

            return true;
        }

        private bool HasOverrideAccess()
        {
            var roles = _userContextService.GetUserRoles();
            return roles.Any(role =>
                string.Equals(role, DefaultRoles.SuperAdmin, StringComparison.OrdinalIgnoreCase)
                || string.Equals(role, DefaultRoles.Admin, StringComparison.OrdinalIgnoreCase));
        }

        private static bool IsValidEmail(string email)
        {
            try
            {
                _ = new MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static void ValidateContactNumber(List<string> errors, string? value, string fieldName)
        {
            if (!string.IsNullOrWhiteSpace(value) && !Regex.IsMatch(value.Trim(), NepalContactNumberPattern))
            {
                errors.Add($"{fieldName} must contain exactly 10 digits.");
            }
        }
    }
}
