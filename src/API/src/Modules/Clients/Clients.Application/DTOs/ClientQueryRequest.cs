using Clients.Domain.Enums;

namespace Clients.Application.DTOs
{
    public class ClientQueryRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public Guid? CountryId { get; set; }
        public Guid? IndustryId { get; set; }
        public ClientStatus? Status { get; set; }
        public Guid? AccountOwnerUserId { get; set; }
        public string? SortBy { get; set; }
        public string? SortDirection { get; set; }
    }
}
