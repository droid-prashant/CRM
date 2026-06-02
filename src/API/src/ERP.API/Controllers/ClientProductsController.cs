using Clients.Application.DTOs;
using Clients.Application.Services;
using Clients.Application.ViewModels;
using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [Route("api/client-products")]
    public class ClientProductsController : BaseApiController
    {
        private readonly IClientProductService _productService;

        public ClientProductsController(IClientProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<ClientProductViewModel>> CreateProduct([FromBody] CreateClientProductRequest request, CancellationToken cancellationToken)
        {
            var result = await _productService.CreateProductAsync(request, cancellationToken);
            if (result.Succeeded)
            {
                return Created($"/api/clients/{result.Product!.ClientId}/products", result.Product);
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = PermissionPolicyNames.ClientsEdit)]
        public async Task<ActionResult<ClientProductViewModel>> UpdateProduct(Guid id, [FromBody] UpdateClientProductRequest request, CancellationToken cancellationToken)
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
    }
}
