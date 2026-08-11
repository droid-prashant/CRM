using ERP.Core.Constants;
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

            if (request.ProductTypeId.HasValue)
            {
                query = query.Where(x => x.ProductTypeId == request.ProductTypeId.Value);
            }

            if (request.DeploymentTypeId.HasValue)
            {
                query = query.Where(x => x.DeploymentTypeId == request.DeploymentTypeId.Value);
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
                    ProductTypeId = x.ProductTypeId,
                    ProductTypeName = _dbContext.LookupDetails
                        .Where(l => l.LookupId == LookUpTypeEnum.ProductType && l.Id == x.ProductTypeId)
                        .Select(l => l.Name)
                        .FirstOrDefault() ?? string.Empty,
                    DeploymentTypeId = x.DeploymentTypeId,
                    DeploymentTypeName = _dbContext.LookupDetails
                        .Where(l => l.LookupId == LookUpTypeEnum.DeploymentType && l.Id == x.DeploymentTypeId)
                        .Select(l => l.Name)
                        .FirstOrDefault() ?? string.Empty,
                    OwnershipTypeId = x.OwnershipTypeId,
                    OwnershipTypeName = _dbContext.LookupDetails
                        .Where(l => l.LookupId == LookUpTypeEnum.OwnershipType && l.Id == x.OwnershipTypeId)
                        .Select(l => l.Name)
                        .FirstOrDefault() ?? string.Empty,
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
            if (product == null)
            {
                return null;
            }

            var typeNames = await GetTypeNamesAsync(product.ProductTypeId, product.DeploymentTypeId, product.OwnershipTypeId, cancellationToken);
            return MapDetail(product, typeNames.ProductTypeName, typeNames.DeploymentTypeName, typeNames.OwnershipTypeName);
        }

        public async Task<ProductDetailViewModel> CreateProductAsync(CreateProductRequest request, CancellationToken cancellationToken)
        {
            var product = new Product
            {
                Code = request.Code,
                Name = request.Name,
                ProductTypeId = request.ProductTypeId,
                DeploymentTypeId = request.DeploymentTypeId,
                OwnershipTypeId = request.OwnershipTypeId,
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
            product.ProductTypeId = request.ProductTypeId;
            product.DeploymentTypeId = request.DeploymentTypeId;
            product.OwnershipTypeId = request.OwnershipTypeId;
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
                    OwnershipTypeId = x.OwnershipTypeId,
                    OwnerPartnerId = x.OwnerPartnerId
                })
                .ToListAsync(cancellationToken);
        }

        public Task<List<ProductOptionViewModel>> GetProductTypeLookupsAsync(CancellationToken cancellationToken) => GetLookupOptionsAsync(LookUpTypeEnum.ProductType, cancellationToken);
        public Task<List<ProductOptionViewModel>> GetDeploymentTypeLookupsAsync(CancellationToken cancellationToken) => GetLookupOptionsAsync(LookUpTypeEnum.DeploymentType, cancellationToken);
        public Task<List<ProductOptionViewModel>> GetOwnershipTypeLookupsAsync(CancellationToken cancellationToken) => GetLookupOptionsAsync(LookUpTypeEnum.OwnershipType, cancellationToken);
        public Task<bool> ProductTypeExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.LookupDetails.AnyAsync(x => x.LookupId == LookUpTypeEnum.ProductType && x.Id == id && x.IsActive, cancellationToken);
        public Task<bool> DeploymentTypeExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.LookupDetails.AnyAsync(x => x.LookupId == LookUpTypeEnum.DeploymentType && x.Id == id && x.IsActive, cancellationToken);
        public Task<bool> OwnershipTypeExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.LookupDetails.AnyAsync(x => x.LookupId == LookUpTypeEnum.OwnershipType && x.Id == id && x.IsActive, cancellationToken);
        public Task<string?> GetOwnershipTypeCodeAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.LookupDetails
                .AsNoTracking()
                .Where(x => x.LookupId == LookUpTypeEnum.OwnershipType && x.Id == id && x.IsActive)
                .Select(x => x.Code)
                .FirstOrDefaultAsync(cancellationToken);
        }

        private Task<List<ProductOptionViewModel>> GetLookupOptionsAsync(LookUpTypeEnum lookupId, CancellationToken cancellationToken)
        {
            return _dbContext.LookupDetails
                .AsNoTracking()
                .Where(x => x.LookupId == lookupId && x.IsActive)
                .OrderBy(x => x.Order).ThenBy(x => x.Name)
                .Select(x => new ProductOptionViewModel { Value = x.Id, Code = x.Code ?? string.Empty, Name = x.Name })
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

        private async Task<(string ProductTypeName, string DeploymentTypeName, string OwnershipTypeName)> GetTypeNamesAsync(
            Guid productTypeId, Guid deploymentTypeId, Guid ownershipTypeId, CancellationToken cancellationToken)
        {
            var names = await _dbContext.LookupDetails
                .AsNoTracking()
                .Where(l => (l.LookupId == LookUpTypeEnum.ProductType && l.Id == productTypeId)
                    || (l.LookupId == LookUpTypeEnum.DeploymentType && l.Id == deploymentTypeId)
                    || (l.LookupId == LookUpTypeEnum.OwnershipType && l.Id == ownershipTypeId))
                .ToDictionaryAsync(l => (l.LookupId, l.Id), l => l.Name, cancellationToken);

            return (
                names.GetValueOrDefault((LookUpTypeEnum.ProductType, productTypeId)) ?? string.Empty,
                names.GetValueOrDefault((LookUpTypeEnum.DeploymentType, deploymentTypeId)) ?? string.Empty,
                names.GetValueOrDefault((LookUpTypeEnum.OwnershipType, ownershipTypeId)) ?? string.Empty);
        }

        private static ProductDetailViewModel MapDetail(Product product, string productTypeName, string deploymentTypeName, string ownershipTypeName)
        {
            return new ProductDetailViewModel
            {
                Id = product.Id,
                Code = product.Code,
                Name = product.Name,
                ProductTypeId = product.ProductTypeId,
                ProductTypeName = productTypeName,
                DeploymentTypeId = product.DeploymentTypeId,
                DeploymentTypeName = deploymentTypeName,
                OwnershipTypeId = product.OwnershipTypeId,
                OwnershipTypeName = ownershipTypeName,
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
