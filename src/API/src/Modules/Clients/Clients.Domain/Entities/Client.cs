using Clients.Domain.Enums;
using ERP.Core.Entities;

namespace Clients.Domain.Entities
{
    public class Client : BaseEntity
    {
        public string ClientCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string NormalizedName { get; set; } = string.Empty;
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
        public bool IsDeleted { get; set; }

        public ClientType? ClientType { get; set; }
        public ICollection<ClientContact> Contacts { get; set; } = new List<ClientContact>();
        public ICollection<ClientProduct> Products { get; set; } = new List<ClientProduct>();
        public ICollection<ClientTimelineEntry> TimelineEntries { get; set; } = new List<ClientTimelineEntry>();
    }
}
