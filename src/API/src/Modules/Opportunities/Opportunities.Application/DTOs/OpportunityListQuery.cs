namespace Opportunities.Application.DTOs
{
    public class OpportunityListQuery
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public Guid? ClientId { get; set; }
        public string? StageId { get; set; }
        public Guid? OwnerUserId { get; set; }
        public string? Status { get; set; }
        public string? SortField { get; set; }
        public string? SortDirection { get; set; }
    }
}
