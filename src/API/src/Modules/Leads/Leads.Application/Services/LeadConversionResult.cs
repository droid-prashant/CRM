using Leads.Application.ViewModels;

namespace Leads.Application.Services
{
    public class LeadConversionResult
    {
        public bool Succeeded => Errors.Count == 0 && Opportunity != null;
        public OpportunityCreatedViewModel? Opportunity { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
