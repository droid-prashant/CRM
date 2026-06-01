namespace Clients.Application.ViewModels
{
    public class ClientLookupViewModel
    {
        public Guid Id { get; set; }
        public string ClientCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
    }
}
