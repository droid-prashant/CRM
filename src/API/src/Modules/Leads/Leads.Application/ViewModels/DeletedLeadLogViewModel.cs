namespace Leads.Application.ViewModels
{
    public class DeletedLeadLogViewModel
    {
        public Guid Id { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPersonName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string SourceName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ProductNames { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? DeletedBy { get; set; }
        public string? DeletedByUserName { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}
