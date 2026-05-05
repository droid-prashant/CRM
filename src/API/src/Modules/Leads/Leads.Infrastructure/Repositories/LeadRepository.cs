using ERP.Identity.Entities;
using Leads.Application.DTOs;
using Leads.Application.Interfaces;
using Leads.Application.Repositories;
using Leads.Application.Services;
using Leads.Application.ViewModels;
using Leads.Domain.Entities;
using Leads.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Leads.Infrastructure.Repositories
{
    public class LeadRepository : ILeadRepository
    {
        private readonly ILeadsDbContext _dbContext;
        private readonly ILeadAssignmentService _leadAssignmentService;
        private readonly UserManager<ApplicationUser> _userManager;

        public LeadRepository(ILeadsDbContext dbContext, ILeadAssignmentService leadAssignmentService, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _leadAssignmentService = leadAssignmentService;
            _userManager = userManager;
        }

        public async Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken)
        {
            var leads = await _dbContext.Leads
                .AsNoTracking()
                .Include(x => x.Source)
                .Include(x => x.Category)
                .Include(x => x.Country)
                .Include(x => x.ProductInterests).ThenInclude(x => x.Product)
                .Where(x => x.IsActive)
                .OrderByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            return leads.Select(x => new LeadListItemViewModel
            {
                Id = x.Id,
                LeadNumber = x.LeadNumber,
                SourceId = x.SourceId,
                CategoryId = x.CategoryId,
                PartnerId = x.PartnerId,
                CampaignName = x.CampaignName,
                CompanyName = x.CompanyName,
                Website = x.Website,
                ContactPersonName = x.ContactPersonName,
                JobTitle = x.JobTitle,
                Email = x.Email,
                Phone = x.Phone,
                AlternatePhone = x.AlternatePhone,
                CountryId = x.CountryId,
                Address = x.Address,
                IndustryId = x.IndustryId,
                Notes = x.Notes,
                LeadScore = x.LeadScore,
                ProductIds = x.ProductInterests.Where(p => p.IsActive).Select(p => p.ProductId).ToList(),
                SourceName = x.Source?.Name ?? string.Empty,
                CategoryName = x.Category?.Name ?? string.Empty,
                CountryName = x.Country?.Name ?? string.Empty,
                Status = x.Status.ToString(),
                ProductNames = string.Join(", ", x.ProductInterests.Where(p => p.IsActive).Select(p => p.Product?.Name).Where(p => !string.IsNullOrWhiteSpace(p))),
                CreatedAt = x.CreatedOn
            }).ToList();
        }

        public async Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .AsNoTracking()
                .Include(x => x.Source)
                .Include(x => x.Category)
                .Include(x => x.Partner)
                .Include(x => x.Country)
                .Include(x => x.Industry)
                .Include(x => x.ProductInterests).ThenInclude(x => x.Product)
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null)
            {
                return null;
            }

            var detail = MapDetail(lead, false);
            await PopulateAssignedUserNameAsync(detail);
            return detail;
        }

        public async Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _dbContext.Leads
                .AsNoTracking()
                .Where(x => x.Id == id && x.IsActive)
                .Select(x => new LeadEditViewModel
                {
                    Id = x.Id,
                    SourceId = x.SourceId,
                    CategoryId = x.CategoryId,
                    PartnerId = x.PartnerId,
                    CampaignName = x.CampaignName,
                    CompanyName = x.CompanyName,
                    Website = x.Website,
                    ContactPersonName = x.ContactPersonName,
                    JobTitle = x.JobTitle,
                    Email = x.Email,
                    Phone = x.Phone,
                    AlternatePhone = x.AlternatePhone,
                    CountryId = x.CountryId,
                    Address = x.Address,
                    IndustryId = x.IndustryId,
                    Notes = x.Notes,
                    LeadScore = x.LeadScore,
                    SelectedProductIds = x.ProductInterests.Where(p => p.IsActive).Select(p => p.ProductId).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken)
        {
            return _dbContext.Leads
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.CompanyName)
                .Select(x => new LeadLookupViewModel
                {
                    Id = x.Id,
                    LeadNumber = x.LeadNumber,
                    CompanyName = x.CompanyName,
                    ContactPersonName = x.ContactPersonName,
                    Status = x.Status.ToString()
                })
                .ToListAsync(cancellationToken);
        }

        public Task<List<LookupViewModel>> GetLeadSourceLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.LeadSources, cancellationToken);
        public Task<List<LookupViewModel>> GetLeadCategoryLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.LeadCategories, cancellationToken);
        public Task<List<LookupViewModel>> GetProductLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.Products, cancellationToken);
        public Task<List<LookupViewModel>> GetPartnerLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.Partners, cancellationToken);
        public Task<List<LookupViewModel>> GetCountryLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.Countries, cancellationToken);
        public Task<List<LookupViewModel>> GetIndustryLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.Industries, cancellationToken);

        public Task<bool> SourceRequiresPartnerAsync(Guid sourceId, CancellationToken cancellationToken)
        {
            return _dbContext.LeadSources.AnyAsync(x => x.Id == sourceId && x.IsActive && x.RequiresPartner, cancellationToken);
        }

        public Task<bool> SourceExistsAsync(Guid sourceId, CancellationToken cancellationToken) => _dbContext.LeadSources.AnyAsync(x => x.Id == sourceId && x.IsActive, cancellationToken);
        public Task<bool> CategoryExistsAsync(Guid categoryId, CancellationToken cancellationToken) => _dbContext.LeadCategories.AnyAsync(x => x.Id == categoryId && x.IsActive, cancellationToken);
        public Task<bool> CountryExistsAsync(Guid countryId, CancellationToken cancellationToken) => _dbContext.Countries.AnyAsync(x => x.Id == countryId && x.IsActive, cancellationToken);
        public Task<bool> PartnerExistsAsync(Guid partnerId, CancellationToken cancellationToken) => _dbContext.Partners.AnyAsync(x => x.Id == partnerId && x.IsActive, cancellationToken);
        public Task<bool> IndustryExistsAsync(Guid industryId, CancellationToken cancellationToken) => _dbContext.Industries.AnyAsync(x => x.Id == industryId && x.IsActive, cancellationToken);

        public Task<List<Guid>> GetActiveProductIdsAsync(IEnumerable<Guid> productIds, CancellationToken cancellationToken)
        {
            var ids = productIds.ToList();
            return _dbContext.Products.Where(x => ids.Contains(x.Id) && x.IsActive).Select(x => x.Id).ToListAsync(cancellationToken);
        }

        public Task<bool> DuplicateCompanyEmailExistsAsync(string companyName, string email, CancellationToken cancellationToken)
        {
            var normalizedCompany = companyName.Trim().ToLower();
            var normalizedEmail = email.Trim().ToLower();

            return _dbContext.Leads.AnyAsync(
                x => x.IsActive
                    && x.CompanyName.ToLower() == normalizedCompany
                    && x.Email != null
                    && x.Email.ToLower() == normalizedEmail,
                cancellationToken);
        }

        public async Task<string> GenerateNextLeadNumberAsync(CancellationToken cancellationToken)
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"LD-{year}-";
            var count = await _dbContext.Leads.CountAsync(x => x.LeadNumber.StartsWith(prefix), cancellationToken);
            return $"{prefix}{count + 1:000000}";
        }

        public async Task<LeadDetailViewModel> CreateLeadAsync(CreateLeadRequest request, string leadNumber, bool hasDuplicateWarning, CancellationToken cancellationToken)
        {
            var lead = new Lead
            {
                LeadNumber = leadNumber,
                SourceId = request.SourceId,
                CategoryId = request.CategoryId,
                PartnerId = request.PartnerId,
                CampaignName = Clean(request.CampaignName),
                CompanyName = request.CompanyName.Trim(),
                Website = Clean(request.Website),
                ContactPersonName = request.ContactPersonName.Trim(),
                JobTitle = Clean(request.JobTitle),
                Email = Clean(request.Email),
                Phone = Clean(request.Phone),
                AlternatePhone = Clean(request.AlternatePhone),
                CountryId = request.CountryId,
                Address = Clean(request.Address),
                IndustryId = request.IndustryId,
                Notes = Clean(request.Notes),
                LeadScore = request.LeadScore,
                Status = LeadStatus.New,
                ProductInterests = request.ProductIds.Select(productId => new LeadProductInterest
                {
                    ProductId = productId
                }).ToList(),
                TimelineEntries = new List<LeadTimelineEntry>
                {
                    new()
                    {
                        EventType = "LeadCreated",
                        Description = "Lead was created."
                    }
                }
            };

            _dbContext.Leads.Add(lead);
            await _dbContext.SaveChangesAsync(cancellationToken);

            try
            {
                var assigneeId = await _leadAssignmentService.ResolveAssigneeAsync(lead.Id, cancellationToken);
                if (assigneeId.HasValue)
                {
                    lead.AssignedToUserId = assigneeId.Value;
                    lead.AssignedAt = DateTime.UtcNow;
                    lead.Status = LeadStatus.Assigned;
                    lead.TimelineEntries.Add(new LeadTimelineEntry
                    {
                        EventType = "LeadAssigned",
                        Description = "Lead was assigned automatically."
                    });

                    await _dbContext.SaveChangesAsync(cancellationToken);
                }
            }
            catch
            {
                lead.TimelineEntries.Add(new LeadTimelineEntry
                {
                    EventType = "LeadAssignmentWarning",
                    Description = "Lead assignment rule failed. Lead remains unassigned."
                });

                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            var detail = await GetLeadDetailAsync(lead.Id, cancellationToken);
            detail!.HasDuplicateWarning = hasDuplicateWarning;
            detail.DuplicateWarning = hasDuplicateWarning ? "A lead with the same company and email already exists." : null;
            return detail;
        }

        public async Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .Include(x => x.ProductInterests)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null)
            {
                return false;
            }

            lead.IsActive = false;

            foreach (var productInterest in lead.ProductInterests.Where(x => x.IsActive))
            {
                productInterest.IsActive = false;
            }

            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadDeleted",
                Description = "Lead was deleted."
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        private static Task<List<LookupViewModel>> GetLookupsAsync<T>(DbSet<T> dbSet, CancellationToken cancellationToken) where T : ERP.Core.Entities.BaseEntity
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

        private static LeadDetailViewModel MapDetail(Lead lead, bool hasDuplicateWarning)
        {
            return new LeadDetailViewModel
            {
                Id = lead.Id,
                LeadNumber = lead.LeadNumber,
                SourceId = lead.SourceId,
                SourceName = lead.Source?.Name ?? string.Empty,
                CategoryId = lead.CategoryId,
                CategoryName = lead.Category?.Name ?? string.Empty,
                PartnerId = lead.PartnerId,
                PartnerName = lead.Partner?.Name,
                CampaignName = lead.CampaignName,
                CompanyName = lead.CompanyName,
                Website = lead.Website,
                ContactPersonName = lead.ContactPersonName,
                JobTitle = lead.JobTitle,
                Email = lead.Email,
                Phone = lead.Phone,
                AlternatePhone = lead.AlternatePhone,
                CountryId = lead.CountryId,
                CountryName = lead.Country?.Name ?? string.Empty,
                Address = lead.Address,
                IndustryId = lead.IndustryId,
                IndustryName = lead.Industry?.Name,
                Notes = lead.Notes,
                LeadScore = lead.LeadScore,
                Status = lead.Status.ToString(),
                AssignedToUserId = lead.AssignedToUserId,
                AssignedAt = lead.AssignedAt,
                QualificationDate = lead.QualificationDate,
                DisqualificationReason = lead.DisqualificationReason,
                CreatedAt = lead.CreatedOn,
                CreatedBy = lead.CreatedBy,
                UpdatedAt = lead.UpdatedOn,
                UpdatedBy = lead.UpdatedBy,
                HasDuplicateWarning = hasDuplicateWarning,
                ProductInterests = lead.ProductInterests
                    .Where(x => x.IsActive)
                    .Select(x => new LeadProductInterestViewModel
                    {
                        ProductId = x.ProductId,
                        ProductCode = x.Product?.Code ?? string.Empty,
                        ProductName = x.Product?.Name ?? string.Empty,
                        ProductCategoryName = x.Product?.CategoryName
                    }).ToList(),
                TimelineEntries = lead.TimelineEntries
                    .Where(x => x.IsActive)
                    .OrderByDescending(x => x.CreatedOn)
                    .Select(x => new LeadTimelineEntryViewModel
                    {
                        Id = x.Id,
                        EventType = x.EventType,
                        Description = x.Description,
                        CreatedAt = x.CreatedOn
                    }).ToList()
            };
        }

        private static string? Clean(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private async Task PopulateAssignedUserNameAsync(LeadDetailViewModel detail)
        {
            if (!detail.AssignedToUserId.HasValue)
            {
                return;
            }

            var user = await _userManager.FindByIdAsync(detail.AssignedToUserId.Value.ToString());
            detail.AssignedToUserName = user?.FullName;
        }
    }
}
