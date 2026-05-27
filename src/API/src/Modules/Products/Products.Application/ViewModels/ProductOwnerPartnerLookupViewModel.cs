namespace Products.Application.ViewModels
{
    public class ProductOwnerPartnerLookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? PartnerTypeCode { get; set; }
    }
}
