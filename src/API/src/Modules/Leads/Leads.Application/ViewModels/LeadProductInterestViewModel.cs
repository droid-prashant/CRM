namespace Leads.Application.ViewModels
{
    public class LeadProductInterestViewModel
    {
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string? ProductCategoryName { get; set; }
    }
}
