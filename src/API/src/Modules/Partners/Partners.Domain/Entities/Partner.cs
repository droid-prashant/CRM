using ERP.Core.Entities;

namespace Partners.Domain.Entities
{
    public class Partner : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public Guid PartnerTypeId { get; set; }
        public Guid CountryId { get; set; }
        public string? ContactPerson { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Remarks { get; set; }

        public PartnerType? PartnerType { get; set; }
    }
}
