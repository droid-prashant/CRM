using Leads.Application.DTOs;
using Leads.Application.Repositories;
using Leads.Application.ViewModels;
using Leads.Domain.Enums;
using Partners.Application.Services;
using Partners.Domain.Constants;
using System.Net.Mail;

namespace Leads.Application.Services
{
    public class LeadService : ILeadService
    {
        private readonly ILeadRepository _leadRepository;
        private readonly IPartnerLookupService _partnerLookupService;

        public LeadService(ILeadRepository leadRepository, IPartnerLookupService partnerLookupService)
        {
            _leadRepository = leadRepository;
            _partnerLookupService = partnerLookupService;
        }

        public Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadListAsync(cancellationToken);
        public Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadDetailAsync(id, cancellationToken);
        public Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadEditAsync(id, cancellationToken);
        public Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadLookupsAsync(cancellationToken);
        public Task<LeadQualificationViewModel?> GetLeadQualificationAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadQualificationAsync(id, cancellationToken);
        public Task<List<LeadStatusHistoryItemViewModel>?> GetLeadStatusHistoryAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadStatusHistoryAsync(id, cancellationToken);
        public Task<LeadConversionViewModel?> GetLeadConversionAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadConversionAsync(id, cancellationToken);
        public Task<List<ClientLookupViewModel>> GetClientLookupsAsync(CancellationToken cancellationToken) => _leadRepository.GetClientLookupsAsync(cancellationToken);
        public Task<List<ContactLookupViewModel>> GetAllClientContactsAsync(CancellationToken cancellationToken) => _leadRepository.GetAllClientContactsAsync(cancellationToken);
        public Task<List<ContactLookupViewModel>?> GetClientContactsAsync(Guid clientId, CancellationToken cancellationToken) => _leadRepository.GetClientContactsAsync(clientId, cancellationToken);
        public Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.DeleteLeadAsync(id, cancellationToken);

        public async Task<CreateLeadResult> CreateLeadAsync(CreateLeadRequest request, CancellationToken cancellationToken)
        {
            var errors = await ValidateCreateRequestAsync(request, cancellationToken);
            if (errors.Count > 0)
            {
                return new CreateLeadResult { Errors = errors };
            }

            var hasDuplicateWarning = await _leadRepository.ActiveLeadExistsForClientContactAsync(
                request.ClientId,
                request.ClientContactId,
                null,
                cancellationToken);

            var leadNumber = await _leadRepository.GenerateNextLeadNumberAsync(cancellationToken);
            var lead = await _leadRepository.CreateLeadAsync(request, leadNumber, hasDuplicateWarning, cancellationToken);

            return new CreateLeadResult { Lead = lead };
        }

        public async Task<CreateLeadResult> UpdateLeadAsync(Guid id, UpdateLeadRequest request, CancellationToken cancellationToken)
        {
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
            return _leadRepository.GetLeadInteractionsAsync(id, cancellationToken);
        }

        public async Task<LeadInteractionResult> CreateLeadInteractionAsync(Guid id, CreateLeadInteractionRequest request, CancellationToken cancellationToken)
        {
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

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _leadRepository.SourceExistsAsync(sourceId, cancellationToken)) errors.Add("SourceId is invalid.");
            if (!await _leadRepository.CategoryExistsAsync(categoryId, cancellationToken)) errors.Add("CategoryId is invalid.");
            if (!await _leadRepository.ClientExistsAsync(clientId, cancellationToken)) errors.Add("ClientId is invalid.");
            if (!await _leadRepository.ContactBelongsToClientAsync(clientContactId, clientId, cancellationToken)) errors.Add("ClientContactId does not belong to the selected client.");
            if (partnerId.HasValue && !await _partnerLookupService.PartnerExistsAsync(partnerId.Value, cancellationToken)) errors.Add("PartnerId is invalid.");
            if (await _leadRepository.ActiveLeadExistsForClientContactAsync(clientId, clientContactId, excludingLeadId, cancellationToken))
            {
                errors.Add("An active lead already exists for the selected client contact.");
            }

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
    }
}
