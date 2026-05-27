using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Products.Application.DTOs;
using Products.Application.Services;
using Products.Application.ViewModels;

namespace ERP.API.Controllers.Products
{
    public class ProductsController : BaseApiController
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [Authorize(Policy = PermissionPolicyNames.ProductsView)]
        public async Task<ActionResult<List<ProductListItemViewModel>>> GetProducts([FromQuery] ProductQueryRequest request, CancellationToken cancellationToken)
        {
            return await _productService.GetProductsAsync(request, cancellationToken);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ProductsView)]
        public async Task<ActionResult<ProductDetailViewModel>> GetProduct(Guid id, CancellationToken cancellationToken)
        {
            var product = await _productService.GetProductAsync(id, cancellationToken);
            return product == null ? NotFound() : product;
        }

        [HttpGet("lookups")]
        [Authorize(Policy = PermissionPolicyNames.ProductsView)]
        public async Task<ActionResult<ProductLookupBundleViewModel>> GetLookups(CancellationToken cancellationToken)
        {
            return await _productService.GetLookupsAsync(cancellationToken);
        }

        [HttpGet("active")]
        [Authorize(Policy = PermissionPolicyNames.ProductsView)]
        public async Task<ActionResult<List<ProductLookupViewModel>>> GetActiveProducts(CancellationToken cancellationToken)
        {
            return await _productService.GetActiveProductsAsync(cancellationToken);
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.ProductsCreate)]
        public async Task<ActionResult<ProductDetailViewModel>> CreateProduct([FromBody] CreateProductRequest request, CancellationToken cancellationToken)
        {
            var result = await _productService.CreateProductAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetProduct), new { id = result.Product!.Id }, result.Product);
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ProductsEdit)]
        public async Task<ActionResult<ProductDetailViewModel>> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request, CancellationToken cancellationToken)
        {
            var result = await _productService.UpdateProductAsync(id, request, cancellationToken);
            if (result.Succeeded)
            {
                return result.Product!;
            }

            if (result.NotFound)
            {
                return NotFound();
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPatch("{id:guid}/activate")]
        [Authorize(Policy = PermissionPolicyNames.ProductsEdit)]
        public async Task<IActionResult> ActivateProduct(Guid id, CancellationToken cancellationToken)
        {
            return await _productService.ActivateProductAsync(id, cancellationToken) ? NoContent() : NotFound();
        }

        [HttpPatch("{id:guid}/deactivate")]
        [Authorize(Policy = PermissionPolicyNames.ProductsDelete)]
        public async Task<IActionResult> DeactivateProduct(Guid id, CancellationToken cancellationToken)
        {
            return await _productService.DeactivateProductAsync(id, cancellationToken) ? NoContent() : NotFound();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ProductsDelete)]
        public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken cancellationToken)
        {
            return await _productService.DeleteProductAsync(id, cancellationToken) ? NoContent() : NotFound();
        }
    }
}
