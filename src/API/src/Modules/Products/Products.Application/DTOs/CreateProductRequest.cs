using Products.Domain.Enums;

namespace Products.Application.DTOs
{
    public class CreateProductRequest
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ProductType ProductType { get; set; }
        public DeploymentType DeploymentType { get; set; }
        public ProductOwnershipType OwnershipType { get; set; } = ProductOwnershipType.InHouse;
        public Guid? OwnerPartnerId { get; set; }
        public bool IsSubscriptionBased { get; set; }
        public bool IsLicenseBased { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
