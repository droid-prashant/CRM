namespace Opportunities.Application.DTOs
{
    public class ChangeOpportunityStageRequest
    {
        public Guid StageId { get; set; }
        public string? Remarks { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? ProposalDocumentFileName { get; set; }
        public string? ProposalDocumentStoredFileName { get; set; }
        public string? ProposalDocumentPath { get; set; }
        public string? ProposalDocumentContentType { get; set; }
        public long? ProposalDocumentSize { get; set; }
    }
}
