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
        Task<List<OpportunityCommercialDocumentViewModel>?> GetCommercialDocumentsAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityCommercialDocumentViewModel?> GetCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken);
        Task<OpportunityCommercialDocumentViewModel?> UploadCommercialDocumentAsync(Guid id, UploadOpportunityCommercialDocumentRequest request, CancellationToken cancellationToken);
        Task<OpportunityCommercialDocumentViewModel?> DeleteCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken);
        Task<OpportunityCommercialBreakdownViewModel?> GetCommercialBreakdownAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityCommercialBreakdownViewModel?> SaveCommercialBreakdownAsync(Guid id, SaveOpportunityCommercialBreakdownRequest request, CancellationToken cancellationToken);
        Task<bool> OpportunityIsWonAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> OpportunityHasCommercialDocumentAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> CommercialDocumentBelongsToOpportunityAsync(Guid id, Guid documentId, string documentType, CancellationToken cancellationToken);
        Task<bool> CommercialDocumentIsReferencedByBreakdownAsync(Guid id, Guid documentId, CancellationToken cancellationToken);
        Task<List<OpportunityStageHistoryViewModel>?> GetStageHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<List<OpportunityActivityViewModel>?> GetActivitiesAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityActivityViewModel?> CreateActivityAsync(Guid id, CreateOpportunityActivityRequest request, CancellationToken cancellationToken);
        Task<bool> UserCanAccessOpportunityAsync(Guid id, Guid currentUserId, bool hasOverrideAccess, CancellationToken cancellationToken);
        Task<bool> UserCanModifyOpportunityAsync(Guid id, Guid currentUserId, bool hasOverrideAccess, CancellationToken cancellationToken);
        Task<bool> OpportunityExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken);
        Task<bool> LeadExistsAsync(Guid leadId, CancellationToken cancellationToken);
        Task<bool> ContactBelongsToClientAsync(Guid contactId, Guid clientId, CancellationToken cancellationToken);
        Task<bool> UserExistsAsync(Guid userId);
        Task<bool> StageExistsAsync(Guid stageId, CancellationToken cancellationToken);
        Task<bool> StageIsProposalSentAsync(Guid stageId, CancellationToken cancellationToken);
        Task<bool> OpportunityHasProposalDocumentAsync(Guid id, CancellationToken cancellationToken);
    }
}
