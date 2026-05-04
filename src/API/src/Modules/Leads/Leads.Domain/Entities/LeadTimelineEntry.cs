using ERP.Core.Entities;

namespace Leads.Domain.Entities
{
    public class LeadTimelineEntry : BaseEntity
    {
        public Guid LeadId { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public Lead? Lead { get; set; }
    }
}
