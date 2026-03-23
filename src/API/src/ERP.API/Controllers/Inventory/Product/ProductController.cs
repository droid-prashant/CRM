using Inventory.Application.Services;
using Inventory.Application.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers.Inventory.Product
{
    public class ProductController : BaseApiController
    {
        private readonly IInventoryService _inventoryService;
        public ProductController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet("GetAllProducts")]
        public async Task<List<ProductViewModel>> GetProductListAsync()
        {
            return await _inventoryService.GetProductListAsync();
        }

        [HttpPost("AddProduct")]
        public async Task<bool> PostProductAsync()
        {
            return await _inventoryService.PostProductAsync();
        }
    }
}
