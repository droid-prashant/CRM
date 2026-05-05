using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public class LeadQualificationResult
    {
        public bool Succeeded => Errors.Count == 0 && Qualification != null;
        public LeadQualificationResultViewModel? Qualification { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
