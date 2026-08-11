using ERP.Core.Entities;
using ERP.Identity.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Lookups.Infrastructure.Persistence.Data
{
    public class LookupsDbContext : DbContext
    {
        private readonly IUserContextService _userContextService;

        public LookupsDbContext(DbContextOptions<LookupsDbContext> options, IUserContextService userContextService) : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<LookupDetail> LookupDetails { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("lookups");

            modelBuilder.Entity<LookupDetail>(entity =>
            {
                entity.ToTable("LookupDetails", "lookups");
                entity.Property(x => x.LookupId).HasConversion<int>().IsRequired();
                entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
                entity.Property(x => x.Description).HasMaxLength(500);
                entity.Property(x => x.Code).HasMaxLength(50);
                entity.Property(x => x.Order).HasDefaultValue(0);
                entity.Property(x => x.IsActive).HasDefaultValue(true);
                entity.HasIndex(x => new { x.LookupId, x.Name }).IsUnique();
                entity.Ignore(nameof(BaseEntity.DeletedBy));
                entity.Ignore(nameof(BaseEntity.DeletedOn));
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
