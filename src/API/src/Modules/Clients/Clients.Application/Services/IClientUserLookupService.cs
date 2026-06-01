using Clients.Application.ViewModels;

namespace Clients.Application.Services
{
    public interface IClientUserLookupService
    {
        Task<bool> ActiveUserExistsAsync(Guid userId, CancellationToken cancellationToken);
        Task<List<ClientUserLookupViewModel>> GetActiveUserLookupsAsync(CancellationToken cancellationToken);
        Task<IReadOnlyDictionary<Guid, string>> GetUserNamesAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken);
    }
}
