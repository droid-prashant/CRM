using Leads.Application.DTOs;
using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public interface ILeadService
    {
        Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken);
        Task<List<DeletedLeadLogViewModel>> GetDeletedLeadLogsAsync(CancellationToken cancellationToken);
        Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken);
        Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken);
        Task<CreateLeadResult> CreateLeadAsync(CreateLeadRequest request, CancellationToken cancellationToken);
        Task<CreateLeadResult> UpdateLeadAsync(Guid id, UpdateLeadRequest request, CancellationToken cancellationToken);
        Task<LeadQualificationViewModel?> GetLeadQualificationAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadQualificationResult> QualifyLeadAsync(Guid id, QualifyLeadRequest request, CancellationToken cancellationToken);
        Task<LeadQualificationResult> DisqualifyLeadAsync(Guid id, DisqualifyLeadRequest request, CancellationToken cancellationToken);
        Task<LeadQualificationResult> UpdateLeadStatusAsync(Guid id, UpdateLeadStatusRequest request, CancellationToken cancellationToken);
        Task<List<LeadStatusHistoryItemViewModel>?> GetLeadStatusHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadConversionViewModel?> GetLeadConversionAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadConversionResult> ConvertLeadAsync(Guid id, ConvertLeadRequest request, CancellationToken cancellationToken);
        Task<LeadAssignmentResult> AssignLeadAsync(Guid id, AssignLeadRequest request, CancellationToken cancellationToken);
        Task<List<LeadInteractionViewModel>?> GetLeadInteractionsAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadInteractionResult> CreateLeadInteractionAsync(Guid id, CreateLeadInteractionRequest request, CancellationToken cancellationToken);
        Task<LeadInteractionResult> UpdateLeadInteractionAsync(Guid id, Guid interactionId, UpdateLeadInteractionRequest request, CancellationToken cancellationToken);
        Task<bool> DeleteLeadInteractionAsync(Guid id, Guid interactionId, CancellationToken cancellationToken);
        Task<List<ClientLookupViewModel>> GetClientLookupsAsync(CancellationToken cancellationToken);
        Task<List<ContactLookupViewModel>> GetAllClientContactsAsync(CancellationToken cancellationToken);
        Task<List<ContactLookupViewModel>?> GetClientContactsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken);
    }
}
