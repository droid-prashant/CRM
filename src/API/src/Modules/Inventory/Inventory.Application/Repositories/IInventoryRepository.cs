using Inventory.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventory.Application.Repositories
{
    public interface IInventoryRepository
    {
        Task<List<ProductViewModel>> GetProductListAsync();
        Task<bool> PostProductAsync();
    }
}
