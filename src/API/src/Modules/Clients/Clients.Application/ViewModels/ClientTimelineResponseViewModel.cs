namespace Clients.Application.ViewModels
{
    public class ClientTimelineResponseViewModel
    {
        public List<ClientTimelineViewModel> Items { get; set; } = new();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public List<string> ActivityTypes { get; set; } = new();
    }
}
