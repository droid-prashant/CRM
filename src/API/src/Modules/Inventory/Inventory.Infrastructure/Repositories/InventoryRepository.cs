using Inventory.Application.Interfaces;
using Inventory.Application.Repositories;
using Inventory.Application.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventory.Infrastructure.Repositories
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly IInventoryDbContext _dbContext;
        public InventoryRepository(IInventoryDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<ProductViewModel>> GetProductListAsync()
        {
            var result = await _dbContext.Products.Select(x=> new ProductViewModel
            {
                Name = x.Name,
                CategoryId = x.CategoryId,
                SKU = x.SKU,
                UnitPrice = x.UnitPrice,
                QuantityInStock = x.QuantityInStock
            }).ToListAsync();

            return result;
        }

        public Task<bool> PostProductAsync()
        {
            throw new NotImplementedException();
        }
    }
}
