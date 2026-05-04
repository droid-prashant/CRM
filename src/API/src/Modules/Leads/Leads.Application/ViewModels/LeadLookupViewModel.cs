namespace Leads.Application.ViewModels
{
    public class LeadLookupViewModel
    {
        public Guid Id { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPersonName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
