using Lookups.Application.DTOs;
using Lookups.Application.ViewModels;

namespace Lookups.Application.Services
{
    public interface ILookupService
    {
        Task<List<LookupTypeOptionViewModel>> GetLookupTypesAsync(CancellationToken cancellationToken);
        Task<List<LookupListItemViewModel>> GetLookupsAsync(LookupQueryRequest request, CancellationToken cancellationToken);
        Task<LookupListItemViewModel?> GetLookupAsync(Guid id, CancellationToken cancellationToken);
        Task<LookupResult> CreateLookupAsync(CreateLookupRequest request, CancellationToken cancellationToken);
        Task<LookupResult> UpdateLookupAsync(Guid id, UpdateLookupRequest request, CancellationToken cancellationToken);
        Task<bool> ActivateLookupAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivateLookupAsync(Guid id, CancellationToken cancellationToken);
    }
}
