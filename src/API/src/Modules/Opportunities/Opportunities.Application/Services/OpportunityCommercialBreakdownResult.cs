using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public class OpportunityCommercialBreakdownResult
    {
        public OpportunityCommercialBreakdownViewModel? Breakdown { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool NotFound { get; set; }
        public bool Forbidden { get; set; }
        public bool Succeeded => Breakdown != null && Errors.Count == 0 && !NotFound && !Forbidden;
    }
}
