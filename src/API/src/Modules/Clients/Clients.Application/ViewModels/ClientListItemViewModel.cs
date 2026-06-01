using Clients.Domain.Enums;

namespace Clients.Application.ViewModels
{
    public class ClientListItemViewModel
    {
        public Guid Id { get; set; }
        public string ClientCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? ShortName { get; set; }
        public Guid? ClientTypeId { get; set; }
        public string? ClientTypeName { get; set; }
        public Guid? IndustryId { get; set; }
        public string? IndustryName { get; set; }
        public Guid CountryId { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? TaxNumber { get; set; }
        public string? RegistrationNumber { get; set; }
        public Guid? AccountOwnerUserId { get; set; }
        public string? AccountOwnerUserName { get; set; }
        public string? Notes { get; set; }
        public ClientStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public int ContactCount { get; set; }
        public int ProductCount { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
