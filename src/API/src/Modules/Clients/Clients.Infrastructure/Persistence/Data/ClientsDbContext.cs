using Clients.Domain.Entities;
using Clients.Domain.Enums;
using ERP.Core.Entities;
using ERP.Identity.Entities;
using ERP.Identity.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Opportunities.Domain.Entities;
using Products.Domain.Entities;
using Lead = Leads.Domain.Entities.Lead;
using LeadInteraction = Leads.Domain.Entities.LeadInteraction;
using LeadTimelineEntry = Leads.Domain.Entities.LeadTimelineEntry;

namespace Clients.Infrastructure.Persistence.Data
{
    public class ClientsDbContext : DbContext
    {
        private readonly IUserContextService _userContextService;

        public ClientsDbContext(DbContextOptions<ClientsDbContext> options, IUserContextService userContextService) : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientContact> ClientContacts { get; set; }
        public DbSet<ClientProduct> ClientProducts { get; set; }
        public DbSet<ClientTimelineEntry> ClientTimelineEntries { get; set; }
        public DbSet<ClientType> ClientTypes { get; set; }
        public DbSet<CountryLookup> Countries { get; set; }
        public DbSet<IndustryLookup> Industries { get; set; }
        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Opportunity> Opportunities { get; set; }
        public DbSet<OpportunityActivity> OpportunityActivities { get; set; }
        public DbSet<OpportunityStage> OpportunityStages { get; set; }
        public DbSet<OpportunityStageHistory> OpportunityStageHistories { get; set; }
        public DbSet<Lead> Leads { get; set; }
        public DbSet<LeadInteraction> LeadInteractions { get; set; }
        public DbSet<LeadTimelineEntry> LeadTimelineEntries { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("clients");

            modelBuilder.Entity<Client>(entity =>
            {
                entity.ToTable("Clients", "clients");
                entity.Property(x => x.ClientCode).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Name).HasMaxLength(250).IsRequired();
                entity.Property(x => x.NormalizedName).HasMaxLength(250).IsRequired();
                entity.Property(x => x.ShortName).HasMaxLength(100);
                entity.Property(x => x.Address).HasMaxLength(500);
                entity.Property(x => x.Website).HasMaxLength(250);
                entity.Property(x => x.TaxNumber).HasMaxLength(100);
                entity.Property(x => x.RegistrationNumber).HasMaxLength(100);
                entity.Property(x => x.Notes).HasMaxLength(2000);
                entity.Property(x => x.Status).HasConversion<int>().HasDefaultValue(ClientStatus.Active).IsRequired();
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.Property(x => x.IsDeleted).HasDefaultValue(false);
                entity.HasIndex(x => x.ClientCode).IsUnique();
                entity.HasIndex(x => new { x.NormalizedName, x.CountryId });
                entity.HasIndex(x => x.AccountOwnerUserId);
                entity.HasIndex(x => new { x.IsActive, x.IsDeleted });
                entity.HasOne(x => x.ClientType).WithMany().HasForeignKey(x => x.ClientTypeId);
                entity.HasMany(x => x.Contacts).WithOne(x => x.Client).HasForeignKey(x => x.ClientId);
                entity.HasMany(x => x.Products).WithOne(x => x.Client).HasForeignKey(x => x.ClientId);
                entity.HasMany(x => x.TimelineEntries).WithOne(x => x.Client).HasForeignKey(x => x.ClientId);
            });

            modelBuilder.Entity<ClientContact>(entity =>
            {
                entity.ToTable("ClientContacts", "clients");
                entity.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.LastName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.FullName).HasMaxLength(250).IsRequired();
                entity.Property(x => x.Designation).HasMaxLength(150);
                entity.Property(x => x.Department).HasMaxLength(150);
                entity.Property(x => x.Email).HasMaxLength(320);
                entity.Property(x => x.NormalizedEmail).HasMaxLength(320);
                entity.Property(x => x.Phone).HasMaxLength(50);
                entity.Property(x => x.Mobile).HasMaxLength(50);
                entity.Property(x => x.Notes).HasMaxLength(1000);
                entity.Property(x => x.Status).HasConversion<int>().HasDefaultValue(ClientContactStatus.Active).IsRequired();
                entity.Property(x => x.IsPrimary).HasDefaultValue(false);
                entity.Property(x => x.IsDeleted).HasDefaultValue(false);
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => x.ClientId);
                entity.HasIndex(x => new { x.ClientId, x.IsActive, x.IsDeleted });
                entity.HasIndex(x => new { x.ClientId, x.NormalizedEmail }).IsUnique().HasFilter("\"NormalizedEmail\" IS NOT NULL AND \"IsDeleted\" = false");
                entity.HasIndex(x => new { x.ClientId, x.IsPrimary }).IsUnique().HasFilter("\"IsPrimary\" = true AND \"IsDeleted\" = false");
            });

            modelBuilder.Entity<ClientProduct>(entity =>
            {
                entity.ToTable("ClientProducts", "clients");
                entity.Property(x => x.RelationshipStatus).HasMaxLength(100).IsRequired();
                entity.Property(x => x.Notes).HasMaxLength(1000);
                entity.Property(x => x.IsDeleted).HasDefaultValue(false);
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => x.ClientId);
                entity.HasIndex(x => x.ProductId);
                entity.HasIndex(x => x.OpportunityId);
                entity.HasIndex(x => x.OwnerUserId);
                entity.HasIndex(x => new { x.ClientId, x.ProductId }).IsUnique().HasFilter("\"IsDeleted\" = false");
            });

            modelBuilder.Entity<ClientTimelineEntry>(entity =>
            {
                entity.ToTable("ClientTimelineEntries", "clients");
                entity.Property(x => x.EventType).HasMaxLength(100).IsRequired();
                entity.Property(x => x.Description).HasMaxLength(1000).IsRequired();
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => new { x.ClientId, x.CreatedOn });
            });

            modelBuilder.Entity<ClientType>(entity =>
            {
                entity.ToTable("ClientTypes", "clients");
                entity.Property(x => x.Code).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => x.Code).IsUnique();
            });

            ConfigureLookup<CountryLookup>(modelBuilder, "Countries", "leads");
            ConfigureLookup<IndustryLookup>(modelBuilder, "Industries", "leads");

            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.ToTable("AspNetUsers", "public");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products", "products");
            });

            modelBuilder.Entity<Opportunity>(entity =>
            {
                entity.ToTable("Opportunities", "leads");
                entity.Ignore(x => x.CurrentStage);
                entity.Ignore(x => x.StageHistories);
                entity.Ignore(x => x.Activities);
            });

            modelBuilder.Entity<OpportunityActivity>(entity =>
            {
                entity.ToTable("OpportunityActivities", "leads");
                entity.Property(x => x.ActivityType).HasMaxLength(30).IsRequired();
                entity.Property(x => x.Subject).HasMaxLength(250);
                entity.Ignore(x => x.Opportunity);
            });

            modelBuilder.Entity<OpportunityStage>(entity =>
            {
                entity.ToTable("OpportunityStages", "leads");
                entity.Property(x => x.Name).HasMaxLength(100).IsRequired();
                entity.Property(x => x.IsDeleted).HasDefaultValue(false);
            });

            modelBuilder.Entity<OpportunityStageHistory>(entity =>
            {
                entity.ToTable("OpportunityStageHistories", "leads");
                entity.Property(x => x.Remarks).HasMaxLength(1000);
                entity.Ignore(x => x.Opportunity);
                entity.Ignore(x => x.FromStage);
                entity.Ignore(x => x.ToStage);
            });

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

            modelBuilder.Entity<LeadInteraction>(entity =>
            {
                entity.ToTable("LeadInteractions", "leads");
                entity.Property(x => x.InteractionType).HasConversion<string>().HasMaxLength(30).IsRequired();
                entity.Property(x => x.Subject).HasMaxLength(250);
                entity.Ignore(x => x.Lead);
            });

            modelBuilder.Entity<LeadTimelineEntry>(entity =>
            {
                entity.ToTable("LeadTimelineEntries", "leads");
                entity.Property(x => x.EventType).HasMaxLength(100).IsRequired();
                entity.Ignore(x => x.Lead);
            });
        }

        private static void ConfigureLookup<T>(ModelBuilder modelBuilder, string tableName, string schema) where T : BaseEntity
        {
            modelBuilder.Entity<T>(entity =>
            {
                entity.ToTable(tableName, schema);
                entity.Property("Code").HasMaxLength(50).IsRequired();
                entity.Property("Name").HasMaxLength(150).IsRequired();
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex("Code").IsUnique();
            });
        }

        private void ApplyAuditInformation()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();
            var userId = _userContextService.GetUserId() ?? Guid.Empty;

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity.Id == Guid.Empty)
                    {
                        entry.Entity.Id = Guid.NewGuid();
                    }

                    entry.Entity.CreatedOn = DateTime.UtcNow;
                    entry.Entity.CreatedBy = userId;
                    entry.Entity.IsActive = true;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedOn = DateTime.UtcNow;
                    entry.Entity.UpdatedBy = userId;
                }
            }
        }
    }
}
