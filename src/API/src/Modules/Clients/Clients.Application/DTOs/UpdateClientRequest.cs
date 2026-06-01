using Clients.Domain.Enums;

namespace Clients.Application.DTOs
{
    public class UpdateClientRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? ShortName { get; set; }
        public Guid? ClientTypeId { get; set; }
        public Guid? IndustryId { get; set; }
        public Guid CountryId { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? TaxNumber { get; set; }
        public string? RegistrationNumber { get; set; }
        public Guid? AccountOwnerUserId { get; set; }
        public string? Notes { get; set; }
        public ClientStatus Status { get; set; } = ClientStatus.Active;
        public bool IsActive { get; set; } = true;
    }
}
