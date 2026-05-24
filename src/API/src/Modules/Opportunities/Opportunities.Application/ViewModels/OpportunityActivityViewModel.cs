namespace Opportunities.Application.ViewModels
{
    public class OpportunityActivityViewModel
    {
        public Guid Id { get; set; }
        public Guid OpportunityId { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime ActivityDate { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public Guid CreatedByUserId { get; set; }
        public string? CreatedByUserName { get; set; }
    }
}
