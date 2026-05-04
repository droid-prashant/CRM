using ERP.Core.Entities;

namespace Leads.Domain.Entities
{
    public class Industry : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
