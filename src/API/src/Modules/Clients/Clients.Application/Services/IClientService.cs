using Clients.Application.DTOs;
using Clients.Application.ViewModels;

namespace Clients.Application.Services
{
    public interface IClientService
    {
        Task<ClientListResult> GetClientsAsync(ClientQueryRequest request, CancellationToken cancellationToken);
        Task<ClientCreatedViewModel?> GetClientAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientDetailViewModel?> GetClientDetailAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientEditViewModel?> GetClientEditAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken);
        Task<ClientFilterLookupViewModel> GetFilterLookupsAsync(CancellationToken cancellationToken);
        Task<List<ClientLookupViewModel>> GetActiveClientsAsync(CancellationToken cancellationToken);
        Task<ClientResult> CreateClientAsync(CreateClientRequest request, CancellationToken cancellationToken);
        Task<ClientUpdateResult> UpdateClientAsync(Guid id, UpdateClientRequest request, CancellationToken cancellationToken);
        Task<bool> ActivateClientAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivateClientAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeleteClientAsync(Guid id, CancellationToken cancellationToken);
    }
}
