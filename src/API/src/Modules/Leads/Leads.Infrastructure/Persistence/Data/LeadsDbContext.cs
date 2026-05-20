using ERP.Core.Entities;
using ERP.Identity.Services.Interfaces;
using Leads.Application.Interfaces;
using Leads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Opportunities.Domain.Entities;

namespace Leads.Infrastructure.Persistence.Data
{
    public class LeadsDbContext : DbContext, ILeadsDbContext
    {
        private readonly IUserContextService _userContextService;

        public LeadsDbContext(DbContextOptions<LeadsDbContext> options, IUserContextService userContextService) : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<Lead> Leads { get; set; }
        public DbSet<LeadProductInterest> LeadProductInterests { get; set; }
        public DbSet<LeadTimelineEntry> LeadTimelineEntries { get; set; }
        public DbSet<LeadInteraction> LeadInteractions { get; set; }
        public DbSet<LeadSource> LeadSources { get; set; }
        public DbSet<LeadCategory> LeadCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Partner> Partners { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Industry> Industries { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientContact> ClientContacts { get; set; }
        public DbSet<Opportunity> Opportunities { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("leads");

            modelBuilder.Entity<Lead>(entity =>
            {
                entity.HasIndex(x => x.LeadNumber).IsUnique();
                entity.Property(x => x.LeadNumber).HasMaxLength(30).IsRequired();
                entity.Property(x => x.CompanyName).HasMaxLength(250).IsRequired();
                entity.Property(x => x.ContactPersonName).HasMaxLength(200).IsRequired();
                entity.Property(x => x.Email).HasMaxLength(250);
                entity.Property(x => x.Phone).HasMaxLength(50);
                entity.Property(x => x.Status).HasConversion<int>();
                entity.HasOne<Opportunity>().WithMany().HasForeignKey(x => x.ConvertedOpportunityId);
                entity.HasMany(x => x.ProductInterests).WithOne(x => x.Lead).HasForeignKey(x => x.LeadId);
                entity.HasMany(x => x.TimelineEntries).WithOne(x => x.Lead).HasForeignKey(x => x.LeadId);
                entity.HasMany(x => x.Interactions).WithOne(x => x.Lead).HasForeignKey(x => x.LeadId);
            });

            modelBuilder.Entity<LeadProductInterest>(entity =>
            {
                entity.HasIndex(x => new { x.LeadId, x.ProductId }).IsUnique();
                entity.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId);
            });

            modelBuilder.Entity<LeadInteraction>(entity =>
            {
                entity.Property(x => x.InteractionType).HasConversion<string>().HasMaxLength(30).IsRequired();
                entity.Property(x => x.Subject).HasMaxLength(250);
                entity.Property(x => x.Notes).HasMaxLength(2000).IsRequired();
                entity.HasIndex(x => new { x.LeadId, x.InteractionDate });
            });

            modelBuilder.Entity<Client>(entity =>
            {
                entity.Property(x => x.Name).HasMaxLength(250).IsRequired();
                entity.HasIndex(x => x.Name);
                entity.HasOne(x => x.Country).WithMany().HasForeignKey(x => x.CountryId);
                entity.HasOne(x => x.Industry).WithMany().HasForeignKey(x => x.IndustryId);
                entity.HasMany(x => x.Contacts).WithOne(x => x.Client).HasForeignKey(x => x.ClientId);
            });

            modelBuilder.Entity<ClientContact>(entity =>
            {
                entity.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.LastName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.Email).HasMaxLength(250);
                entity.Property(x => x.Phone).HasMaxLength(50);
                entity.HasIndex(x => new { x.ClientId, x.Email });
            });

            modelBuilder.Entity<Opportunity>(entity =>
            {
                entity.HasIndex(x => x.OpportunityNumber).IsUnique();
                entity.Property(x => x.OpportunityNumber).HasMaxLength(30).IsRequired();
                entity.Property(x => x.Title).HasMaxLength(250).IsRequired();
                entity.Property(x => x.EstimatedValue).HasPrecision(18, 2);
                entity.Property(x => x.Stage).HasMaxLength(50).IsRequired();
                entity.HasOne<Lead>().WithMany().HasForeignKey(x => x.LeadId);
                entity.HasOne<Product>().WithMany().HasForeignKey(x => x.ProductId);
                entity.HasOne<Client>().WithMany().HasForeignKey(x => x.ClientId);
                entity.HasOne<ClientContact>().WithMany().HasForeignKey(x => x.ContactId);
            });

            ConfigureLookup<LeadSource>(modelBuilder);
            ConfigureLookup<LeadCategory>(modelBuilder);
            ConfigureLookup<Product>(modelBuilder);
            ConfigureLookup<Partner>(modelBuilder);
            ConfigureLookup<Country>(modelBuilder);
            ConfigureLookup<Industry>(modelBuilder);
        }

        private static void ConfigureLookup<T>(ModelBuilder modelBuilder) where T : BaseEntity
        {
            modelBuilder.Entity<T>().Property(nameof(BaseEntity.IsActive)).HasDefaultValue(true);
            modelBuilder.Entity<T>().HasIndex("Code").IsUnique();
            modelBuilder.Entity<T>().Property("Code").HasMaxLength(50).IsRequired();
            modelBuilder.Entity<T>().Property("Name").HasMaxLength(150).IsRequired();
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
