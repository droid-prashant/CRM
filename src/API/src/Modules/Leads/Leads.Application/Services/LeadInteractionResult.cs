using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public class LeadInteractionResult
    {
        public LeadInteractionViewModel? Interaction { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool Succeeded => Interaction != null && Errors.Count == 0;
    }
}
