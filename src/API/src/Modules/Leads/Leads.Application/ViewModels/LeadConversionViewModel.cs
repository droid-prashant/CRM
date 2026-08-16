namespace Leads.Application.ViewModels
{
    public class LeadConversionViewModel
    {
        public Guid LeadId { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPersonName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public Guid? SelectedClientId { get; set; }
        public Guid? SelectedContactId { get; set; }
        public List<LeadProductInterestViewModel> ProductInterests { get; set; } = new();
        public List<ClientLookupViewModel> ExistingClients { get; set; } = new();
        public List<ContactLookupViewModel> ExistingContacts { get; set; } = new();
        public List<LookupViewModel> Countries { get; set; } = new();
        public List<LookupViewModel> Industries { get; set; } = new();
        public List<CurrencyLookupViewModel> Currencies { get; set; } = new();
        public Guid? DefaultCurrencyId { get; set; }
        public List<LeadUserLookupViewModel> OwnerUsers { get; set; } = new();
        public Guid? DefaultOwnerUserId { get; set; }
        public string? DefaultOwnerUserName { get; set; }
        public bool CanConvert { get; set; }
    }

    public class ClientLookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class ContactLookupViewModel
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
    }

    public class CurrencyLookupViewModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class LeadUserLookupViewModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
    }
}
