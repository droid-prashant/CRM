namespace Clients.Application.ViewModels
{
    public class ClientDetailViewModel : ClientCreatedViewModel
    {
        public List<ClientContactSummaryViewModel> Contacts { get; set; } = new();
        public List<ClientProductSummaryViewModel> Products { get; set; } = new();
        public List<ClientRelatedOpportunityViewModel> Opportunities { get; set; } = new();
        public List<ClientRelatedRfpViewModel> Rfps { get; set; } = new();
        public List<ClientDocumentSummaryViewModel> Documents { get; set; } = new();
        public List<ClientTimelineEntryViewModel> Timeline { get; set; } = new();
    }

    public class ClientContactSummaryViewModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public bool IsPrimary { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ClientProductSummaryViewModel
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string RelationshipStatus { get; set; } = string.Empty;
        public Guid? OpportunityId { get; set; }
        public string? OpportunityNumber { get; set; }
        public string? OpportunityTitle { get; set; }
        public Guid? OwnerUserId { get; set; }
        public string? OwnerUserName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Notes { get; set; }
    }

    public class ClientRelatedOpportunityViewModel
    {
        public Guid Id { get; set; }
        public string OpportunityNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? ProductName { get; set; }
        public string StageName { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ClientRelatedRfpViewModel
    {
        public Guid Id { get; set; }
        public string RfpNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? ProductName { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? SubmissionDeadline { get; set; }
    }

    public class ClientDocumentSummaryViewModel
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string? DocumentType { get; set; }
        public string? UploadedByUserName { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
