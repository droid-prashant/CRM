using ERP.Core.Entities;

namespace Leads.Domain.Entities
{
    public class LeadProductInterest : BaseEntity
    {
        public Guid LeadId { get; set; }
        public Guid ProductId { get; set; }

        public Lead? Lead { get; set; }
        public Product? Product { get; set; }
    }
}
