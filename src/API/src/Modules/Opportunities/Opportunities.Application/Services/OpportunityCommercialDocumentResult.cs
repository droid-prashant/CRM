using Opportunities.Application.ViewModels;

namespace Opportunities.Application.Services
{
    public class OpportunityCommercialDocumentResult
    {
        public OpportunityCommercialDocumentViewModel? Document { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool NotFound { get; set; }
        public bool Forbidden { get; set; }
        public bool Deleted { get; set; }
        public bool Succeeded => (Document != null || Deleted) && Errors.Count == 0 && !NotFound && !Forbidden;
    }
}
