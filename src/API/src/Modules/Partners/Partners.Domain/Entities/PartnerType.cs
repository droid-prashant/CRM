using ERP.Core.Entities;

namespace Partners.Domain.Entities
{
    public class PartnerType : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
