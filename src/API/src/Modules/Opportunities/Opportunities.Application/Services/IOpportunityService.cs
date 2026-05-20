using Opportunities.Application.DTOs;
using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public interface IOpportunityService
    {
        Task<List<OpportunityListItemViewModel>> GetOpportunityListAsync(CancellationToken cancellationToken);
        Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken);
        Task<OpportunityResult> CreateOpportunityAsync(CreateOpportunityRequest request, CancellationToken cancellationToken);
    }
}
