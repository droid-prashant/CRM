using Products.Application.DTOs;
using Products.Application.ViewModels;

namespace Products.Application.Repositories
{
    public interface IProductRepository
    {
        Task<List<ProductListItemViewModel>> GetProductsAsync(ProductQueryRequest request, CancellationToken cancellationToken);
        Task<ProductDetailViewModel?> GetProductAsync(Guid id, CancellationToken cancellationToken);
        Task<ProductDetailViewModel> CreateProductAsync(CreateProductRequest request, CancellationToken cancellationToken);
        Task<ProductDetailViewModel?> UpdateProductAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken);
        Task<bool> ActivateProductAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivateProductAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> SoftDeleteProductAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> CodeExistsAsync(string code, Guid? excludingId, CancellationToken cancellationToken);
        Task<List<ProductLookupViewModel>> GetActiveProductLookupsAsync(CancellationToken cancellationToken);
        Task<List<ProductOptionViewModel>> GetProductTypeLookupsAsync(CancellationToken cancellationToken);
        Task<List<ProductOptionViewModel>> GetDeploymentTypeLookupsAsync(CancellationToken cancellationToken);
        Task<List<ProductOptionViewModel>> GetOwnershipTypeLookupsAsync(CancellationToken cancellationToken);
        Task<bool> ProductTypeExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeploymentTypeExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> OwnershipTypeExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<string?> GetOwnershipTypeCodeAsync(Guid id, CancellationToken cancellationToken);
    }
}
