using Clients.Application.DTOs;
using Clients.Application.Repositories;
using Clients.Application.ViewModels;

namespace Clients.Application.Services
{
    public class ClientProductService : IClientProductService
    {
        private readonly IClientProductRepository _productRepository;
        private readonly IClientUserLookupService _userLookupService;

        public ClientProductService(IClientProductRepository productRepository, IClientUserLookupService userLookupService)
        {
            _productRepository = productRepository;
            _userLookupService = userLookupService;
        }

        public Task<List<ClientProductViewModel>?> GetProductsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _productRepository.GetProductsAsync(clientId, cancellationToken);
        }

        public Task<ClientProductLookupBundleViewModel?> GetLookupsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _productRepository.GetLookupsAsync(clientId, cancellationToken);
        }

        public async Task<ClientProductResult> CreateProductAsync(CreateClientProductRequest request, CancellationToken cancellationToken)
        {
            Clean(request);
            var errors = await ValidateAsync(request.ClientId, request.ProductId, request.RelationshipStatus, request.OpportunityId, request.OwnerUserId, request.StartDate, request.EndDate, null, cancellationToken);

            if (errors.Count > 0)
            {
                return new ClientProductResult { Errors = errors };
            }

            return new ClientProductResult
            {
                Product = await _productRepository.CreateProductAsync(request, cancellationToken)
            };
        }

        public async Task<ClientProductResult> UpdateProductAsync(Guid id, UpdateClientProductRequest request, CancellationToken cancellationToken)
        {
            if (id == Guid.Empty)
            {
                return new ClientProductResult { Errors = new List<string> { "Client product mapping id is required." } };
            }

            Clean(request);
            var existing = await _productRepository.GetProductAsync(id, cancellationToken);
            if (existing == null)
            {
                return new ClientProductResult { NotFound = true };
            }

            var errors = await ValidateAsync(existing.ClientId, request.ProductId, request.RelationshipStatus, request.OpportunityId, request.OwnerUserId, request.StartDate, request.EndDate, id, cancellationToken);

            if (errors.Count > 0)
            {
                return new ClientProductResult { Errors = errors };
            }

            var product = await _productRepository.UpdateProductAsync(id, request, cancellationToken);
            return product == null
                ? new ClientProductResult { NotFound = true }
                : new ClientProductResult { Product = product };
        }

        private async Task<List<string>> ValidateAsync(
            Guid clientId,
            Guid productId,
            string relationshipStatus,
            Guid? opportunityId,
            Guid? ownerUserId,
            DateTime? startDate,
            DateTime? endDate,
            Guid? excludingId,
            CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (clientId == Guid.Empty)
            {
                errors.Add("ClientId is required.");
            }

            if (productId == Guid.Empty)
            {
                errors.Add("ProductId is required.");
            }

            if (string.IsNullOrWhiteSpace(relationshipStatus))
            {
                errors.Add("Relationship status is required.");
            }

            if (startDate.HasValue && endDate.HasValue && startDate.Value.Date > endDate.Value.Date)
            {
                errors.Add("End date must be on or after start date.");
            }

            if (errors.Count > 0)
            {
                return errors;
            }

            if (!await _productRepository.ClientExistsAsync(clientId, cancellationToken))
            {
                errors.Add("ClientId is invalid.");
            }

            if (!await _productRepository.ProductExistsAsync(productId, cancellationToken))
            {
                errors.Add("ProductId is invalid or inactive.");
            }

            if (await _productRepository.DuplicateProductExistsAsync(clientId, productId, excludingId, cancellationToken))
            {
                errors.Add("This product is already mapped to the client.");
            }

            if (ownerUserId.HasValue && ownerUserId.Value != Guid.Empty && !await _userLookupService.ActiveUserExistsAsync(ownerUserId.Value, cancellationToken))
            {
                errors.Add("OwnerUserId is invalid or inactive.");
            }

            if (opportunityId.HasValue && opportunityId.Value != Guid.Empty && !await _productRepository.OpportunityBelongsToClientAsync(opportunityId.Value, clientId, cancellationToken))
            {
                errors.Add("OpportunityId is invalid for this client.");
            }

            return errors;
        }

        private static void Clean(CreateClientProductRequest request)
        {
            request.RelationshipStatus = CleanRequired(request.RelationshipStatus);
            request.Notes = CleanOptional(request.Notes);
            if (request.OpportunityId == Guid.Empty) request.OpportunityId = null;
            if (request.OwnerUserId == Guid.Empty) request.OwnerUserId = null;
            request.StartDate = NormalizeDate(request.StartDate);
            request.EndDate = NormalizeDate(request.EndDate);
        }

        private static void Clean(UpdateClientProductRequest request)
        {
            request.RelationshipStatus = CleanRequired(request.RelationshipStatus);
            request.Notes = CleanOptional(request.Notes);
            if (request.OpportunityId == Guid.Empty) request.OpportunityId = null;
            if (request.OwnerUserId == Guid.Empty) request.OwnerUserId = null;
            request.StartDate = NormalizeDate(request.StartDate);
            request.EndDate = NormalizeDate(request.EndDate);
        }

        private static DateTime? NormalizeDate(DateTime? value) => value.HasValue ? DateTime.SpecifyKind(value.Value.Date, DateTimeKind.Utc) : null;
        private static string CleanRequired(string value) => (value ?? string.Empty).Trim();
        private static string? CleanOptional(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
