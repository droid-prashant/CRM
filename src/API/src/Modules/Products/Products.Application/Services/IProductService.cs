using Products.Application.DTOs;
using Products.Application.ViewModels;

namespace Products.Application.Services
{
    public interface IProductService : IProductLookupService
    {
        Task<List<ProductListItemViewModel>> GetProductsAsync(ProductQueryRequest request, CancellationToken cancellationToken);
        Task<ProductDetailViewModel?> GetProductAsync(Guid id, CancellationToken cancellationToken);
        Task<ProductLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken);
        Task<ProductResult> CreateProductAsync(CreateProductRequest request, CancellationToken cancellationToken);
        Task<ProductResult> UpdateProductAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken);
        Task<bool> ActivateProductAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivateProductAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeleteProductAsync(Guid id, CancellationToken cancellationToken);
    }
}
