namespace Clients.Application.ViewModels
{
    public class ClientFilterLookupViewModel
    {
        public List<LookupViewModel> Countries { get; set; } = new();
        public List<LookupViewModel> Industries { get; set; } = new();
        public List<LookupViewModel> Statuses { get; set; } = new();
        public List<ClientUserLookupViewModel> AccountOwners { get; set; } = new();
    }
}
