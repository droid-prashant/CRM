using ERP.Core.Entities;
using Leads.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Leads.Application.Interfaces
{
    public interface ILeadsDbContext
    {
        DbSet<Lead> Leads { get; set; }
        DbSet<LeadProductInterest> LeadProductInterests { get; set; }
        DbSet<LeadTimelineEntry> LeadTimelineEntries { get; set; }
        DbSet<LeadInteraction> LeadInteractions { get; set; }
        DbSet<LookupDetail> LookupDetails { get; set; }
        DbSet<Client> Clients { get; set; }
        DbSet<ClientContact> ClientContacts { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
