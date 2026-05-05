namespace Leads.Application.DTOs
{
    public class UpdateLeadStatusRequest
    {
        public string Status { get; set; } = string.Empty;
        public string? DisqualificationReason { get; set; }
        public string? Remarks { get; set; }
    }
}
