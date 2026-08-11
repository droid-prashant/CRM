using ERP.Core.Constants;
using Lookups.Application.DTOs;
using Lookups.Application.ViewModels;

namespace Lookups.Application.Repositories
{
    public interface ILookupRepository
    {
        Task<List<LookupListItemViewModel>> GetLookupsAsync(LookupQueryRequest request, CancellationToken cancellationToken);
        Task<LookupListItemViewModel?> GetLookupAsync(Guid id, CancellationToken cancellationToken);
        Task<LookupListItemViewModel> CreateLookupAsync(CreateLookupRequest request, CancellationToken cancellationToken);
        Task<LookupListItemViewModel?> UpdateLookupAsync(Guid id, UpdateLookupRequest request, CancellationToken cancellationToken);
        Task<bool> ActivateLookupAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivateLookupAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> NameExistsAsync(LookUpTypeEnum lookupId, string name, Guid? excludingId, CancellationToken cancellationToken);
        Task<int> GetNextOrderAsync(LookUpTypeEnum lookupId, CancellationToken cancellationToken);
    }
}
