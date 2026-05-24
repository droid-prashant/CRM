namespace Opportunities.Application.ViewModels
{
    public class OpportunityStageHistoryViewModel
    {
        public Guid Id { get; set; }
        public Guid OpportunityId { get; set; }
        public string? FromStageName { get; set; }
        public string ToStageName { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public Guid ChangedByUserId { get; set; }
        public string? ChangedByUserName { get; set; }
        public DateTime ChangedAt { get; set; }
    }
}
