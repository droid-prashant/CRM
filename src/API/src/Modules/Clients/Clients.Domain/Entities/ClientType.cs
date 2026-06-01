using ERP.Core.Entities;

namespace Clients.Domain.Entities
{
    public class ClientType : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
