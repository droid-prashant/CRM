using Leads.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Leads.Application.Interfaces
{
    public interface ILeadsDbContext
    {
        DbSet<Lead> Leads { get; set; }
        DbSet<LeadProductInterest> LeadProductInterests { get; set; }
        DbSet<LeadTimelineEntry> LeadTimelineEntries { get; set; }
        DbSet<LeadSource> LeadSources { get; set; }
        DbSet<LeadCategory> LeadCategories { get; set; }
        DbSet<Product> Products { get; set; }
        DbSet<Partner> Partners { get; set; }
        DbSet<Country> Countries { get; set; }
        DbSet<Industry> Industries { get; set; }
        DbSet<Client> Clients { get; set; }
        DbSet<ClientContact> ClientContacts { get; set; }
        DbSet<Opportunity> Opportunities { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
