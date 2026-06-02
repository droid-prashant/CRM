namespace Clients.Application.DTOs
{
    public class ClientTimelineQueryRequest
    {
        public string? ActivityType { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
