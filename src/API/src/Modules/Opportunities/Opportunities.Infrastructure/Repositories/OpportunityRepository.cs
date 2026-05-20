using ERP.Identity.Entities;
using Leads.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Opportunities.Application.DTOs;
using Opportunities.Application.Repositories;
using Opportunities.Application.ViewModels;
using Opportunities.Domain.Entities;
using Opportunities.Infrastructure.Persistence.Data;

namespace Opportunities.Infrastructure.Repositories
{
    public class OpportunityRepository : IOpportunityRepository
    {
        private readonly OpportunitiesDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public OpportunityRepository(OpportunitiesDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<List<OpportunityListItemViewModel>> GetOpportunityListAsync(CancellationToken cancellationToken)
        {
            var opportunities = await _dbContext.Opportunities
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            var viewModels = new List<OpportunityListItemViewModel>();
            foreach (var opportunity in opportunities)
            {
                viewModels.Add(await MapOpportunityAsync(opportunity, cancellationToken));
            }

            return viewModels;
        }

        public async Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken)
        {
            return new OpportunityLookupViewModel
            {
                Clients = await _dbContext.Clients
                    .AsNoTracking()
                    .Include(x => x.Country)
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.Name)
                    .Select(x => new OpportunityClientLookupViewModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Country = x.Country != null ? x.Country.Name : string.Empty
                    })
                    .ToListAsync(cancellationToken),
                Contacts = await _dbContext.ClientContacts
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.FirstName)
                    .ThenBy(x => x.LastName)
                    .Select(x => new OpportunityContactLookupViewModel
                    {
                        Id = x.Id,
                        ClientId = x.ClientId,
                        FullName = (x.FirstName + " " + x.LastName).Trim(),
                        Email = x.Email
                    })
                    .ToListAsync(cancellationToken),
                Products = await _dbContext.Products
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.Name)
                    .Select(x => new OpportunityLookupItemViewModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Code = x.Code
                    })
                    .ToListAsync(cancellationToken),
                Leads = await _dbContext.Leads
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.CompanyName)
                    .Select(x => new OpportunityLeadLookupViewModel
                    {
                        Id = x.Id,
                        LeadNumber = x.LeadNumber,
                        CompanyName = x.CompanyName,
                        ContactPersonName = x.ContactPersonName,
                        Status = x.Status.ToString()
                    })
                    .ToListAsync(cancellationToken),
                Currencies = GetCurrencyLookups(),
                OwnerUsers = await _userManager.Users
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.FullName)
                    .Select(x => new OpportunityUserLookupViewModel
                    {
                        Id = x.Id,
                        FullName = x.FullName
                    })
                    .ToListAsync(cancellationToken)
            };
        }

        public async Task<OpportunityListItemViewModel> CreateOpportunityAsync(CreateOpportunityRequest request, string opportunityNumber, CancellationToken cancellationToken)
        {
            var opportunity = new Opportunity
            {
                OpportunityNumber = opportunityNumber,
                LeadId = request.LeadId,
                ProductId = request.ProductId,
                ClientId = request.ClientId,
                ContactId = request.ContactId,
                Title = request.Title.Trim(),
                EstimatedValue = request.EstimatedValue,
                CurrencyId = request.CurrencyId,
                ExpectedCloseDate = request.ExpectedCloseDate?.ToUniversalTime(),
                OwnerUserId = request.OwnerUserId,
                Stage = "New"
            };

            _dbContext.Opportunities.Add(opportunity);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return await MapOpportunityAsync(opportunity, cancellationToken);
        }

        public Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.Clients.AnyAsync(x => x.Id == clientId && x.IsActive, cancellationToken);
        }

        public Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken)
        {
            return _dbContext.Products.AnyAsync(x => x.Id == productId && x.IsActive, cancellationToken);
        }

        public Task<bool> LeadExistsAsync(Guid leadId, CancellationToken cancellationToken)
        {
            return _dbContext.Leads.AnyAsync(x => x.Id == leadId && x.IsActive, cancellationToken);
        }

        public Task<bool> ContactBelongsToClientAsync(Guid contactId, Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.ClientContacts.AnyAsync(x => x.Id == contactId && x.ClientId == clientId && x.IsActive, cancellationToken);
        }

        public async Task<bool> UserExistsAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user?.IsActive == true;
        }

        private async Task<OpportunityListItemViewModel> MapOpportunityAsync(Opportunity opportunity, CancellationToken cancellationToken)
        {
            var clientName = await _dbContext.Clients
                .Where(x => x.Id == opportunity.ClientId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken);

            var productName = await _dbContext.Products
                .Where(x => x.Id == opportunity.ProductId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken);

            var contactName = await _dbContext.ClientContacts
                .Where(x => x.Id == opportunity.ContactId)
                .Select(x => (x.FirstName + " " + x.LastName).Trim())
                .FirstOrDefaultAsync(cancellationToken);

            var leadNumber = opportunity.LeadId.HasValue
                ? await _dbContext.Leads.Where(x => x.Id == opportunity.LeadId.Value).Select(x => x.LeadNumber).FirstOrDefaultAsync(cancellationToken)
                : null;

            return new OpportunityListItemViewModel
            {
                Id = opportunity.Id,
                OpportunityNumber = opportunity.OpportunityNumber,
                Title = opportunity.Title,
                ClientId = opportunity.ClientId,
                ClientName = clientName ?? string.Empty,
                ProductId = opportunity.ProductId,
                ProductName = productName ?? string.Empty,
                ContactId = opportunity.ContactId,
                ContactName = contactName ?? string.Empty,
                LeadId = opportunity.LeadId,
                LeadNumber = leadNumber,
                StageName = opportunity.Stage,
                EstimatedValue = opportunity.EstimatedValue,
                CurrencyId = opportunity.CurrencyId,
                CurrencyCode = GetCurrencyCode(opportunity.CurrencyId),
                OwnerUserId = opportunity.OwnerUserId,
                OwnerUserName = await GetUserFullNameAsync(opportunity.OwnerUserId),
                ExpectedCloseDate = opportunity.ExpectedCloseDate,
                Status = opportunity.IsActive ? "Open" : "Inactive"
            };
        }

        private async Task<string?> GetUserFullNameAsync(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return null;
            }

            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user?.FullName;
        }

        private static string GetCurrencyCode(Guid currencyId)
        {
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000001")) return "NPR";
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000002")) return "USD";
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000003")) return "INR";

            return string.Empty;
        }

        private static List<OpportunityCurrencyLookupViewModel> GetCurrencyLookups()
        {
            return new List<OpportunityCurrencyLookupViewModel>
            {
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000001"), Code = "NPR", Name = "Nepalese Rupee" },
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000002"), Code = "USD", Name = "US Dollar" },
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000003"), Code = "INR", Name = "Indian Rupee" }
            };
        }
    }
}
