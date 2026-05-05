namespace Leads.Application.ViewModels
{
    public class LeadQualificationResultViewModel
    {
        public Guid LeadId { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? QualificationDate { get; set; }
        public string? DisqualificationReason { get; set; }
        public bool ConvertToOpportunityAllowed { get; set; }
    }
}
