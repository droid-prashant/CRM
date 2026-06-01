using Clients.Domain.Enums;

namespace Clients.Application.ViewModels
{
    public class ClientUpdatedViewModel
    {
        public Guid Id { get; set; }
        public string ClientCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
        public string? IndustryName { get; set; }
        public ClientStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public string? AccountOwnerUserName { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
