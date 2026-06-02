using ERP.Core.Entities;

namespace Clients.Domain.Entities
{
    public class ClientProduct : BaseEntity
    {
        public Guid ClientId { get; set; }
        public Guid ProductId { get; set; }
        public string RelationshipStatus { get; set; } = string.Empty;
        public Guid? OpportunityId { get; set; }
        public Guid? OwnerUserId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Notes { get; set; }
        public bool IsDeleted { get; set; }

        public Client? Client { get; set; }
    }
}
