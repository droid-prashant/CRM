namespace Products.Application.DTOs
{
    public class ProductQueryRequest
    {
        public string? Search { get; set; }
        public Guid? ProductTypeId { get; set; }
        public Guid? DeploymentTypeId { get; set; }
        public bool? IsActive { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
