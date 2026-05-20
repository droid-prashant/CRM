using Opportunities.Application.DTOs;
using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Repositories
{
    public interface IOpportunityRepository
    {
        Task<List<OpportunityListItemViewModel>> GetOpportunityListAsync(CancellationToken cancellationToken);
        Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken);
        Task<OpportunityListItemViewModel> CreateOpportunityAsync(CreateOpportunityRequest request, string opportunityNumber, CancellationToken cancellationToken);
        Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken);
        Task<bool> LeadExistsAsync(Guid leadId, CancellationToken cancellationToken);
        Task<bool> ContactBelongsToClientAsync(Guid contactId, Guid clientId, CancellationToken cancellationToken);
        Task<bool> UserExistsAsync(Guid userId);
    }
}
