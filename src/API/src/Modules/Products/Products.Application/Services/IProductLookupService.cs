using Products.Application.ViewModels;

namespace Products.Application.Services
{
    public interface IProductLookupService
    {
        Task<List<ProductLookupViewModel>> GetActiveProductsAsync(CancellationToken cancellationToken);
    }
}
