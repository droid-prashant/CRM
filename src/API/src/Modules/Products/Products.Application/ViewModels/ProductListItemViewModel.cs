namespace Products.Application.ViewModels
{
    public class ProductListItemViewModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid ProductTypeId { get; set; }
        public string ProductTypeName { get; set; } = string.Empty;
        public Guid DeploymentTypeId { get; set; }
        public string DeploymentTypeName { get; set; } = string.Empty;
        public Guid OwnershipTypeId { get; set; }
        public string OwnershipTypeName { get; set; } = string.Empty;
        public Guid? OwnerPartnerId { get; set; }
        public string? OwnerPartnerName { get; set; }
        public bool IsSubscriptionBased { get; set; }
        public bool IsLicenseBased { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
