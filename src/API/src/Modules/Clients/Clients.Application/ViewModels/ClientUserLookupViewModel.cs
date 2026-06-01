namespace Clients.Application.ViewModels
{
    public class ClientUserLookupViewModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
    }
}
