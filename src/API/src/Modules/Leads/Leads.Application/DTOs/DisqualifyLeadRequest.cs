namespace Leads.Application.DTOs
{
    public class DisqualifyLeadRequest
    {
        public string DisqualificationReason { get; set; } = string.Empty;
        public string? DisqualificationRemarks { get; set; }
    }
}
