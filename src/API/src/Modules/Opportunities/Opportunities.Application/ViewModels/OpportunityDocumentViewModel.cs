namespace Opportunities.Application.ViewModels
{
    public class OpportunityDocumentViewModel
    {
        public Guid Id { get; set; }
        public Guid OpportunityId { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public Guid UploadedByUserId { get; set; }
        public string? UploadedByUserName { get; set; }
        public DateTime UploadedOn { get; set; }
        public int VersionNumber { get; set; }
        public string? Description { get; set; }
        public bool IsLastCommunicated { get; set; }
    }

    public class ProposalVersionViewModel
    {
        public Guid DocumentId { get; set; }
        public int VersionNumber { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public Guid UploadedByUserId { get; set; }
        public string? UploadedByUserName { get; set; }
        public DateTime UploadedOn { get; set; }
        public string? Description { get; set; }
        public bool IsLastCommunicated { get; set; }
    }
}
