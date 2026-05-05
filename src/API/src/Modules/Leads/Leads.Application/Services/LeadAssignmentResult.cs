using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public class LeadAssignmentResult
    {
        public bool Succeeded => Errors.Count == 0 && Assignment != null;
        public LeadAssignmentResultViewModel? Assignment { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
