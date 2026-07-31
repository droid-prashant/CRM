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
        Task<List<OpportunityCommercialDocumentViewModel>?> GetCommercialDocumentsAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityCommercialDocumentViewModel?> GetCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken);
        Task<OpportunityCommercialDocumentResult> ValidateCommercialDocumentUploadAsync(Guid id, UploadOpportunityCommercialDocumentRequest request, CancellationToken cancellationToken);
        Task<OpportunityCommercialDocumentResult> UploadCommercialDocumentAsync(Guid id, UploadOpportunityCommercialDocumentRequest request, CancellationToken cancellationToken);
        Task<OpportunityCommercialDocumentResult> DeleteCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken);
        Task<OpportunityCommercialBreakdownQueryResult> GetCommercialBreakdownAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityCommercialBreakdownResult> SaveCommercialBreakdownAsync(Guid id, SaveOpportunityCommercialBreakdownRequest request, CancellationToken cancellationToken);
        Task<List<OpportunityStageHistoryViewModel>?> GetStageHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<List<OpportunityActivityViewModel>?> GetActivitiesAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityActivityResult> CreateActivityAsync(Guid id, CreateOpportunityActivityRequest request, CancellationToken cancellationToken);
        Task<List<ProposalVersionViewModel>?> GetProposalHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<OpportunityDocumentViewModel?> GetProposalDocumentVersionAsync(Guid id, Guid documentId, CancellationToken cancellationToken);
        Task<OpportunityProposalDocumentResult> ValidateProposalVersionUploadAsync(Guid id, UploadProposalVersionRequest request, CancellationToken cancellationToken);
        Task<OpportunityProposalDocumentResult> UploadProposalVersionAsync(Guid id, UploadProposalVersionRequest request, CancellationToken cancellationToken);
    }
}
