using Leads.Application.DTOs;
using Leads.Application.Repositories;
using Leads.Application.ViewModels;
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
