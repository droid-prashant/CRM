using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public class CreateLeadResult
    {
        public bool Succeeded => Errors.Count == 0;
        public List<string> Errors { get; set; } = new();
        public LeadDetailViewModel? Lead { get; set; }
    }
}
