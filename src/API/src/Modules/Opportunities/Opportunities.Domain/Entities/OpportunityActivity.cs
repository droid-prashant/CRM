using ERP.Core.Entities;

namespace Opportunities.Domain.Entities
{
    public class OpportunityActivity : BaseEntity
    {
        public Guid OpportunityId { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime ActivityDate { get; set; }
        public DateTime? FollowUpDate { get; set; }

        public Opportunity? Opportunity { get; set; }
    }
}
