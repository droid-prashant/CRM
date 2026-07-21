using ERP.Core.Entities;

namespace Opportunities.Domain.Entities
{
    public class OpportunityDocument : BaseEntity
    {
        public Guid OpportunityId { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }

        public Opportunity? Opportunity { get; set; }
    }
}
