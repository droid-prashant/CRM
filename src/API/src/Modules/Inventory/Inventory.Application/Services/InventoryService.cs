using Inventory.Application.Repositories;
using Inventory.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventory.Application.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _inventoryRepository;
        public InventoryService(IInventoryRepository inventoryRepository)
        {
            _inventoryRepository = inventoryRepository;
        }
        public async Task<List<ProductViewModel>> GetProductListAsync()
        {
          return await _inventoryRepository.GetProductListAsync();
        }

        public async Task<bool> PostProductAsync()
        {
            return await _inventoryRepository.PostProductAsync();
        }
    }
}
