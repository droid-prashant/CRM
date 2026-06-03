namespace Dashboard.Application.DTOs
{
    public class DashboardQueryRequest
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public Guid? AssignedUserId { get; set; }
        public Guid? SourceId { get; set; }
        public string? Status { get; set; }
    }
}
