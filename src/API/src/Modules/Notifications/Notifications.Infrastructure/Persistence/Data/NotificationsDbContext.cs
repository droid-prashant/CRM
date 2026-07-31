using ERP.Core.Entities;
using ERP.Identity.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Notifications.Domain.Entities;

namespace Notifications.Infrastructure.Persistence.Data
{
    public class NotificationsDbContext : DbContext
    {
        private readonly IUserContextService _userContextService;

        public NotificationsDbContext(DbContextOptions<NotificationsDbContext> options, IUserContextService userContextService) : base(options)
        {
            _userContextService = userContextService;
        }

        public DbSet<NotificationConfiguration> NotificationConfigurations { get; set; }
        public DbSet<NotificationReminderInterval> NotificationReminderIntervals { get; set; }
        public DbSet<InAppNotification> InAppNotifications { get; set; }
        public DbSet<NotificationDeliveryLog> NotificationDeliveryLogs { get; set; }
        public DbSet<NotificationResolution> NotificationResolutions { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("notifications");

            modelBuilder.Entity<NotificationConfiguration>(entity =>
            {
                entity.Property(x => x.EventType).HasMaxLength(80).IsRequired();
                entity.Property(x => x.DisplayName).HasMaxLength(150).IsRequired();
                entity.Property(x => x.SubjectTemplate).HasMaxLength(500).IsRequired();
                entity.Property(x => x.BodyTemplate).HasColumnType("text").IsRequired();
                entity.HasIndex(x => x.EventType).IsUnique();
                entity.HasMany(x => x.ReminderIntervals).WithOne(x => x.Configuration).HasForeignKey(x => x.ConfigurationId);
            });

            modelBuilder.Entity<NotificationReminderInterval>(entity =>
            {
                entity.HasIndex(x => new { x.ConfigurationId, x.DaysBeforeDue }).IsUnique();
            });

            modelBuilder.Entity<InAppNotification>(entity =>
            {
                entity.Property(x => x.Title).HasMaxLength(300).IsRequired();
                entity.Property(x => x.Message).HasColumnType("text").IsRequired();
                entity.Property(x => x.EventType).HasMaxLength(80).IsRequired();
                entity.Property(x => x.SourceRecordType).HasMaxLength(80).IsRequired();
                entity.Property(x => x.RelatedUrl).HasMaxLength(500);
                entity.HasIndex(x => new { x.RecipientUserId, x.IsRead, x.CreatedOn });
                entity.HasIndex(x => new { x.EventType, x.SourceRecordType, x.SourceRecordId, x.SourceDueDate });
            });

            modelBuilder.Entity<NotificationDeliveryLog>(entity =>
            {
                entity.Property(x => x.EventType).HasMaxLength(80).IsRequired();
                entity.Property(x => x.SourceRecordType).HasMaxLength(80).IsRequired();
                entity.Property(x => x.ReminderKey).HasMaxLength(80).IsRequired();
                entity.Property(x => x.Channel).HasMaxLength(30).IsRequired();
                entity.Property(x => x.RecipientEmail).HasMaxLength(320);
                entity.Property(x => x.Status).HasMaxLength(30).IsRequired();
                entity.Property(x => x.ErrorMessage).HasMaxLength(2000);
                entity.HasIndex(x => new { x.EventType, x.SourceRecordType, x.SourceRecordId, x.SourceDueDate, x.ReminderKey, x.Channel, x.RecipientUserId })
                    .IsUnique()
                    .HasDatabaseName("UX_NotificationDeliveryLogs_DeliveryKey")
                    .HasFilter("\"IsActive\" = true");
                entity.HasIndex(x => new { x.Channel, x.Status, x.CreatedOn });
            });

            modelBuilder.Entity<NotificationResolution>(entity =>
            {
                entity.Property(x => x.EventType).HasMaxLength(80).IsRequired();
                entity.Property(x => x.SourceRecordType).HasMaxLength(80).IsRequired();
                entity.Property(x => x.ResolutionRemarks).HasMaxLength(1000);
                entity.HasIndex(x => new { x.EventType, x.SourceRecordType, x.SourceRecordId, x.SourceDueDate, x.IsResolved });
            });

            IgnoreDeleteAuditColumns(modelBuilder);
        }

        private static void IgnoreDeleteAuditColumns(ModelBuilder modelBuilder)
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
