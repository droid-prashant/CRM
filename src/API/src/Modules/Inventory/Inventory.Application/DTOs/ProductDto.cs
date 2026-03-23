using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventory.Application.DTOs
{
    public class ProductDto
    {
        public string Name { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public int SKU { get; set; }
        public decimal UnitPrice { get; set; }
        public int QuantityInStock { get; set; }
    }
}
