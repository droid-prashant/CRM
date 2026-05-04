using Leads.Application.Repositories;
using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public class LeadLookupService : ILeadLookupService
    {
        private readonly ILeadRepository _leadRepository;

        public LeadLookupService(ILeadRepository leadRepository)
        {
            _leadRepository = leadRepository;
        }

        public Task<List<LookupViewModel>> GetSourcesAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadSourceLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetCategoriesAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadCategoryLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetProductsAsync(CancellationToken cancellationToken) => _leadRepository.GetProductLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetPartnersAsync(CancellationToken cancellationToken) => _leadRepository.GetPartnerLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetCountriesAsync(CancellationToken cancellationToken) => _leadRepository.GetCountryLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetIndustriesAsync(CancellationToken cancellationToken) => _leadRepository.GetIndustryLookupsAsync(cancellationToken);
    }
}
