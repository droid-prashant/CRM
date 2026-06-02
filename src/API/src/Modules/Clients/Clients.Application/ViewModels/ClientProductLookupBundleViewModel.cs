namespace Clients.Application.ViewModels
{
    public class ClientProductLookupBundleViewModel
    {
        public List<LookupViewModel> Products { get; set; } = new();
        public List<ClientUserLookupViewModel> Owners { get; set; } = new();
        public List<ClientOpportunityLookupViewModel> Opportunities { get; set; } = new();
        public List<LookupViewModel> RelationshipStatuses { get; set; } = new();
    }

    public class ClientOpportunityLookupViewModel
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public Guid ProductId { get; set; }
        public string OpportunityNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string DisplayName => $"{OpportunityNumber} - {Title}";
    }
}
