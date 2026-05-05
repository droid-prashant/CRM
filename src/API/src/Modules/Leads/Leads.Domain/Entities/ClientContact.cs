using ERP.Core.Entities;

namespace Leads.Domain.Entities
{
    public class ClientContact : BaseEntity
    {
        public Guid ClientId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }

        public Client? Client { get; set; }
    }
}
