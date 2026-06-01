using Clients.Domain.Enums;

namespace Clients.Application.DTOs
{
    public class UpdateClientContactRequest
    {
        public Guid ContactId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public ClientContactStatus Status { get; set; } = ClientContactStatus.Active;
        public string? Notes { get; set; }
    }
}
