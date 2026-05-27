using Leads.Application.Repositories;
using Leads.Application.ViewModels;
using Partners.Application.Services;

namespace Leads.Application.Services
{
    public class LeadLookupService : ILeadLookupService
    {
        private readonly ILeadRepository _leadRepository;
        private readonly IPartnerLookupService _partnerLookupService;

        public LeadLookupService(ILeadRepository leadRepository, IPartnerLookupService partnerLookupService)
        {
            _leadRepository = leadRepository;
            _partnerLookupService = partnerLookupService;
        }

        public Task<List<LookupViewModel>> GetSourcesAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadSourceLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetCategoriesAsync(CancellationToken cancellationToken) => _leadRepository.GetLeadCategoryLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetProductsAsync(CancellationToken cancellationToken) => _leadRepository.GetProductLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetCountriesAsync(CancellationToken cancellationToken) => _leadRepository.GetCountryLookupsAsync(cancellationToken);
        public Task<List<LookupViewModel>> GetIndustriesAsync(CancellationToken cancellationToken) => _leadRepository.GetIndustryLookupsAsync(cancellationToken);

        public async Task<List<LookupViewModel>> GetPartnersAsync(CancellationToken cancellationToken)
        {
            var partners = await _partnerLookupService.GetActivePartnersAsync(cancellationToken);
            return partners.Select(x => new LookupViewModel
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name,
                PartnerTypeCode = x.PartnerTypeCode,
                ProductIds = x.ProductIds
            }).ToList();
        }
    }
}
