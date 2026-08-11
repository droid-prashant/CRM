namespace Products.Application.ViewModels
{
    public class ProductLookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public Guid OwnershipTypeId { get; set; }
        public Guid? OwnerPartnerId { get; set; }
    }
}
