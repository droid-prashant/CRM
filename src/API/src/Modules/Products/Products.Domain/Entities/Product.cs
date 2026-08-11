using ERP.Core.Entities;

namespace Products.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid ProductTypeId { get; set; }
        public Guid DeploymentTypeId { get; set; }
        public Guid OwnershipTypeId { get; set; }
        public Guid? OwnerPartnerId { get; set; }
        public bool IsSubscriptionBased { get; set; }
        public bool IsLicenseBased { get; set; }
        public bool IsDeleted { get; set; }
    }
}
