using Partners.Application.DTOs;
using Partners.Application.ViewModels;

namespace Partners.Application.Repositories
{
    public interface IPartnerRepository
    {
        Task<List<PartnerListItemViewModel>> GetPartnersAsync(CancellationToken cancellationToken);
        Task<PartnerDetailViewModel?> GetPartnerAsync(Guid id, CancellationToken cancellationToken);
        Task<PartnerLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken);
        Task<List<LookupViewModel>> GetActivePartnerLookupsAsync(CancellationToken cancellationToken);
        Task<string?> GetPartnerNameAsync(Guid id, CancellationToken cancellationToken);
        Task<string?> GetPartnerTypeCodeForPartnerAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Guid>> GetPartnerProductIdsAsync(Guid id, CancellationToken cancellationToken);
        Task<PartnerDetailViewModel> CreatePartnerAsync(CreatePartnerRequest request, string code, CancellationToken cancellationToken);
        Task<PartnerDetailViewModel?> UpdatePartnerAsync(Guid id, UpdatePartnerRequest request, CancellationToken cancellationToken);
        Task<bool> ActivatePartnerAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivatePartnerAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> PartnerTypeExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<string?> GetPartnerTypeCodeAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> CountryExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> PartnerExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DuplicatePartnerExistsAsync(string name, Guid partnerTypeId, Guid countryId, Guid? excludingId, CancellationToken cancellationToken);
        Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken);
    }
}
