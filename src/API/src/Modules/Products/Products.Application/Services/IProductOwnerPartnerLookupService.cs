using Products.Application.ViewModels;

namespace Products.Application.Services
{
    public interface IProductOwnerPartnerLookupService
    {
        Task<List<ProductOwnerPartnerLookupViewModel>> GetActiveProductOwnerPartnersAsync(CancellationToken cancellationToken);
        Task<ProductOwnerPartnerLookupViewModel?> GetActiveProductOwnerPartnerAsync(Guid partnerId, CancellationToken cancellationToken);
        Task<List<ProductOwnerPartnerLookupViewModel>> GetPartnersByIdsAsync(IEnumerable<Guid> partnerIds, CancellationToken cancellationToken);
    }
}
