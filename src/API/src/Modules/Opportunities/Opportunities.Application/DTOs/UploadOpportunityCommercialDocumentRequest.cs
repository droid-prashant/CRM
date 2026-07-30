namespace Opportunities.Application.DTOs
{
    public class UploadOpportunityCommercialDocumentRequest
    {
        public string DocumentType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string? Remarks { get; set; }
    }
}
