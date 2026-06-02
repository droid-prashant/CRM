using Clients.Application.DTOs;
using Clients.Application.ViewModels;

namespace Clients.Application.Repositories
{
    public interface IClientProductRepository
    {
        Task<List<ClientProductViewModel>?> GetProductsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<ClientProductViewModel?> GetProductAsync(Guid id, CancellationToken cancellationToken);
        Task<ClientProductViewModel> CreateProductAsync(CreateClientProductRequest request, CancellationToken cancellationToken);
        Task<ClientProductViewModel?> UpdateProductAsync(Guid id, UpdateClientProductRequest request, CancellationToken cancellationToken);
        Task<ClientProductLookupBundleViewModel?> GetLookupsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken);
        Task<bool> DuplicateProductExistsAsync(Guid clientId, Guid productId, Guid? excludingId, CancellationToken cancellationToken);
        Task<bool> OpportunityBelongsToClientAsync(Guid opportunityId, Guid clientId, CancellationToken cancellationToken);
    }
}
