using Clients.Domain.Enums;
using ERP.Core.Entities;

namespace Clients.Domain.Entities
{
    public class ClientContact : BaseEntity
    {
        public Guid ClientId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public string? Email { get; set; }
        public string? NormalizedEmail { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public bool IsPrimary { get; set; }
        public ClientContactStatus Status { get; set; } = ClientContactStatus.Active;
        public string? Notes { get; set; }
        public bool IsDeleted { get; set; }

        public Client? Client { get; set; }
    }
}
