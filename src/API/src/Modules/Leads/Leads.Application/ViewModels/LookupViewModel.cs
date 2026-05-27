namespace Leads.Application.ViewModels
{
    public class LookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? PartnerTypeCode { get; set; }
        public List<Guid> ProductIds { get; set; } = new();
        public int? OwnershipType { get; set; }
        public Guid? OwnerPartnerId { get; set; }
    }
}
