using ERP.Core.Entities;

namespace Clients.Infrastructure.Persistence.Data
{
    public class IndustryLookup : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
