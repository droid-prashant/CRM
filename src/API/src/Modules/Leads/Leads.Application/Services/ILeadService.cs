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
        Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken);
    }
}
