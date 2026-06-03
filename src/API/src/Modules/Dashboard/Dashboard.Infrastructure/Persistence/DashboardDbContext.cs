using Clients.Domain.Enums;
using ERP.Identity.Entities;
using Leads.Domain.Entities;
using Leads.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Opportunities.Domain.Entities;
using Products.Domain.Entities;
using CrmClient = Clients.Domain.Entities.Client;
using ClientProduct = Clients.Domain.Entities.ClientProduct;
using ClientTimelineEntry = Clients.Domain.Entities.ClientTimelineEntry;

namespace Dashboard.Infrastructure.Persistence
{
    public class DashboardDbContext : DbContext
    {
        public DashboardDbContext(DbContextOptions<DashboardDbContext> options) : base(options)
        {
        }

        public DbSet<Lead> Leads { get; set; }
        public DbSet<LeadSource> LeadSources { get; set; }
        public DbSet<LeadTimelineEntry> LeadTimelineEntries { get; set; }
        public DbSet<LeadInteraction> LeadInteractions { get; set; }
        public DbSet<CrmClient> Clients { get; set; }
        public DbSet<ClientProduct> ClientProducts { get; set; }
        public DbSet<ClientTimelineEntry> ClientTimelineEntries { get; set; }
        public DbSet<Opportunity> Opportunities { get; set; }
        public DbSet<OpportunityStage> OpportunityStages { get; set; }
        public DbSet<OpportunityStageHistory> OpportunityStageHistories { get; set; }
        public DbSet<OpportunityActivity> OpportunityActivities { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ApplicationUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Lead>(entity =>
            {
                entity.ToTable("Leads", "leads");
                entity.Property(x => x.Status).HasConversion<int>();
                entity.Ignore(x => x.Source);
                entity.Ignore(x => x.Category);
                entity.Ignore(x => x.Country);
                entity.Ignore(x => x.Industry);
                entity.Ignore(x => x.ProductInterests);
                entity.Ignore(x => x.TimelineEntries);
                entity.Ignore(x => x.Interactions);
            });

            modelBuilder.Entity<LeadSource>(entity =>
            {
                entity.ToTable("LeadSources", "leads");
                entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
                entity.Property(x => x.Code).HasMaxLength(50).IsRequired();
            });

            modelBuilder.Entity<LeadTimelineEntry>(entity =>
            {
                entity.ToTable("LeadTimelineEntries", "leads");
                entity.Ignore(x => x.Lead);
            });

            modelBuilder.Entity<LeadInteraction>(entity =>
            {
                entity.ToTable("LeadInteractions", "leads");
                entity.Property(x => x.InteractionType).HasConversion<string>();
                entity.Ignore(x => x.Lead);
            });

            modelBuilder.Entity<CrmClient>(entity =>
            {
                entity.ToTable("Clients", "clients");
                entity.Property(x => x.Status).HasConversion<int>().HasDefaultValue(ClientStatus.Active);
                entity.Ignore(x => x.ClientType);
                entity.Ignore(x => x.Contacts);
                entity.Ignore(x => x.Products);
                entity.Ignore(x => x.TimelineEntries);
            });

            modelBuilder.Entity<ClientProduct>(entity =>
            {
                entity.ToTable("ClientProducts", "clients");
                entity.Ignore(x => x.Client);
            });

            modelBuilder.Entity<ClientTimelineEntry>(entity =>
            {
                entity.ToTable("ClientTimelineEntries", "clients");
                entity.Ignore(x => x.Client);
            });

            modelBuilder.Entity<Opportunity>(entity =>
            {
                entity.ToTable("Opportunities", "leads");
                entity.Property(x => x.EstimatedValue).HasPrecision(18, 2);
                entity.Property(x => x.FinalAmount).HasPrecision(18, 2);
                entity.Ignore(x => x.CurrentStage);
                entity.Ignore(x => x.StageHistories);
                entity.Ignore(x => x.Activities);
            });

            modelBuilder.Entity<OpportunityStage>(entity =>
            {
                entity.ToTable("OpportunityStages", "leads");
            });

            modelBuilder.Entity<OpportunityStageHistory>(entity =>
            {
                entity.ToTable("OpportunityStageHistories", "leads");
                entity.Ignore(x => x.Opportunity);
                entity.Ignore(x => x.FromStage);
                entity.Ignore(x => x.ToStage);
            });

            modelBuilder.Entity<OpportunityActivity>(entity =>
            {
                entity.ToTable("OpportunityActivities", "leads");
                entity.Ignore(x => x.Opportunity);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products", "products");
                entity.Property(x => x.ProductType).HasConversion<int>();
                entity.Property(x => x.DeploymentType).HasConversion<int>();
                entity.Property(x => x.OwnershipType).HasConversion<int>();
            });

            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.ToTable("AspNetUsers", "public");
            });
        }
    }
}
