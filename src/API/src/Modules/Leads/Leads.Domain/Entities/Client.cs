using ERP.Core.Entities;

namespace Leads.Domain.Entities
{
    public class Client : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public Guid CountryId { get; set; }
        public Guid? IndustryId { get; set; }

        public ICollection<ClientContact> Contacts { get; set; } = new List<ClientContact>();
    }
}
