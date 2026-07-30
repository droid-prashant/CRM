namespace Opportunities.Application.DTOs
{
    public class UploadProposalVersionRequest
    {
        public string? Description { get; set; }
        public string? ProposalDocumentFileName { get; set; }
        public string? ProposalDocumentStoredFileName { get; set; }
        public string? ProposalDocumentPath { get; set; }
        public string? ProposalDocumentContentType { get; set; }
        public long? ProposalDocumentSize { get; set; }
    }
}
