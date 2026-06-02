namespace Clients.Application.DTOs
{
    public class CreateClientProductRequest
    {
        public Guid ClientId { get; set; }
        public Guid ProductId { get; set; }
        public string RelationshipStatus { get; set; } = string.Empty;
        public Guid? OpportunityId { get; set; }
        public Guid? OwnerUserId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Notes { get; set; }
    }
}
