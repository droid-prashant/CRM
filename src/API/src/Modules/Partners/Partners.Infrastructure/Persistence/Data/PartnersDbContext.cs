using ERP.Core.Entities;
using ERP.Identity.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Partners.Domain.Entities;

namespace Partners.Infrastructure.Persistence.Data
{
    public class PartnersDbContext : DbContext
    {
        private readonly IUserContextService _userContextService;

        public PartnersDbContext(DbContextOptions<PartnersDbContext> options, IUserContextService userContextService) : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<Partner> Partners { get; set; }
        public DbSet<PartnerProduct> PartnerProducts { get; set; }
        public DbSet<PartnerType> PartnerTypes { get; set; }
        public DbSet<CountryLookup> Countries { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Partner>(entity =>
            {
                entity.ToTable("Partners", "partners");
                entity.Property(x => x.Code).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
                entity.Property(x => x.ContactPerson).HasMaxLength(150);
                entity.Property(x => x.PhoneNumber).HasMaxLength(50);
                entity.Property(x => x.Email).HasMaxLength(250);
                entity.Property(x => x.Address).HasMaxLength(500);
                entity.Property(x => x.Remarks).HasMaxLength(1000);
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => x.Code).IsUnique();
                entity.HasIndex(x => new { x.Name, x.PartnerTypeId, x.CountryId });
                entity.HasOne(x => x.PartnerType).WithMany().HasForeignKey(x => x.PartnerTypeId);
                entity.HasMany(x => x.PartnerProducts).WithOne(x => x.Partner).HasForeignKey(x => x.PartnerId);
            });

            modelBuilder.Entity<PartnerProduct>(entity =>
            {
                entity.ToTable("PartnerProducts", "partners");
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => new { x.PartnerId, x.ProductId }).IsUnique();
            });

            modelBuilder.Entity<PartnerType>(entity =>
            {
                entity.ToTable("PartnerTypes", "partners");
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => x.Code).IsUnique();
                entity.Property(x => x.Code).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
            });

            modelBuilder.Entity<CountryLookup>(entity =>
            {
                entity.ToTable("Countries", "leads");
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => x.Code).IsUnique();
                entity.Property(x => x.Code).HasMaxLength(50).IsRequired();
                entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
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
