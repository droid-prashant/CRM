using ERP.Core.Entities;

namespace Opportunities.Domain.Entities
{
    public class OpportunityStageHistory : BaseEntity
    {
        public Guid OpportunityId { get; set; }
        public Guid? FromStageId { get; set; }
        public Guid ToStageId { get; set; }
        public string? Remarks { get; set; }

        public Opportunity? Opportunity { get; set; }
        public OpportunityStage? FromStage { get; set; }
        public OpportunityStage? ToStage { get; set; }
    }
}
