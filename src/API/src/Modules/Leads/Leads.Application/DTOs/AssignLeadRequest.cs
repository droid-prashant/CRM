namespace Leads.Application.DTOs
{
    public class AssignLeadRequest
    {
        public Guid AssignedToUserId { get; set; }
        public string? Remarks { get; set; }
    }
}
