using Leads.Application.DTOs;
using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public interface ILeadService
    {
        Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken);
        Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken);
        Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken);
        Task<CreateLeadResult> CreateLeadAsync(CreateLeadRequest request, CancellationToken cancellationToken);
        Task<LeadQualificationViewModel?> GetLeadQualificationAsync(Guid id, CancellationToken cancellationToken);
        Task<LeadQualificationResult> QualifyLeadAsync(Guid id, QualifyLeadRequest request, CancellationToken cancellationToken);
        Task<LeadQualificationResult> DisqualifyLeadAsync(Guid id, DisqualifyLeadRequest request, CancellationToken cancellationToken);
        Task<LeadQualificationResult> UpdateLeadStatusAsync(Guid id, UpdateLeadStatusRequest request, CancellationToken cancellationToken);
        Task<List<LeadStatusHistoryItemViewModel>?> GetLeadStatusHistoryAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken);
    }
}
