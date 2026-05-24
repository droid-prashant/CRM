using Partners.Application.DTOs;
using Partners.Application.ViewModels;

namespace Partners.Application.Services
{
    public interface IPartnerService
    {
        Task<List<PartnerListItemViewModel>> GetPartnersAsync(CancellationToken cancellationToken);
        Task<PartnerDetailViewModel?> GetPartnerAsync(Guid id, CancellationToken cancellationToken);
        Task<PartnerLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken);
        Task<PartnerResult> CreatePartnerAsync(CreatePartnerRequest request, CancellationToken cancellationToken);
        Task<PartnerResult> UpdatePartnerAsync(Guid id, UpdatePartnerRequest request, CancellationToken cancellationToken);
        Task<bool> ActivatePartnerAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> DeactivatePartnerAsync(Guid id, CancellationToken cancellationToken);
    }
}
