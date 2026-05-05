namespace Leads.Application.ViewModels
{
    public class LeadAssignmentResultViewModel
    {
        public Guid LeadId { get; set; }
        public string LeadNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public Guid AssignedToUserId { get; set; }
        public string? AssignedToUserName { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
