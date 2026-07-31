using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public class OpportunityCommercialBreakdownQueryResult
    {
        public OpportunityCommercialBreakdownViewModel? Breakdown { get; set; }
        public bool NotFound { get; set; }
        public bool Forbidden { get; set; }
        public bool Succeeded => !NotFound && !Forbidden;
    }
}
