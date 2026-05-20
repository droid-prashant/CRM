using ERP.Core.Entities;
using Leads.Domain.Enums;

namespace Leads.Domain.Entities
{
    public class LeadInteraction : BaseEntity
    {
        public Guid LeadId { get; set; }
        public LeadInteractionType InteractionType { get; set; }
        public string? Subject { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime InteractionDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }

        public Lead? Lead { get; set; }
    }
}
