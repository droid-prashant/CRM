namespace Opportunities.Application.ViewModels
{
    public class OpportunityLookupViewModel
    {
        public List<OpportunityClientLookupViewModel> Clients { get; set; } = new();
        public List<OpportunityContactLookupViewModel> Contacts { get; set; } = new();
        public List<OpportunityLookupItemViewModel> Products { get; set; } = new();
        public List<OpportunityLeadLookupViewModel> Leads { get; set; } = new();
        public List<OpportunityCurrencyLookupViewModel> Currencies { get; set; } = new();
        public List<OpportunityUserLookupViewModel> OwnerUsers { get; set; } = new();
    }

    public class OpportunityClientLookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class OpportunityContactLookupViewModel
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
    }

    public class OpportunityLookupItemViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class OpportunityLeadLookupViewModel
    {
        public Guid Id { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPersonName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class OpportunityCurrencyLookupViewModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class OpportunityUserLookupViewModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
    }
}
