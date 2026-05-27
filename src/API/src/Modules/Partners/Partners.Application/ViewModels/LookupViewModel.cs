namespace Partners.Application.ViewModels
{
    public class LookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? PartnerTypeCode { get; set; }
        public bool? CanOwnProducts { get; set; }
        public bool? CanSellInHouseProducts { get; set; }
        public List<Guid> ProductIds { get; set; } = new();
    }
}
