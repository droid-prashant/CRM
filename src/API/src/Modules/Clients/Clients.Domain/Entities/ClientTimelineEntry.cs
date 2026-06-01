using ERP.Core.Entities;

namespace Clients.Domain.Entities
{
    public class ClientTimelineEntry : BaseEntity
    {
        public Guid ClientId { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public Client? Client { get; set; }
    }
}
