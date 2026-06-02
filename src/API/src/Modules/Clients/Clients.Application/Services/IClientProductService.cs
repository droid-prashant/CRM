using Clients.Application.DTOs;
using Clients.Application.ViewModels;

namespace Clients.Application.Services
{
    public interface IClientProductService
    {
        Task<List<ClientProductViewModel>?> GetProductsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<ClientProductLookupBundleViewModel?> GetLookupsAsync(Guid clientId, CancellationToken cancellationToken);
        Task<ClientProductResult> CreateProductAsync(CreateClientProductRequest request, CancellationToken cancellationToken);
        Task<ClientProductResult> UpdateProductAsync(Guid id, UpdateClientProductRequest request, CancellationToken cancellationToken);
    }
}
