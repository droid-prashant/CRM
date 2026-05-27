namespace Partners.Application.DTOs
{
    public class UpdatePartnerRequest
    {
        public string Name { get; set; } = string.Empty;
        public Guid PartnerTypeId { get; set; }
        public Guid CountryId { get; set; }
        public string? ContactPerson { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Remarks { get; set; }
        public List<Guid> ProductIds { get; set; } = new();
        public bool IsActive { get; set; } = true;
    }
}
