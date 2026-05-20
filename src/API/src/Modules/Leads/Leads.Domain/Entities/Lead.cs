using ERP.Core.Entities;
using Leads.Domain.Enums;

namespace Leads.Domain.Entities
{
    public class Lead : BaseEntity
    {
        public string LeadNumber { get; set; } = string.Empty;
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
        public LeadStatus Status { get; set; } = LeadStatus.New;
        public Guid? AssignedToUserId { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? QualificationDate { get; set; }
        public string? DisqualificationReason { get; set; }
        public Guid? ConvertedOpportunityId { get; set; }

        public LeadSource? Source { get; set; }
        public LeadCategory? Category { get; set; }
        public Partner? Partner { get; set; }
        public Country? Country { get; set; }
        public Industry? Industry { get; set; }
        public Opportunity? ConvertedOpportunity { get; set; }
        public ICollection<LeadProductInterest> ProductInterests { get; set; } = new List<LeadProductInterest>();
        public ICollection<LeadTimelineEntry> TimelineEntries { get; set; } = new List<LeadTimelineEntry>();
        public ICollection<LeadInteraction> Interactions { get; set; } = new List<LeadInteraction>();
    }
}
