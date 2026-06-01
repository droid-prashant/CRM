namespace Clients.Application.ViewModels
{
    public class ClientListResponseViewModel
    {
        public List<ClientListItemViewModel> Items { get; set; } = new();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}
