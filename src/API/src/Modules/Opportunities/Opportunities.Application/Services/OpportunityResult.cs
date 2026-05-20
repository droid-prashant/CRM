using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public class OpportunityResult
    {
        public OpportunityListItemViewModel? Opportunity { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool Succeeded => Opportunity != null && Errors.Count == 0;
    }
}
