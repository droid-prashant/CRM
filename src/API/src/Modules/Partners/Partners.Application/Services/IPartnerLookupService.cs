using Partners.Application.ViewModels;

namespace Partners.Application.Services
{
    public interface IPartnerLookupService
    {
        Task<List<LookupViewModel>> GetActivePartnersAsync(CancellationToken cancellationToken);
        Task<string?> GetPartnerNameAsync(Guid id, CancellationToken cancellationToken);
        Task<string?> GetPartnerTypeCodeAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Guid>> GetPartnerProductIdsAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> PartnerExistsAsync(Guid id, CancellationToken cancellationToken);
    }
}
