using Microsoft.EntityFrameworkCore;
using Products.Application.DTOs;
using Products.Application.Repositories;
using Products.Application.ViewModels;
using Products.Domain.Entities;
using Products.Infrastructure.Persistence.Data;

namespace Products.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ProductsDbContext _dbContext;

        public ProductRepository(ProductsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<List<ProductListItemViewModel>> GetProductsAsync(ProductQueryRequest request, CancellationToken cancellationToken)
        {
            var query = BaseQuery();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var search = request.Search.Trim().ToLower();
                query = query.Where(x => x.Code.ToLower().Contains(search)
                    || x.Name.ToLower().Contains(search)
                    || (x.Description != null && x.Description.ToLower().Contains(search)));
            }

            if (request.ProductType.HasValue)
            {
                query = query.Where(x => x.ProductType == request.ProductType.Value);
            }

            if (request.DeploymentType.HasValue)
            {
                query = query.Where(x => x.DeploymentType == request.DeploymentType.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == request.IsActive.Value);
            }

            var page = Math.Max(request.Page, 1);
            var pageSize = Math.Clamp(request.PageSize, 1, 200);

            return query
                .OrderBy(x => x.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ProductListItemViewModel
                {
                    Id = x.Id,
                    Code = x.Code,
                    Name = x.Name,
                    ProductType = x.ProductType,
                    DeploymentType = x.DeploymentType,
                    OwnershipType = x.OwnershipType,
                    OwnerPartnerId = x.OwnerPartnerId,
                    Description = x.Description,
                    IsActive = x.IsActive,
                    IsSubscriptionBased = x.IsSubscriptionBased,
                    IsLicenseBased = x.IsLicenseBased,
                    CreatedAt = x.CreatedOn
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<ProductDetailViewModel?> GetProductAsync(Guid id, CancellationToken cancellationToken)
        {
            var product = await BaseQuery().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            return product == null ? null : MapDetail(product);
        }

        public async Task<ProductDetailViewModel> CreateProductAsync(CreateProductRequest request, CancellationToken cancellationToken)
        {
            var product = new Product
            {
                Code = request.Code,
                Name = request.Name,
                ProductType = request.ProductType,
                DeploymentType = request.DeploymentType,
                OwnershipType = request.OwnershipType,
                OwnerPartnerId = request.OwnerPartnerId,
                Description = request.Description,
                IsSubscriptionBased = request.IsSubscriptionBased,
                IsLicenseBased = request.IsLicenseBased,
                IsActive = request.IsActive
            };

            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return (await GetProductAsync(product.Id, cancellationToken))!;
        }

        public async Task<ProductDetailViewModel?> UpdateProductAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            if (product == null)
            {
                return null;
            }

            product.Code = request.Code;
            product.Name = request.Name;
            product.ProductType = request.ProductType;
            product.DeploymentType = request.DeploymentType;
            product.OwnershipType = request.OwnershipType;
            product.OwnerPartnerId = request.OwnerPartnerId;
            product.Description = request.Description;
            product.IsSubscriptionBased = request.IsSubscriptionBased;
            product.IsLicenseBased = request.IsLicenseBased;
            product.IsActive = request.IsActive;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await GetProductAsync(product.Id, cancellationToken);
        }

        public Task<bool> ActivateProductAsync(Guid id, CancellationToken cancellationToken) => SetActiveAsync(id, true, cancellationToken);
        public Task<bool> DeactivateProductAsync(Guid id, CancellationToken cancellationToken) => SetActiveAsync(id, false, cancellationToken);
        public async Task<bool> SoftDeleteProductAsync(Guid id, CancellationToken cancellationToken)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
            if (product == null)
            {
                return false;
            }

            product.IsActive = false;
            product.IsDeleted = true;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public Task<bool> CodeExistsAsync(string code, Guid? excludingId, CancellationToken cancellationToken)
        {
            var normalizedCode = code.Trim().ToUpper();
            return _dbContext.Products.AnyAsync(
                x => x.Code.ToUpper() == normalizedCode
                    && (!excludingId.HasValue || x.Id != excludingId.Value),
                cancellationToken);
        }

        public Task<List<ProductLookupViewModel>> GetActiveProductLookupsAsync(CancellationToken cancellationToken)
        {
            return _dbContext.Products
                .AsNoTracking()
                .Where(x => x.IsActive && !x.IsDeleted)
                .OrderBy(x => x.Name)
                .Select(x => new ProductLookupViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    OwnershipType = (int)x.OwnershipType,
                    OwnerPartnerId = x.OwnerPartnerId
                })
                .ToListAsync(cancellationToken);
        }

        private async Task<bool> SetActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
            if (product == null)
            {
                return false;
            }

            product.IsActive = isActive;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        private IQueryable<Product> BaseQuery() => _dbContext.Products.AsNoTracking().Where(x => !x.IsDeleted);

        private static ProductDetailViewModel MapDetail(Product product)
        {
            return new ProductDetailViewModel
            {
                Id = product.Id,
                Code = product.Code,
                Name = product.Name,
                ProductType = product.ProductType,
                DeploymentType = product.DeploymentType,
                OwnershipType = product.OwnershipType,
                OwnershipTypeName = product.OwnershipType.ToString(),
                OwnerPartnerId = product.OwnerPartnerId,
                Description = product.Description,
                IsSubscriptionBased = product.IsSubscriptionBased,
                IsLicenseBased = product.IsLicenseBased,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedOn,
                CreatedBy = product.CreatedBy,
                UpdatedBy = product.UpdatedBy,
                UpdatedAt = product.UpdatedOn
            };
        }
    }
}
