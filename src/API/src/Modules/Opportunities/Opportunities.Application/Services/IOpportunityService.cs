using Opportunities.Application.DTOs;
using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public interface IOpportunityService
    {
        Task<PagedResultViewModel<OpportunityListItemViewModel>> GetOpportunityListAsync(OpportunityListQuery query, CancellationToken cancellationToken);
        Task<List<OpportunityPipelineStageViewModel>> GetPipelineAsync(OpportunityListQuery query, CancellationToken cancellationToken);
        Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken);
        Task<OpportunityResult> CreateOpportunityAsync(CreateOpportunityRequest request, CancellationToken cancellationToken);
        Task<OpportunityResult> UpdateOpportunityAsync(Guid id, UpdateOpportunityRequest request, CancellationToken cancellationToken);
        Task<OpportunityResult> ChangeStageAsync(Guid id, ChangeOpportunityStageRequest request, CancellationToken cancellationToken);
        Task<OpportunityResult> CloseAsWonAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken);
        Task<OpportunityResult> CloseAsLostAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken);
        Task<OpportunityDocumentViewModel?> GetProposalDocumentAsync(Guid id, CancellationToken cancellationToken);
        Task<List<OpportunityStageHistoryViewModel>?> GetStageHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<List<OpportunityActivityViewModel>?> GetActivitiesAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityActivityResult> CreateActivityAsync(Guid id, CreateOpportunityActivityRequest request, CancellationToken cancellationToken);
        Task<List<ProposalVersionViewModel>?> GetProposalHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityDocumentViewModel?> GetProposalDocumentVersionAsync(Guid documentId, CancellationToken cancellationToken);
        Task<OpportunityDocumentViewModel?> UploadProposalVersionAsync(Guid id, UploadProposalVersionRequest request, CancellationToken cancellationToken);
    }
}
