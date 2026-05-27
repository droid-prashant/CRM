using ERP.Core.Entities;
using Products.Domain.Enums;

namespace Products.Domain.Entities
{
    public class Product : BaseEntity
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
        public bool IsDeleted { get; set; }
    }
}
