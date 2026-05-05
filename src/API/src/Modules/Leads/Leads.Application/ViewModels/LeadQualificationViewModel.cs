namespace Leads.Application.ViewModels
{
    public class LeadQualificationViewModel
    {
        public Guid LeadId { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPersonName { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public List<LeadProductInterestViewModel> ProductInterests { get; set; } = new();
        public Guid? AssignedToUserId { get; set; }
        public string? AssignedToUserName { get; set; }
        public DateTime? QualificationDate { get; set; }
        public string? DisqualificationReason { get; set; }
        public DateTime? LastInteractionDate { get; set; }
        public bool ConvertToOpportunityAllowed { get; set; }
    }
}
