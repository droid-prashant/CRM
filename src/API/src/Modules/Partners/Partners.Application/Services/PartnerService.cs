using Partners.Application.DTOs;
using Partners.Application.Repositories;
using Partners.Application.ViewModels;
using Partners.Domain.Constants;
using Products.Application.Services;
using System.Net.Mail;
using System.Text;

namespace Partners.Application.Services
{
    public class PartnerService : IPartnerService, IPartnerLookupService
    {
        private readonly IPartnerRepository _partnerRepository;
        private readonly IProductLookupService _productLookupService;

        public PartnerService(IPartnerRepository partnerRepository, IProductLookupService productLookupService)
        {
            _partnerRepository = partnerRepository;
            _productLookupService = productLookupService;
        }

        public Task<List<PartnerListItemViewModel>> GetPartnersAsync(CancellationToken cancellationToken) => _partnerRepository.GetPartnersAsync(cancellationToken);
        public Task<PartnerDetailViewModel?> GetPartnerAsync(Guid id, CancellationToken cancellationToken) => _partnerRepository.GetPartnerAsync(id, cancellationToken);
        public async Task<PartnerLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken)
        {
            var lookups = await _partnerRepository.GetLookupsAsync(cancellationToken);
            var products = await _productLookupService.GetActiveProductsAsync(cancellationToken);
            lookups.Products = products
                .Select(product => new LookupViewModel
                {
                    Id = product.Id,
                    Name = product.Name,
                    Code = product.Code
                })
                .ToList();

            return lookups;
        }
        public Task<List<LookupViewModel>> GetActivePartnersAsync(CancellationToken cancellationToken) => _partnerRepository.GetActivePartnerLookupsAsync(cancellationToken);
        public Task<string?> GetPartnerNameAsync(Guid id, CancellationToken cancellationToken) => _partnerRepository.GetPartnerNameAsync(id, cancellationToken);
        public Task<string?> GetPartnerTypeCodeAsync(Guid id, CancellationToken cancellationToken) => _partnerRepository.GetPartnerTypeCodeForPartnerAsync(id, cancellationToken);
        public Task<List<Guid>> GetPartnerProductIdsAsync(Guid id, CancellationToken cancellationToken) => _partnerRepository.GetPartnerProductIdsAsync(id, cancellationToken);
        public Task<bool> PartnerExistsAsync(Guid id, CancellationToken cancellationToken) => _partnerRepository.PartnerExistsAsync(id, cancellationToken);

        public async Task<PartnerResult> CreatePartnerAsync(CreatePartnerRequest request, CancellationToken cancellationToken)
        {
            request.ProductIds = NormalizeProductIds(request.ProductIds);
            var errors = await ValidatePartnerAsync(request.Name, request.PartnerTypeId, request.CountryId, request.Email, request.ContactPerson, request.PhoneNumber, request.Address, request.Remarks, request.ProductIds, null, cancellationToken);
            if (errors.Count > 0)
            {
                return new PartnerResult { Errors = errors };
            }

            var code = await GeneratePartnerCodeAsync(request.Name, cancellationToken);
            return new PartnerResult { Partner = await _partnerRepository.CreatePartnerAsync(request, code, cancellationToken) };
        }

        public async Task<PartnerResult> UpdatePartnerAsync(Guid id, UpdatePartnerRequest request, CancellationToken cancellationToken)
        {
            if (id == Guid.Empty)
            {
                return new PartnerResult { Errors = new List<string> { "Partner id is required." } };
            }

            request.ProductIds = NormalizeProductIds(request.ProductIds);
            var errors = await ValidatePartnerAsync(request.Name, request.PartnerTypeId, request.CountryId, request.Email, request.ContactPerson, request.PhoneNumber, request.Address, request.Remarks, request.ProductIds, id, cancellationToken);
            if (errors.Count > 0)
            {
                return new PartnerResult { Errors = errors };
            }

            var partner = await _partnerRepository.UpdatePartnerAsync(id, request, cancellationToken);
            return partner == null ? new PartnerResult { NotFound = true } : new PartnerResult { Partner = partner };
        }

        public Task<bool> ActivatePartnerAsync(Guid id, CancellationToken cancellationToken) => _partnerRepository.ActivatePartnerAsync(id, cancellationToken);
        public Task<bool> DeactivatePartnerAsync(Guid id, CancellationToken cancellationToken) => _partnerRepository.DeactivatePartnerAsync(id, cancellationToken);

        private async Task<List<string>> ValidatePartnerAsync(string name, Guid partnerTypeId, Guid countryId, string? email, string? contactPerson, string? phoneNumber, string? address, string? remarks, IReadOnlyCollection<Guid> productIds, Guid? excludingId, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(name)) errors.Add("Partner name is required.");
            if (partnerTypeId == Guid.Empty) errors.Add("Partner type is required.");
            if (countryId == Guid.Empty) errors.Add("Country is required.");
            if (name?.Length > 150) errors.Add("Partner name must be 150 characters or fewer.");
            if (contactPerson?.Length > 150) errors.Add("Contact person must be 150 characters or fewer.");
            if (phoneNumber?.Length > 50) errors.Add("Phone number must be 50 characters or fewer.");
            if (email?.Length > 250) errors.Add("Email must be 250 characters or fewer.");
            if (address?.Length > 500) errors.Add("Address must be 500 characters or fewer.");
            if (remarks?.Length > 1000) errors.Add("Remarks must be 1000 characters or fewer.");

            if (!string.IsNullOrWhiteSpace(email) && !IsValidEmail(email))
            {
                errors.Add("Email must be valid.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            var cleanName = (name ?? string.Empty).Trim();
            var partnerTypeCode = await _partnerRepository.GetPartnerTypeCodeAsync(partnerTypeId, cancellationToken);
            if (string.IsNullOrWhiteSpace(partnerTypeCode)) errors.Add("Partner type is invalid.");
            if (!await _partnerRepository.CountryExistsAsync(countryId, cancellationToken)) errors.Add("Country is invalid.");
            if (await _partnerRepository.DuplicatePartnerExistsAsync(cleanName, partnerTypeId, countryId, excludingId, cancellationToken))
            {
                errors.Add("A partner with the same name, partner type, and country already exists.");
            }

            if (productIds.Count > 0)
            {
                if (!PartnerTypeCodes.CanOwnProducts(partnerTypeCode))
                {
                    errors.Add("Partner-owned products can only be assigned to Vendor, Supplier, or Technology Partner partner types.");
                }
                else
                {
                    var activeProductIds = (await _productLookupService.GetActiveProductsAsync(cancellationToken))
                        .Select(product => product.Id)
                        .ToHashSet();

                    if (productIds.Any(productId => !activeProductIds.Contains(productId)))
                    {
                        errors.Add("One or more products are invalid or inactive.");
                    }
                }
            }

            return errors;
        }

        private static List<Guid> NormalizeProductIds(IEnumerable<Guid>? productIds)
        {
            return (productIds ?? Enumerable.Empty<Guid>())
                .Where(id => id != Guid.Empty)
                .Distinct()
                .ToList();
        }

        private async Task<string> GeneratePartnerCodeAsync(string name, CancellationToken cancellationToken)
        {
            var slug = ToCodeSlug(name);
            var code = slug;
            var suffix = 1;

            while (await _partnerRepository.CodeExistsAsync(code, cancellationToken))
            {
                suffix++;
                code = $"{slug}-{suffix:00}";
            }

            return code;
        }

        private static string ToCodeSlug(string value)
        {
            var builder = new StringBuilder();
            foreach (var character in value.Trim().ToUpperInvariant())
            {
                if (char.IsLetterOrDigit(character))
                {
                    builder.Append(character);
                }
                else if (builder.Length > 0 && builder[^1] != '-')
                {
                    builder.Append('-');
                }
            }

            var code = builder.ToString().Trim('-');
            return string.IsNullOrWhiteSpace(code) ? $"PARTNER-{DateTime.UtcNow:yyyyMMddHHmmss}" : code[..Math.Min(code.Length, 40)];
        }

        private static bool IsValidEmail(string email)
        {
            try
            {
                _ = new MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
