using Microsoft.EntityFrameworkCore;
using Partners.Application.DTOs;
using Partners.Application.Repositories;
using Partners.Application.ViewModels;
using Partners.Domain.Entities;
using Partners.Infrastructure.Persistence.Data;

namespace Partners.Infrastructure.Repositories
{
    public class PartnerRepository : IPartnerRepository
    {
        private readonly PartnersDbContext _dbContext;

        public PartnerRepository(PartnersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<PartnerListItemViewModel>> GetPartnersAsync(CancellationToken cancellationToken)
        {
            var partners = await BaseQuery()
                .OrderBy(x => x.Name)
                .ToListAsync(cancellationToken);

            return await MapListAsync(partners, cancellationToken);
        }

        public async Task<PartnerDetailViewModel?> GetPartnerAsync(Guid id, CancellationToken cancellationToken)
        {
            var partner = await BaseQuery().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            return partner == null ? null : await MapDetailAsync(partner, cancellationToken);
        }

        public async Task<PartnerLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken)
        {
            return new PartnerLookupBundleViewModel
            {
                PartnerTypes = await ToLookupsAsync(_dbContext.PartnerTypes, cancellationToken),
                Countries = await ToLookupsAsync(_dbContext.Countries, cancellationToken)
            };
        }

        public Task<List<LookupViewModel>> GetActivePartnerLookupsAsync(CancellationToken cancellationToken)
        {
            return _dbContext.Partners
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .Select(x => new LookupViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<PartnerDetailViewModel> CreatePartnerAsync(CreatePartnerRequest request, string code, CancellationToken cancellationToken)
        {
            var partner = new Partner
            {
                Code = code,
                Name = request.Name.Trim(),
                PartnerTypeId = request.PartnerTypeId,
                CountryId = request.CountryId,
                ContactPerson = Clean(request.ContactPerson),
                PhoneNumber = Clean(request.PhoneNumber),
                Email = Clean(request.Email),
                Address = Clean(request.Address),
                Remarks = Clean(request.Remarks),
                IsActive = request.IsActive
            };

            _dbContext.Partners.Add(partner);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return (await GetPartnerAsync(partner.Id, cancellationToken))!;
        }

        public async Task<PartnerDetailViewModel?> UpdatePartnerAsync(Guid id, UpdatePartnerRequest request, CancellationToken cancellationToken)
        {
            var partner = await _dbContext.Partners.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            if (partner == null)
            {
                return null;
            }

            partner.Name = request.Name.Trim();
            partner.PartnerTypeId = request.PartnerTypeId;
            partner.CountryId = request.CountryId;
            partner.ContactPerson = Clean(request.ContactPerson);
            partner.PhoneNumber = Clean(request.PhoneNumber);
            partner.Email = Clean(request.Email);
            partner.Address = Clean(request.Address);
            partner.Remarks = Clean(request.Remarks);
            partner.IsActive = request.IsActive;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await GetPartnerAsync(partner.Id, cancellationToken);
        }

        public Task<bool> ActivatePartnerAsync(Guid id, CancellationToken cancellationToken) => SetActiveAsync(id, true, cancellationToken);
        public Task<bool> DeactivatePartnerAsync(Guid id, CancellationToken cancellationToken) => SetActiveAsync(id, false, cancellationToken);
        public Task<bool> PartnerTypeExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.PartnerTypes.AnyAsync(x => x.Id == id && x.IsActive, cancellationToken);
        public Task<bool> CountryExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.Countries.AnyAsync(x => x.Id == id && x.IsActive, cancellationToken);
        public Task<bool> PartnerExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.Partners.AnyAsync(x => x.Id == id && x.IsActive, cancellationToken);
        public Task<string?> GetPartnerNameAsync(Guid id, CancellationToken cancellationToken) => _dbContext.Partners.AsNoTracking().Where(x => x.Id == id && x.IsActive).Select(x => x.Name).FirstOrDefaultAsync(cancellationToken);

        public Task<bool> DuplicatePartnerExistsAsync(string name, Guid partnerTypeId, Guid countryId, Guid? excludingId, CancellationToken cancellationToken)
        {
            var normalizedName = name.Trim().ToLower();
            return _dbContext.Partners.AnyAsync(
                x => x.Name.ToLower() == normalizedName
                    && x.PartnerTypeId == partnerTypeId
                    && x.CountryId == countryId
                    && (!excludingId.HasValue || x.Id != excludingId.Value),
                cancellationToken);
        }

        public Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken) => _dbContext.Partners.AnyAsync(x => x.Code.ToLower() == code.ToLower(), cancellationToken);

        private async Task<bool> SetActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken)
        {
            var partner = await _dbContext.Partners.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            if (partner == null)
            {
                return false;
            }

            partner.IsActive = isActive;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        private IQueryable<Partner> BaseQuery()
        {
            return _dbContext.Partners
                .AsNoTracking()
                .Include(x => x.PartnerType);
        }

        private async Task<List<PartnerListItemViewModel>> MapListAsync(List<Partner> partners, CancellationToken cancellationToken)
        {
            var countryIds = partners.Select(x => x.CountryId).Distinct().ToList();
            var countries = await _dbContext.Countries
                .AsNoTracking()
                .Where(x => countryIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Name, cancellationToken);

            return partners.Select(partner => MapList(partner, countries.GetValueOrDefault(partner.CountryId) ?? string.Empty)).ToList();
        }

        private async Task<PartnerDetailViewModel> MapDetailAsync(Partner partner, CancellationToken cancellationToken)
        {
            var countryName = await _dbContext.Countries
                .AsNoTracking()
                .Where(x => x.Id == partner.CountryId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken);
            var item = MapList(partner, countryName ?? string.Empty);

            return new PartnerDetailViewModel
            {
                Id = item.Id,
                Code = item.Code,
                Name = item.Name,
                PartnerTypeId = item.PartnerTypeId,
                PartnerTypeName = item.PartnerTypeName,
                CountryId = item.CountryId,
                CountryName = item.CountryName,
                ContactPerson = item.ContactPerson,
                PhoneNumber = item.PhoneNumber,
                Email = item.Email,
                Address = item.Address,
                Remarks = item.Remarks,
                IsActive = item.IsActive,
                CreatedAt = item.CreatedAt,
                CreatedBy = partner.CreatedBy,
                UpdatedBy = partner.UpdatedBy,
                UpdatedAt = partner.UpdatedOn
            };
        }

        private static PartnerListItemViewModel MapList(Partner partner, string countryName)
        {
            return new PartnerListItemViewModel
            {
                Id = partner.Id,
                Code = partner.Code,
                Name = partner.Name,
                PartnerTypeId = partner.PartnerTypeId,
                PartnerTypeName = partner.PartnerType?.Name ?? string.Empty,
                CountryId = partner.CountryId,
                CountryName = countryName,
                ContactPerson = partner.ContactPerson,
                PhoneNumber = partner.PhoneNumber,
                Email = partner.Email,
                Address = partner.Address,
                Remarks = partner.Remarks,
                IsActive = partner.IsActive,
                CreatedAt = partner.CreatedOn
            };
        }

        private static Task<List<LookupViewModel>> ToLookupsAsync<T>(DbSet<T> dbSet, CancellationToken cancellationToken) where T : ERP.Core.Entities.BaseEntity
        {
            return dbSet
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => EF.Property<string>(x, "Name"))
                .Select(x => new LookupViewModel
                {
                    Id = x.Id,
                    Name = EF.Property<string>(x, "Name"),
                    Code = EF.Property<string>(x, "Code")
                })
                .ToListAsync(cancellationToken);
        }

        private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
