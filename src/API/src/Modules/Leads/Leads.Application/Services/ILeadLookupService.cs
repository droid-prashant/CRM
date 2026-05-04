using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public interface ILeadLookupService
    {
        Task<List<LookupViewModel>> GetSourcesAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetCategoriesAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetProductsAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetPartnersAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetCountriesAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetIndustriesAsync(CancellationToken cancellationToken);
    }
}
