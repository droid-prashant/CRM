using Clients.Application.DTOs;
using Clients.Application.ViewModels;

namespace Clients.Application.Repositories
{
    public interface IClientRepository
    {
        Task<ClientListResponseViewModel> GetClientsAsync(ClientQueryRequest request, CancellationToken cancellationToken);
        Task<ClientCreatedViewModel?> GetClientAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientDetailViewModel?> GetClientDetailAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientEditViewModel?> GetClientEditAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientCreatedViewModel> CreateClientAsync(CreateClientRequest request, string clientCode, CancellationToken cancellationToken);
        Task<ClientCreatedViewModel?> UpdateClientAsync(Guid id, UpdateClientRequest request, CancellationToken cancellationToken);
        Task<bool> ActivateClientAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivateClientAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> SoftDeleteClientAsync(Guid id, CancellationToken cancellationToken);
        Task<List<ClientLookupViewModel>> GetActiveClientLookupsAsync(CancellationToken cancellationToken);
        Task<ClientLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken);
        Task<ClientFilterLookupViewModel> GetFilterLookupsAsync(CancellationToken cancellationToken);
        Task<bool> CountryExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> IndustryExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> ClientTypeExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DuplicateClientExistsAsync(string normalizedName, Guid countryId, Guid? excludingId, CancellationToken cancellationToken);
        Task<bool> CodeExistsAsync(string clientCode, CancellationToken cancellationToken);
        Task<string> GenerateNextClientCodeAsync(CancellationToken cancellationToken);
    }
}
