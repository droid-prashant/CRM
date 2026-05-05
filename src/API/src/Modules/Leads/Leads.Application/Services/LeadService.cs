using Leads.Application.DTOs;
using Leads.Application.Repositories;
using Leads.Application.ViewModels;
using Leads.Domain.Enums;
using System.Net.Mail;

namespace Leads.Application.Services
{
    public class LeadService : ILeadService
    {
        private readonly ILeadRepository _leadRepository;

        public LeadService(ILeadRepository leadRepository)
        {
            _leadRepository = leadRepository;
        }

        public Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadListAsync(cancellationToken);
        public Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadDetailAsync(id, cancellationToken);
        public Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadEditAsync(id, cancellationToken);
        public Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadLookupsAsync(cancellationToken);
        public Task<LeadQualificationViewModel?> GetLeadQualificationAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadQualificationAsync(id, cancellationToken);
        public Task<List<LeadStatusHistoryItemViewModel>?> GetLeadStatusHistoryAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadStatusHistoryAsync(id, cancellationToken);
        public Task<LeadConversionViewModel?> GetLeadConversionAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.GetLeadConversionAsync(id, cancellationToken);
        public Task<List<ClientLookupViewModel>> GetClientLookupsAsync(CancellationToken cancellationToken) => _leadRepository.GetClientLookupsAsync(cancellationToken);
        public Task<List<ContactLookupViewModel>?> GetClientContactsAsync(Guid clientId, CancellationToken cancellationToken) => _leadRepository.GetClientContactsAsync(clientId, cancellationToken);
        public Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken) => _leadRepository.DeleteLeadAsync(id, cancellationToken);

        public async Task<CreateLeadResult> CreateLeadAsync(CreateLeadRequest request, CancellationToken cancellationToken)
        {
            var errors = await ValidateCreateRequestAsync(request, cancellationToken);
            if (errors.Count > 0)
            {
                return new CreateLeadResult { Errors = errors };
            }

            var hasDuplicateWarning = !string.IsNullOrWhiteSpace(request.Email)
                && await _leadRepository.DuplicateCompanyEmailExistsAsync(request.CompanyName.Trim(), request.Email.Trim(), cancellationToken);

            var leadNumber = await _leadRepository.GenerateNextLeadNumberAsync(cancellationToken);
            var lead = await _leadRepository.CreateLeadAsync(request, leadNumber, hasDuplicateWarning, cancellationToken);

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
            var errors = await ValidateAssignmentRequestAsync(request);
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

        private async Task<List<string>> ValidateCreateRequestAsync(CreateLeadRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (request.SourceId == Guid.Empty) errors.Add("SourceId is required.");
            if (request.CategoryId == Guid.Empty) errors.Add("CategoryId is required.");
            if (request.CountryId == Guid.Empty) errors.Add("CountryId is required.");
            if (string.IsNullOrWhiteSpace(request.CompanyName)) errors.Add("CompanyName is required.");
            if (string.IsNullOrWhiteSpace(request.ContactPersonName)) errors.Add("ContactPersonName is required.");
            if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.Phone)) errors.Add("At least one contact method, Email or Phone, is required.");
            if (request.ProductIds.Count == 0) errors.Add("At least one product interest is required.");
            if (request.ProductIds.Count != request.ProductIds.Distinct().Count()) errors.Add("ProductIds must be unique.");

            if (!string.IsNullOrWhiteSpace(request.Email) && !IsValidEmail(request.Email))
            {
                errors.Add("Email must be valid.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _leadRepository.SourceExistsAsync(request.SourceId, cancellationToken)) errors.Add("SourceId is invalid.");
            if (!await _leadRepository.CategoryExistsAsync(request.CategoryId, cancellationToken)) errors.Add("CategoryId is invalid.");
            if (!await _leadRepository.CountryExistsAsync(request.CountryId, cancellationToken)) errors.Add("CountryId is invalid.");
            if (request.PartnerId.HasValue && !await _leadRepository.PartnerExistsAsync(request.PartnerId.Value, cancellationToken)) errors.Add("PartnerId is invalid.");
            if (request.IndustryId.HasValue && !await _leadRepository.IndustryExistsAsync(request.IndustryId.Value, cancellationToken)) errors.Add("IndustryId is invalid.");

            if (await _leadRepository.SourceRequiresPartnerAsync(request.SourceId, cancellationToken) && !request.PartnerId.HasValue)
            {
                errors.Add("PartnerId is required when Source is Partner.");
            }

            var activeProductIds = await _leadRepository.GetActiveProductIdsAsync(request.ProductIds, cancellationToken);
            var inactiveOrMissingProducts = request.ProductIds.Except(activeProductIds).ToList();
            if (inactiveOrMissingProducts.Count > 0)
            {
                errors.Add("All ProductIds must exist in active product master data.");
            }

            return errors;
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
                errors.Add("Only qualified, not-yet-converted leads can be converted.");
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

            if (request.OwnerUserId == Guid.Empty || !await _leadRepository.UserExistsAsync(request.OwnerUserId))
            {
                errors.Add("OwnerUserId is invalid.");
            }

            if (!request.ClientId.HasValue && request.NewClient == null)
            {
                errors.Add("ClientId or NewClient is required.");
            }

            if (request.ClientId.HasValue && request.NewClient != null)
            {
                errors.Add("Provide either ClientId or NewClient, not both.");
            }

            if (request.ClientId.HasValue && !await _leadRepository.ClientExistsAsync(request.ClientId.Value, cancellationToken))
            {
                errors.Add("ClientId is invalid.");
            }

            if (request.NewClient != null)
            {
                if (string.IsNullOrWhiteSpace(request.NewClient.Name)) errors.Add("NewClient.Name is required.");
                if (request.NewClient.CountryId == Guid.Empty || !await _leadRepository.CountryExistsAsync(request.NewClient.CountryId, cancellationToken)) errors.Add("NewClient.CountryId is invalid.");
                if (request.NewClient.IndustryId.HasValue && !await _leadRepository.IndustryExistsAsync(request.NewClient.IndustryId.Value, cancellationToken)) errors.Add("NewClient.IndustryId is invalid.");
            }

            if (!request.ContactId.HasValue && request.NewContact == null)
            {
                errors.Add("ContactId or NewContact is required.");
            }

            if (request.ContactId.HasValue && request.NewContact != null)
            {
                errors.Add("Provide either ContactId or NewContact, not both.");
            }

            if (request.ContactId.HasValue && !request.ClientId.HasValue)
            {
                errors.Add("Existing contact selection requires an existing ClientId.");
            }

            if (request.ContactId.HasValue && request.ClientId.HasValue && !await _leadRepository.ContactBelongsToClientAsync(request.ContactId.Value, request.ClientId.Value, cancellationToken))
            {
                errors.Add("ContactId does not belong to the selected client.");
            }

            if (request.NewContact != null)
            {
                if (string.IsNullOrWhiteSpace(request.NewContact.FirstName)) errors.Add("NewContact.FirstName is required.");
                if (string.IsNullOrWhiteSpace(request.NewContact.LastName)) errors.Add("NewContact.LastName is required.");
                if (!string.IsNullOrWhiteSpace(request.NewContact.Email) && !IsValidEmail(request.NewContact.Email)) errors.Add("NewContact.Email must be valid.");
            }

            return errors;
        }

        private async Task<List<string>> ValidateAssignmentRequestAsync(AssignLeadRequest request)
        {
            var errors = new List<string>();

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
