using ERP.Core.Entities;

namespace Opportunities.Domain.Entities
{
    public class OpportunityStage : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public int Sequence { get; set; }
        public bool IsDefault { get; set; }
        public bool IsFinal { get; set; }
        public bool IsWonStage { get; set; }
        public bool IsLostStage { get; set; }
        public bool IsDeleted { get; set; }
    }
}
