using Clients.Domain.Enums;

namespace Clients.Application.ViewModels
{
    public class ClientContactViewModel
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public bool IsPrimary { get; set; }
        public ClientContactStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
