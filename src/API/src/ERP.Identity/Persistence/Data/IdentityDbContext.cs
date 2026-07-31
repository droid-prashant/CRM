using ERP.Identity.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ERP.Identity.Persistance.Data
{
    public class IdentityDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(u => u.ManagerId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        }
    }
}
