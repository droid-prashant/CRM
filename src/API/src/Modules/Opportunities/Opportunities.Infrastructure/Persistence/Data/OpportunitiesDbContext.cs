using ERP.Core.Entities;
using ERP.Identity.Services.Interfaces;
using Leads.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Opportunities.Domain.Entities;
using Products.Domain.Entities;
using CrmClient = Clients.Domain.Entities.Client;
using CrmClientContact = Clients.Domain.Entities.ClientContact;

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
        public DbSet<CrmClient> CrmClients { get; set; }
        public DbSet<CrmClientContact> CrmClientContacts { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<OpportunityStage> OpportunityStages { get; set; }
        public DbSet<OpportunityStageHistory> OpportunityStageHistories { get; set; }
        public DbSet<OpportunityActivity> OpportunityActivities { get; set; }
        public DbSet<OpportunityDocument> OpportunityDocuments { get; set; }

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
                entity.Property(x => x.Status).HasMaxLength(30).IsRequired();
                entity.Property(x => x.FinalAmount).HasPrecision(18, 2);
                entity.Property(x => x.ClosingNote).HasMaxLength(1000);
                entity.Property(x => x.LostReason).HasMaxLength(500);
                entity.HasOne<Lead>().WithMany().HasForeignKey(x => x.LeadId);
                entity.HasOne<Product>().WithMany().HasForeignKey(x => x.ProductId);
                entity.HasOne<CrmClient>().WithMany().HasForeignKey(x => x.ClientId);
                entity.HasOne<CrmClientContact>().WithMany().HasForeignKey(x => x.ContactId);
                entity.HasOne(x => x.CurrentStage).WithMany().HasForeignKey(x => x.StageId);
            });

            modelBuilder.Entity<OpportunityStage>(entity =>
            {
                entity.ToTable("OpportunityStages", "leads");
                entity.Property(x => x.Name).HasMaxLength(100).IsRequired();
                entity.HasIndex(x => x.Name).IsUnique();
                entity.HasIndex(x => x.Sequence).IsUnique();
            });

            modelBuilder.Entity<OpportunityStageHistory>(entity =>
            {
                entity.ToTable("OpportunityStageHistories", "leads");
                entity.Property(x => x.Remarks).HasMaxLength(1000);
                entity.HasOne(x => x.Opportunity).WithMany(x => x.StageHistories).HasForeignKey(x => x.OpportunityId);
                entity.HasOne(x => x.FromStage).WithMany().HasForeignKey(x => x.FromStageId);
                entity.HasOne(x => x.ToStage).WithMany().HasForeignKey(x => x.ToStageId);
                entity.HasIndex(x => new { x.OpportunityId, x.CreatedOn });
            });

            modelBuilder.Entity<OpportunityActivity>(entity =>
            {
                entity.ToTable("OpportunityActivities", "leads");
                entity.Property(x => x.ActivityType).HasMaxLength(30).IsRequired();
                entity.Property(x => x.Subject).HasMaxLength(250);
                entity.Property(x => x.Notes).HasMaxLength(2000).IsRequired();
                entity.HasOne(x => x.Opportunity).WithMany(x => x.Activities).HasForeignKey(x => x.OpportunityId);
                entity.HasIndex(x => new { x.OpportunityId, x.ActivityDate });
            });

            modelBuilder.Entity<OpportunityDocument>(entity =>
            {
                entity.ToTable("OpportunityDocuments", "leads");
                entity.Property(x => x.DocumentType).HasMaxLength(50).IsRequired();
                entity.Property(x => x.FileName).HasMaxLength(255).IsRequired();
                entity.Property(x => x.StoredFileName).HasMaxLength(255).IsRequired();
                entity.Property(x => x.FilePath).HasMaxLength(500).IsRequired();
                entity.Property(x => x.ContentType).HasMaxLength(150).IsRequired();
                entity.HasOne(x => x.Opportunity).WithMany(x => x.Documents).HasForeignKey(x => x.OpportunityId);
                entity.HasIndex(x => new { x.OpportunityId, x.DocumentType, x.IsActive });
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

            modelBuilder.Entity<Product>(entity =>
            {
                ConfigureProduct(entity, "Products");
                entity.Property(x => x.Description).HasColumnType("text");
                entity.Property(x => x.ProductType).HasConversion<int>().IsRequired();
                entity.Property(x => x.DeploymentType).HasConversion<int>().IsRequired();
                entity.Property(x => x.IsDeleted).HasDefaultValue(false);
                entity.Property(x => x.IsSubscriptionBased).HasDefaultValue(false);
                entity.Property(x => x.IsLicenseBased).HasDefaultValue(false);
            });
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

            modelBuilder.Entity<CrmClient>(entity =>
            {
                entity.ToTable("Clients", "clients");
                entity.Property(x => x.ClientCode).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Name).HasMaxLength(250).IsRequired();
                entity.Property(x => x.NormalizedName).HasMaxLength(250).IsRequired();
                entity.Property(x => x.Status).HasConversion<int>();
                entity.Ignore(x => x.ClientType);
                entity.Ignore(x => x.Contacts);
                entity.Ignore(x => x.Products);
                entity.Ignore(x => x.TimelineEntries);
            });

            modelBuilder.Entity<CrmClientContact>(entity =>
            {
                entity.ToTable("ClientContacts", "clients");
                entity.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.LastName).HasMaxLength(100).IsRequired();
                entity.Property(x => x.FullName).HasMaxLength(250).IsRequired();
                entity.Property(x => x.NormalizedEmail).HasMaxLength(320);
                entity.Property(x => x.Status).HasConversion<int>();
                entity.Ignore(x => x.Client);
            });

            ConfigureDeleteAuditColumns(modelBuilder, typeof(Lead));
        }

        private static void ConfigureDeleteAuditColumns(ModelBuilder modelBuilder, params Type[] mappedEntityTypes)
        {
            var mappedTypes = mappedEntityTypes.ToHashSet();
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType) || mappedTypes.Contains(entityType.ClrType))
                {
                    continue;
                }

                modelBuilder.Entity(entityType.ClrType).Ignore(nameof(BaseEntity.DeletedBy));
                modelBuilder.Entity(entityType.ClrType).Ignore(nameof(BaseEntity.DeletedOn));
            }
        }

        private static void ConfigureLookup<T>(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<T> entity, string tableName) where T : BaseEntity
        {
            entity.ToTable(tableName, "leads");
            entity.Property(nameof(BaseEntity.IsActive)).HasDefaultValue(true);
            entity.HasIndex("Code").IsUnique();
            entity.Property("Code").HasMaxLength(50).IsRequired();
            entity.Property("Name").HasMaxLength(150).IsRequired();
        }

        private static void ConfigureProduct(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Product> entity, string tableName)
        {
            entity.ToTable(tableName, "products");
            entity.Property(nameof(BaseEntity.IsActive)).HasDefaultValue(true);
            entity.HasIndex(x => x.Code).IsUnique();
            entity.Property(x => x.Code).HasMaxLength(50).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
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
