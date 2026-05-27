using Products.Domain.Enums;

namespace Products.Application.DTOs
{
    public class ProductQueryRequest
    {
        public string? Search { get; set; }
        public ProductType? ProductType { get; set; }
        public DeploymentType? DeploymentType { get; set; }
        public bool? IsActive { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
