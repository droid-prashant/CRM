using Products.Application.DTOs;
using Products.Application.Repositories;
using Products.Application.ViewModels;

namespace Products.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductOwnerPartnerLookupService _ownerPartnerLookupService;

        public ProductService(IProductRepository productRepository, IProductOwnerPartnerLookupService ownerPartnerLookupService)
        {
            _productRepository = productRepository;
            _ownerPartnerLookupService = ownerPartnerLookupService;
        }

        public async Task<List<ProductListItemViewModel>> GetProductsAsync(ProductQueryRequest request, CancellationToken cancellationToken)
        {
            var products = await _productRepository.GetProductsAsync(request, cancellationToken);
            await PopulateOwnershipDisplayAsync(products, cancellationToken);
            return products;
        }

        public async Task<ProductDetailViewModel?> GetProductAsync(Guid id, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductAsync(id, cancellationToken);
            if (product != null)
            {
                await PopulateOwnershipDisplayAsync([product], cancellationToken);
            }

            return product;
        }

        public Task<List<ProductLookupViewModel>> GetActiveProductsAsync(CancellationToken cancellationToken) => _productRepository.GetActiveProductLookupsAsync(cancellationToken);
        public Task<bool> ActivateProductAsync(Guid id, CancellationToken cancellationToken) => _productRepository.ActivateProductAsync(id, cancellationToken);
        public Task<bool> DeactivateProductAsync(Guid id, CancellationToken cancellationToken) => _productRepository.DeactivateProductAsync(id, cancellationToken);
        public Task<bool> DeleteProductAsync(Guid id, CancellationToken cancellationToken) => _productRepository.SoftDeleteProductAsync(id, cancellationToken);

        public async Task<ProductLookupBundleViewModel> GetLookupsAsync(CancellationToken cancellationToken)
        {
            return new ProductLookupBundleViewModel
            {
                ProductTypes = await _productRepository.GetProductTypeLookupsAsync(cancellationToken),
                DeploymentTypes = await _productRepository.GetDeploymentTypeLookupsAsync(cancellationToken),
                OwnershipTypes = await _productRepository.GetOwnershipTypeLookupsAsync(cancellationToken),
                OwnerPartners = await _ownerPartnerLookupService.GetActiveProductOwnerPartnersAsync(cancellationToken)
            };
        }

        public async Task<ProductResult> CreateProductAsync(CreateProductRequest request, CancellationToken cancellationToken)
        {
            var ownershipTypeCode = await _productRepository.GetOwnershipTypeCodeAsync(request.OwnershipTypeId, cancellationToken);
            Clean(request, ownershipTypeCode);
            var errors = await ValidateProductAsync(
                request.Code,
                request.Name,
                request.ProductTypeId,
                request.DeploymentTypeId,
                request.OwnershipTypeId,
                ownershipTypeCode,
                request.OwnerPartnerId,
                request.Description,
                request.IsSubscriptionBased,
                request.IsLicenseBased,
                null,
                cancellationToken);
            if (errors.Count > 0)
            {
                return new ProductResult { Errors = errors };
            }

            var product = await _productRepository.CreateProductAsync(request, cancellationToken);
            await PopulateOwnershipDisplayAsync([product], cancellationToken);
            return new ProductResult { Product = product };
        }

        public async Task<ProductResult> UpdateProductAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken)
        {
            if (id == Guid.Empty)
            {
                return new ProductResult { Errors = new List<string> { "Product id is required." } };
            }

            var ownershipTypeCode = await _productRepository.GetOwnershipTypeCodeAsync(request.OwnershipTypeId, cancellationToken);
            Clean(request, ownershipTypeCode);
            var errors = await ValidateProductAsync(
                request.Code,
                request.Name,
                request.ProductTypeId,
                request.DeploymentTypeId,
                request.OwnershipTypeId,
                ownershipTypeCode,
                request.OwnerPartnerId,
                request.Description,
                request.IsSubscriptionBased,
                request.IsLicenseBased,
                id,
                cancellationToken);
            if (errors.Count > 0)
            {
                return new ProductResult { Errors = errors };
            }

            var product = await _productRepository.UpdateProductAsync(id, request, cancellationToken);
            if (product == null)
            {
                return new ProductResult { NotFound = true };
            }

            await PopulateOwnershipDisplayAsync([product], cancellationToken);
            return new ProductResult { Product = product };
        }

        private async Task<List<string>> ValidateProductAsync(
            string code,
            string name,
            Guid productTypeId,
            Guid deploymentTypeId,
            Guid ownershipTypeId,
            string? ownershipTypeCode,
            Guid? ownerPartnerId,
            string? description,
            bool isSubscriptionBased,
            bool isLicenseBased,
            Guid? excludingId,
            CancellationToken cancellationToken)
        {
            var errors = new List<string>();
            var cleanCode = code ?? string.Empty;

            if (string.IsNullOrWhiteSpace(cleanCode)) errors.Add("Product code is required.");
            if (string.IsNullOrWhiteSpace(name)) errors.Add("Product name is required.");
            if (cleanCode.Length > 50) errors.Add("Product code must be 50 characters or fewer.");
            if (name?.Length > 200) errors.Add("Product name must be 200 characters or fewer.");
            if (description?.Length > 1000) errors.Add("Description must be 1000 characters or fewer.");
            if (isSubscriptionBased == isLicenseBased) errors.Add("Product must be either subscription-based or license-based.");

            if (productTypeId == Guid.Empty || !await _productRepository.ProductTypeExistsAsync(productTypeId, cancellationToken))
            {
                errors.Add("Product type is invalid.");
            }

            if (deploymentTypeId == Guid.Empty || !await _productRepository.DeploymentTypeExistsAsync(deploymentTypeId, cancellationToken))
            {
                errors.Add("Deployment type is invalid.");
            }

            if (ownershipTypeId == Guid.Empty || ownershipTypeCode == null)
            {
                errors.Add("Product ownership type is invalid.");
            }

            if (ownershipTypeCode == "InHouse" && ownerPartnerId.HasValue)
            {
                errors.Add("In-house products cannot have an owner partner.");
            }

            if (ownershipTypeCode == "PartnerOwned" && (!ownerPartnerId.HasValue || ownerPartnerId.Value == Guid.Empty))
            {
                errors.Add("Owner partner is required for partner-owned products.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (ownershipTypeCode == "PartnerOwned"
                && ownerPartnerId.HasValue
                && await _ownerPartnerLookupService.GetActiveProductOwnerPartnerAsync(ownerPartnerId.Value, cancellationToken) == null)
            {
                errors.Add("Owner partner must be an active Vendor, Supplier, or Technology Partner.");
            }

            if (await _productRepository.CodeExistsAsync(cleanCode, excludingId, cancellationToken))
            {
                errors.Add("A product with the same code already exists.");
            }

            return errors;
        }

        private static void Clean(CreateProductRequest request, string? ownershipTypeCode)
        {
            request.Code = NormalizeCode(request.Code);
            request.Name = CleanRequired(request.Name);
            request.Description = CleanOptional(request.Description);
            if (ownershipTypeCode == "InHouse")
            {
                request.OwnerPartnerId = null;
            }
        }

        private static void Clean(UpdateProductRequest request, string? ownershipTypeCode)
        {
            request.Code = NormalizeCode(request.Code);
            request.Name = CleanRequired(request.Name);
            request.Description = CleanOptional(request.Description);
            if (ownershipTypeCode == "InHouse")
            {
                request.OwnerPartnerId = null;
            }
        }

        private async Task PopulateOwnershipDisplayAsync(IReadOnlyCollection<ProductListItemViewModel> products, CancellationToken cancellationToken)
        {
            var ownerPartnerIds = products
                .Select(product => product.OwnerPartnerId)
                .Where(id => id.HasValue)
                .Select(id => id!.Value)
                .Distinct()
                .ToList();

            var ownerPartners = (await _ownerPartnerLookupService.GetPartnersByIdsAsync(ownerPartnerIds, cancellationToken))
                .ToDictionary(partner => partner.Id, partner => partner.Name);

            foreach (var product in products)
            {
                product.OwnerPartnerName = product.OwnerPartnerId.HasValue ? ownerPartners.GetValueOrDefault(product.OwnerPartnerId.Value) : null;
            }
        }

        private static string NormalizeCode(string value) => (value ?? string.Empty).Trim().ToUpperInvariant();
        private static string CleanRequired(string value) => (value ?? string.Empty).Trim();
        private static string? CleanOptional(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
