using Opportunities.Application.DTOs;
using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Repositories
{
    public interface IOpportunityRepository
    {
        Task<PagedResultViewModel<OpportunityListItemViewModel>> GetOpportunityListAsync(OpportunityListQuery query, CancellationToken cancellationToken);
        Task<List<OpportunityPipelineStageViewModel>> GetPipelineAsync(OpportunityListQuery query, CancellationToken cancellationToken);
        Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken);
        Task<OpportunityListItemViewModel> CreateOpportunityAsync(CreateOpportunityRequest request, string opportunityNumber, CancellationToken cancellationToken);
        Task<OpportunityListItemViewModel?> UpdateOpportunityAsync(UpdateOpportunityRequest request, CancellationToken cancellationToken);
        Task<OpportunityListItemViewModel?> ChangeStageAsync(Guid id, ChangeOpportunityStageRequest request, CancellationToken cancellationToken);
        Task<OpportunityListItemViewModel?> CloseAsWonAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken);
        Task<OpportunityListItemViewModel?> CloseAsLostAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken);
        Task<OpportunityDocumentViewModel?> GetProposalDocumentAsync(Guid id, CancellationToken cancellationToken);
        Task<List<OpportunityStageHistoryViewModel>?> GetStageHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<List<OpportunityActivityViewModel>?> GetActivitiesAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityActivityViewModel?> CreateActivityAsync(Guid id, CreateOpportunityActivityRequest request, CancellationToken cancellationToken);
        Task<bool> UserCanAccessOpportunityAsync(Guid id, Guid currentUserId, bool hasOverrideAccess, CancellationToken cancellationToken);
        Task<bool> UserCanModifyOpportunityAsync(Guid id, Guid currentUserId, bool hasOverrideAccess, CancellationToken cancellationToken);
        Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken);
        Task<bool> LeadExistsAsync(Guid leadId, CancellationToken cancellationToken);
        Task<bool> ContactBelongsToClientAsync(Guid contactId, Guid clientId, CancellationToken cancellationToken);
        Task<bool> UserExistsAsync(Guid userId);
        Task<bool> StageExistsAsync(Guid stageId, CancellationToken cancellationToken);
        Task<bool> StageIsProposalSentAsync(Guid stageId, CancellationToken cancellationToken);
        Task<bool> OpportunityHasProposalDocumentAsync(Guid id, CancellationToken cancellationToken);
        Task<List<ProposalVersionViewModel>> GetProposalHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityDocumentViewModel?> GetProposalDocumentVersionAsync(Guid documentId, CancellationToken cancellationToken);
        Task<OpportunityDocumentViewModel?> UploadProposalVersionAsync(Guid id, UploadProposalVersionRequest request, CancellationToken cancellationToken);
    }
}
