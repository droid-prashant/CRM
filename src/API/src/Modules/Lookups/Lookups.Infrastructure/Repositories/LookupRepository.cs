using System.ComponentModel;
using ERP.Core.Constants;
using ERP.Core.Entities;
using Lookups.Application.DTOs;
using Lookups.Application.Repositories;
using Lookups.Application.ViewModels;
using Lookups.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Lookups.Infrastructure.Repositories
{
    public class LookupRepository : ILookupRepository
    {
        private readonly LookupsDbContext _dbContext;

        public LookupRepository(LookupsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<LookupListItemViewModel>> GetLookupsAsync(LookupQueryRequest request, CancellationToken cancellationToken)
        {
            var query = _dbContext.LookupDetails.AsNoTracking().Where(x => x.LookupId == request.LookupId);
            if (!request.IncludeInactive)
            {
                query = query.Where(x => x.IsActive);
            }

            var lookups = await query.OrderBy(x => x.Order).ThenBy(x => x.Name).ToListAsync(cancellationToken);
            return lookups.Select(ToViewModel).ToList();
        }

        public async Task<LookupListItemViewModel?> GetLookupAsync(Guid id, CancellationToken cancellationToken)
        {
            var lookup = await _dbContext.LookupDetails.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            return lookup == null ? null : ToViewModel(lookup);
        }

        public async Task<LookupListItemViewModel> CreateLookupAsync(CreateLookupRequest request, CancellationToken cancellationToken)
        {
            var lookup = new LookupDetail
            {
                LookupId = request.LookupId,
                Name = request.Name,
                Description = request.Description,
                Order = request.Order ?? 0,
                DialingCode = request.DialingCode,
                DefaultCurrencyId = request.DefaultCurrencyId
            };

            _dbContext.LookupDetails.Add(lookup);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return ToViewModel(lookup);
        }

        public async Task<LookupListItemViewModel?> UpdateLookupAsync(Guid id, UpdateLookupRequest request, CancellationToken cancellationToken)
        {
            var lookup = await _dbContext.LookupDetails.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            if (lookup == null)
            {
                return null;
            }

            lookup.Name = request.Name;
            lookup.Description = request.Description;
            lookup.Order = request.Order;
            lookup.IsActive = request.IsActive;
            lookup.DialingCode = request.DialingCode;
            lookup.DefaultCurrencyId = request.DefaultCurrencyId;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return ToViewModel(lookup);
        }

        public async Task<bool> ActivateLookupAsync(Guid id, CancellationToken cancellationToken)
        {
            var lookup = await _dbContext.LookupDetails.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            if (lookup == null)
            {
                return false;
            }

            lookup.IsActive = true;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeactivateLookupAsync(Guid id, CancellationToken cancellationToken)
        {
            var lookup = await _dbContext.LookupDetails.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            if (lookup == null)
            {
                return false;
            }

            lookup.IsActive = false;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public Task<bool> NameExistsAsync(LookUpTypeEnum lookupId, string name, Guid? excludingId, CancellationToken cancellationToken)
        {
            return _dbContext.LookupDetails.AsNoTracking().AnyAsync(
                x => x.LookupId == lookupId && x.Name.ToLower() == name.ToLower() && (!excludingId.HasValue || x.Id != excludingId.Value),
                cancellationToken);
        }

        public Task<bool> CurrencyExistsAsync(Guid currencyId, CancellationToken cancellationToken)
        {
            return _dbContext.LookupDetails.AsNoTracking().AnyAsync(
                x => x.Id == currencyId && x.LookupId == LookUpTypeEnum.Currency,
                cancellationToken);
        }

        public async Task<int> GetNextOrderAsync(LookUpTypeEnum lookupId, CancellationToken cancellationToken)
        {
            var maxOrder = await _dbContext.LookupDetails.AsNoTracking()
                .Where(x => x.LookupId == lookupId)
                .Select(x => (int?)x.Order)
                .MaxAsync(cancellationToken);

            return (maxOrder ?? 0) + 1;
        }

        private static LookupListItemViewModel ToViewModel(LookupDetail lookup)
        {
            return new LookupListItemViewModel
            {
                Id = lookup.Id,
                LookupId = (int)lookup.LookupId,
                LookupName = GetDescription(lookup.LookupId),
                Name = lookup.Name,
                Description = lookup.Description,
                Order = lookup.Order,
                DialingCode = lookup.DialingCode,
                DefaultCurrencyId = lookup.DefaultCurrencyId,
                IsActive = lookup.IsActive,
                CreatedOn = lookup.CreatedOn
            };
        }

        private static string GetDescription(LookUpTypeEnum value)
        {
            var field = value.GetType().GetField(value.ToString());
            var attribute = (DescriptionAttribute?)Attribute.GetCustomAttribute(field!, typeof(DescriptionAttribute));
            return attribute?.Description ?? value.ToString();
        }
    }
}
