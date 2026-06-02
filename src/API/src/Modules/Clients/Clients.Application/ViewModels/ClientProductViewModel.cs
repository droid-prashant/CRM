namespace Clients.Application.ViewModels
{
    public class ClientProductViewModel
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string RelationshipStatus { get; set; } = string.Empty;
        public Guid? OpportunityId { get; set; }
        public string? OpportunityNumber { get; set; }
        public string? OpportunityTitle { get; set; }
        public Guid? OwnerUserId { get; set; }
        public string? OwnerUserName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Notes { get; set; }
    }
}
