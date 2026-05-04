namespace Leads.Application.DTOs
{
    public class CreateLeadRequest
    {
        public Guid SourceId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid? PartnerId { get; set; }
        public string? CampaignName { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string ContactPersonName { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? AlternatePhone { get; set; }
        public Guid CountryId { get; set; }
        public string? Address { get; set; }
        public Guid? IndustryId { get; set; }
        public string? Notes { get; set; }
        public int? LeadScore { get; set; }
        public List<Guid> ProductIds { get; set; } = new();
    }
}
