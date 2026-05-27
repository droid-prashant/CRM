namespace Partners.Application.ViewModels
{
    public class PartnerListItemViewModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public Guid PartnerTypeId { get; set; }
        public string PartnerTypeName { get; set; } = string.Empty;
        public Guid CountryId { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Remarks { get; set; }
        public List<Guid> ProductIds { get; set; } = new();
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
