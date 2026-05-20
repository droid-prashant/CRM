using ERP.Core.Entities;
using ERP.Identity.Services.Interfaces;
using Leads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Opportunities.Domain.Entities;

namespace Opportunities.Infrastructure.Persistence.Data
{
    public class OpportunitiesDbContext : DbContext
    {
        private readonly IUserContextService _userContextService;

        public OpportunitiesDbContext(DbContextOptions<OpportunitiesDbContext> options, IUserContextService userContextService) : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<Opportunity> Opportunities { get; set; }
        public DbSet<Lead> Leads { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientContact> ClientContacts { get; set; }
        public DbSet<Country> Countries { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Opportunity>(entity =>
            {
                entity.ToTable("Opportunities", "leads");
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

            modelBuilder.Entity<Lead>(entity =>
            {
                entity.ToTable("Leads", "leads");
                entity.Property(x => x.Status).HasConversion<int>();
                entity.Ignore(x => x.Source);
                entity.Ignore(x => x.Category);
                entity.Ignore(x => x.Partner);
                entity.Ignore(x => x.Country);
                entity.Ignore(x => x.Industry);
                entity.Ignore(x => x.ProductInterests);
                entity.Ignore(x => x.TimelineEntries);
                entity.Ignore(x => x.Interactions);
            });

            modelBuilder.Entity<Product>(entity => ConfigureLookup(entity, "Products"));
            modelBuilder.Entity<Country>(entity => ConfigureLookup(entity, "Countries"));

            modelBuilder.Entity<Client>(entity =>
            {
                entity.ToTable("Clients", "leads");
                entity.Property(x => x.Name).HasMaxLength(250).IsRequired();
                entity.HasOne(x => x.Country).WithMany().HasForeignKey(x => x.CountryId);
                entity.Ignore(x => x.Industry);
                entity.Ignore(x => x.Contacts);
            });

            modelBuilder.Entity<ClientContact>(entity =>
            {
                entity.ToTable("ClientContacts", "leads");
                entity.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.LastName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.Email).HasMaxLength(250);
                entity.Property(x => x.Phone).HasMaxLength(50);
                entity.Ignore(x => x.Client);
            });
        }

        private static void ConfigureLookup<T>(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<T> entity, string tableName) where T : BaseEntity
        {
            entity.ToTable(tableName, "leads");
            entity.Property(nameof(BaseEntity.IsActive)).HasDefaultValue(true);
            entity.HasIndex("Code").IsUnique();
            entity.Property("Code").HasMaxLength(50).IsRequired();
            entity.Property("Name").HasMaxLength(150).IsRequired();
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
