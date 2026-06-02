using Clients.Application.DTOs;
using Clients.Application.Repositories;
using Clients.Application.ViewModels;
using Clients.Domain.Entities;
using Clients.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Clients.Infrastructure.Repositories
{
    public class ClientProductRepository : IClientProductRepository
    {
        private readonly ClientsDbContext _dbContext;

        public ClientProductRepository(ClientsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ClientProductViewModel>?> GetProductsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            if (!await ClientExistsAsync(clientId, cancellationToken))
            {
                return null;
            }

            List<ClientProduct> products;
            try
            {
                products = await _dbContext.ClientProducts
                    .AsNoTracking()
                    .Where(product => product.ClientId == clientId && !product.IsDeleted)
                    .OrderBy(product => product.RelationshipStatus)
                    .ThenBy(product => product.CreatedOn)
                    .ToListAsync(cancellationToken);
            }
            catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UndefinedTable)
            {
                return new List<ClientProductViewModel>();
            }

            return await MapAsync(products, cancellationToken);
        }

        public async Task<ClientProductViewModel?> GetProductAsync(Guid id, CancellationToken cancellationToken)
        {
            var product = await _dbContext.ClientProducts
                .AsNoTracking()
                .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

            return product == null ? null : (await MapAsync([product], cancellationToken)).Single();
        }

        public async Task<ClientProductViewModel> CreateProductAsync(CreateClientProductRequest request, CancellationToken cancellationToken)
        {
            var product = new ClientProduct
            {
                ClientId = request.ClientId,
                ProductId = request.ProductId,
                RelationshipStatus = request.RelationshipStatus,
                OpportunityId = request.OpportunityId,
                OwnerUserId = request.OwnerUserId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Notes = request.Notes,
                IsActive = true
            };

            _dbContext.ClientProducts.Add(product);
            await AddTimelineEntryAsync(request.ClientId, "ClientProductMapped", "Product mapping was added to the client.", cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return (await GetProductAsync(product.Id, cancellationToken))!;
        }

        public async Task<ClientProductViewModel?> UpdateProductAsync(Guid id, UpdateClientProductRequest request, CancellationToken cancellationToken)
        {
            var product = await _dbContext.ClientProducts
                .FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

            if (product == null)
            {
                return null;
            }

            product.ProductId = request.ProductId;
            product.RelationshipStatus = request.RelationshipStatus;
            product.OpportunityId = request.OpportunityId;
            product.OwnerUserId = request.OwnerUserId;
            product.StartDate = request.StartDate;
            product.EndDate = request.EndDate;
            product.Notes = request.Notes;

            await AddTimelineEntryAsync(product.ClientId, "ClientProductMappingUpdated", "Product mapping was updated.", cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return await GetProductAsync(product.Id, cancellationToken);
        }

        public async Task<ClientProductLookupBundleViewModel?> GetLookupsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            if (!await ClientExistsAsync(clientId, cancellationToken))
            {
                return null;
            }

            return new ClientProductLookupBundleViewModel
            {
                Products = await _dbContext.Products
                    .AsNoTracking()
                    .Where(product => product.IsActive && !product.IsDeleted)
                    .OrderBy(product => product.Name)
                    .Select(product => new LookupViewModel
                    {
                        Id = product.Id,
                        Code = product.Code,
                        Name = product.Name
                    })
                    .ToListAsync(cancellationToken),
                Owners = await _dbContext.Users
                    .AsNoTracking()
                    .Where(user => user.IsActive)
                    .OrderBy(user => user.FullName)
                    .Select(user => new ClientUserLookupViewModel
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email
                    })
                    .ToListAsync(cancellationToken),
                Opportunities = await _dbContext.Opportunities
                    .AsNoTracking()
                    .Where(opportunity => opportunity.ClientId == clientId && opportunity.IsActive)
                    .OrderBy(opportunity => opportunity.OpportunityNumber)
                    .Select(opportunity => new ClientOpportunityLookupViewModel
                    {
                        Id = opportunity.Id,
                        ClientId = opportunity.ClientId,
                        ProductId = opportunity.ProductId,
                        OpportunityNumber = opportunity.OpportunityNumber,
                        Title = opportunity.Title
                    })
                    .ToListAsync(cancellationToken),
                RelationshipStatuses = GetRelationshipStatuses()
            };
        }

        public Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.Clients.AnyAsync(client => client.Id == clientId && !client.IsDeleted, cancellationToken);
        }

        public Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken)
        {
            return _dbContext.Products.AnyAsync(product => product.Id == productId && product.IsActive && !product.IsDeleted, cancellationToken);
        }

        public Task<bool> DuplicateProductExistsAsync(Guid clientId, Guid productId, Guid? excludingId, CancellationToken cancellationToken)
        {
            return _dbContext.ClientProducts.AnyAsync(
                product => product.ClientId == clientId
                    && product.ProductId == productId
                    && !product.IsDeleted
                    && (!excludingId.HasValue || product.Id != excludingId.Value),
                cancellationToken);
        }

        public Task<bool> OpportunityBelongsToClientAsync(Guid opportunityId, Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.Opportunities.AnyAsync(
                opportunity => opportunity.Id == opportunityId && opportunity.ClientId == clientId && opportunity.IsActive,
                cancellationToken);
        }

        private async Task AddTimelineEntryAsync(Guid clientId, string eventType, string description, CancellationToken cancellationToken)
        {
            var client = await _dbContext.Clients
                .Include(item => item.TimelineEntries)
                .FirstAsync(item => item.Id == clientId && !item.IsDeleted, cancellationToken);

            client.TimelineEntries.Add(new ClientTimelineEntry
            {
                EventType = eventType,
                Description = description
            });
        }

        private async Task<List<ClientProductViewModel>> MapAsync(List<ClientProduct> mappings, CancellationToken cancellationToken)
        {
            var productIds = mappings.Select(mapping => mapping.ProductId).Distinct().ToList();
            var ownerIds = mappings.Select(mapping => mapping.OwnerUserId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            var opportunityIds = mappings.Select(mapping => mapping.OpportunityId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();

            var products = await _dbContext.Products
                .AsNoTracking()
                .Where(product => productIds.Contains(product.Id))
                .Select(product => new { product.Id, product.Code, product.Name })
                .ToDictionaryAsync(product => product.Id, cancellationToken);

            var owners = await _dbContext.Users
                .AsNoTracking()
                .Where(user => ownerIds.Contains(user.Id))
                .Select(user => new { user.Id, user.FullName })
                .ToDictionaryAsync(user => user.Id, user => user.FullName, cancellationToken);

            var opportunities = await _dbContext.Opportunities
                .AsNoTracking()
                .Where(opportunity => opportunityIds.Contains(opportunity.Id))
                .Select(opportunity => new { opportunity.Id, opportunity.OpportunityNumber, opportunity.Title })
                .ToDictionaryAsync(opportunity => opportunity.Id, cancellationToken);

            return mappings.Select(mapping =>
            {
                products.TryGetValue(mapping.ProductId, out var product);
                var opportunity = mapping.OpportunityId.HasValue
                    ? opportunities.GetValueOrDefault(mapping.OpportunityId.Value)
                    : null;

                return new ClientProductViewModel
                {
                    Id = mapping.Id,
                    ClientId = mapping.ClientId,
                    ProductId = mapping.ProductId,
                    ProductCode = product?.Code ?? string.Empty,
                    ProductName = product?.Name ?? string.Empty,
                    RelationshipStatus = mapping.RelationshipStatus,
                    OpportunityId = mapping.OpportunityId,
                    OpportunityNumber = opportunity?.OpportunityNumber,
                    OpportunityTitle = opportunity?.Title,
                    OwnerUserId = mapping.OwnerUserId,
                    OwnerUserName = mapping.OwnerUserId.HasValue ? owners.GetValueOrDefault(mapping.OwnerUserId.Value) : null,
                    StartDate = mapping.StartDate,
                    EndDate = mapping.EndDate,
                    Notes = mapping.Notes
                };
            }).ToList();
        }

        private static List<LookupViewModel> GetRelationshipStatuses()
        {
            return new List<LookupViewModel>
            {
                new() { Id = Guid.Parse("83000000-0000-0000-0000-000000000001"), Code = "Interested", Name = "Interested" },
                new() { Id = Guid.Parse("83000000-0000-0000-0000-000000000002"), Code = "Evaluating", Name = "Evaluating" },
                new() { Id = Guid.Parse("83000000-0000-0000-0000-000000000003"), Code = "Using", Name = "Using" },
                new() { Id = Guid.Parse("83000000-0000-0000-0000-000000000004"), Code = "Past User", Name = "Past User" },
                new() { Id = Guid.Parse("83000000-0000-0000-0000-000000000005"), Code = "Not Interested", Name = "Not Interested" }
            };
        }
    }
}
