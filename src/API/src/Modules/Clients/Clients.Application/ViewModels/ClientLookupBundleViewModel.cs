namespace Clients.Application.ViewModels
{
    public class ClientLookupBundleViewModel
    {
        public List<LookupViewModel> ClientTypes { get; set; } = new();
        public List<LookupViewModel> Countries { get; set; } = new();
        public List<LookupViewModel> Industries { get; set; } = new();
        public List<ClientUserLookupViewModel> AccountOwners { get; set; } = new();
    }
}
