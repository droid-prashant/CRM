using ERP.Core.Entities;

namespace Partners.Domain.Entities
{
    public class PartnerProduct : BaseEntity
    {
        public Guid PartnerId { get; set; }
        public Guid ProductId { get; set; }

        public Partner? Partner { get; set; }
    }
}
