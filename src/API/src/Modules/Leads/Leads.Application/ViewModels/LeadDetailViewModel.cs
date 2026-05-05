namespace Leads.Application.ViewModels
{
    public class LeadDetailViewModel
    {
        public Guid Id { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public Guid SourceId { get; set; }
        public string SourceName { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Guid? PartnerId { get; set; }
        public string? PartnerName { get; set; }
        public string? CampaignName { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string ContactPersonName { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? AlternatePhone { get; set; }
        public Guid CountryId { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public Guid? IndustryId { get; set; }
        public string? IndustryName { get; set; }
        public string? Notes { get; set; }
        public int? LeadScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public Guid? AssignedToUserId { get; set; }
        public string? AssignedToUserName { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? QualificationDate { get; set; }
        public string? DisqualificationReason { get; set; }
        public Guid? ConvertedOpportunityId { get; set; }
        public List<LeadProductInterestViewModel> ProductInterests { get; set; } = new();
        public List<LeadTimelineEntryViewModel> TimelineEntries { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
        public bool HasDuplicateWarning { get; set; }
        public string? DuplicateWarning { get; set; }
    }

    public class LeadTimelineEntryViewModel
    {
        public Guid Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
