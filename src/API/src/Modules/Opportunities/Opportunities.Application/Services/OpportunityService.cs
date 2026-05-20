using Opportunities.Application.DTOs;
using Opportunities.Application.Repositories;
using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public class OpportunityService : IOpportunityService
    {
        private static readonly HashSet<Guid> SupportedCurrencyIds =
        [
            Guid.Parse("70000000-0000-0000-0000-000000000001"),
            Guid.Parse("70000000-0000-0000-0000-000000000002"),
            Guid.Parse("70000000-0000-0000-0000-000000000003")
        ];

        private readonly IOpportunityRepository _opportunityRepository;

        public OpportunityService(IOpportunityRepository opportunityRepository)
        {
            _opportunityRepository = opportunityRepository;
        }

        public Task<List<OpportunityListItemViewModel>> GetOpportunityListAsync(CancellationToken cancellationToken)
        {
            return _opportunityRepository.GetOpportunityListAsync(cancellationToken);
        }

        public Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken)
        {
            return _opportunityRepository.GetOpportunityLookupsAsync(cancellationToken);
        }

        public async Task<OpportunityResult> CreateOpportunityAsync(CreateOpportunityRequest request, CancellationToken cancellationToken)
        {
            var errors = await ValidateCreateRequestAsync(request, cancellationToken);
            if (errors.Count > 0)
            {
                return new OpportunityResult { Errors = errors };
            }

            var opportunityNumber = await GenerateNextOpportunityNumberAsync(cancellationToken);
            var opportunity = await _opportunityRepository.CreateOpportunityAsync(request, opportunityNumber, cancellationToken);

            return new OpportunityResult { Opportunity = opportunity };
        }

        private async Task<List<string>> ValidateCreateRequestAsync(CreateOpportunityRequest request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (request.ClientId == Guid.Empty) errors.Add("ClientId is required.");
            if (request.ProductId == Guid.Empty) errors.Add("ProductId is required.");
            if (request.ContactId == Guid.Empty) errors.Add("ContactId is required.");
            if (request.OwnerUserId == Guid.Empty) errors.Add("OwnerUserId is required.");
            if (request.CurrencyId == Guid.Empty) errors.Add("CurrencyId is required.");
            if (string.IsNullOrWhiteSpace(request.Title)) errors.Add("Title is required.");
            if (request.EstimatedValue < 0) errors.Add("EstimatedValue must be greater than or equal to 0.");

            if (request.Title?.Length > 250)
            {
                errors.Add("Title must be 250 characters or fewer.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _opportunityRepository.ClientExistsAsync(request.ClientId, cancellationToken)) errors.Add("ClientId is invalid.");
            if (!await _opportunityRepository.ProductExistsAsync(request.ProductId, cancellationToken)) errors.Add("ProductId is invalid.");
            if (!await _opportunityRepository.ContactBelongsToClientAsync(request.ContactId, request.ClientId, cancellationToken)) errors.Add("ContactId does not belong to the selected client.");
            if (!await _opportunityRepository.UserExistsAsync(request.OwnerUserId)) errors.Add("OwnerUserId is invalid.");
            if (!SupportedCurrencyIds.Contains(request.CurrencyId)) errors.Add("CurrencyId is invalid.");
            if (request.LeadId.HasValue && !await _opportunityRepository.LeadExistsAsync(request.LeadId.Value, cancellationToken)) errors.Add("LeadId is invalid.");

            return errors;
        }

        private async Task<string> GenerateNextOpportunityNumberAsync(CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            return $"OPP-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
        }
    }
}
