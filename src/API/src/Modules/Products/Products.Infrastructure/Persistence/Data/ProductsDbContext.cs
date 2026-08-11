using ERP.Core.Entities;
using ERP.Identity.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Products.Domain.Entities;

namespace Products.Infrastructure.Persistence.Data
{
    public class ProductsDbContext : DbContext
    {
        private readonly IUserContextService _userContextService;

        public ProductsDbContext(DbContextOptions<ProductsDbContext> options, IUserContextService userContextService) : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<LookupDetail> LookupDetails { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("products");

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products", "products", table =>
                    table.HasCheckConstraint("CK_Products_ExactlyOneBusinessModel", "\"IsSubscriptionBased\" <> \"IsLicenseBased\""));
                entity.Property(x => x.Code).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
                entity.Property(x => x.Description).HasColumnType("text");
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.Property(x => x.IsDeleted).HasDefaultValue(false);
                entity.Property(x => x.IsSubscriptionBased).HasDefaultValue(false);
                entity.Property(x => x.IsLicenseBased).HasDefaultValue(false);
                entity.HasIndex(x => x.Code).IsUnique();
                entity.HasIndex(x => new { x.Name, x.ProductTypeId, x.DeploymentTypeId });
                entity.HasIndex(x => x.OwnerPartnerId);
                entity.HasOne<LookupDetail>().WithMany().HasForeignKey(x => x.ProductTypeId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne<LookupDetail>().WithMany().HasForeignKey(x => x.DeploymentTypeId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne<LookupDetail>().WithMany().HasForeignKey(x => x.OwnershipTypeId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<LookupDetail>(entity =>
            {
                entity.ToTable("LookupDetails", "lookups", table => table.ExcludeFromMigrations());
                entity.Property(x => x.LookupId).HasConversion<int>();
            });

            ConfigureDeleteAuditColumns(modelBuilder);
        }

        private static void ConfigureDeleteAuditColumns(ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    continue;
                }

                modelBuilder.Entity(entityType.ClrType).Ignore(nameof(BaseEntity.DeletedBy));
                modelBuilder.Entity(entityType.ClrType).Ignore(nameof(BaseEntity.DeletedOn));
            }
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
