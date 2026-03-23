using ERP.Core.Entities;
using ERP.Identity.Services.Implementations;
using ERP.Identity.Services.Interfaces;
using Inventory.Application.Interfaces;
using Inventory.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventory.Infrastructure.Persistence.Data
{
    public class InventoryDbContext : DbContext, IInventoryDbContext
    {
        private readonly IUserContextService _userResolver;
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options, IUserContextService userResolver) : base(options)
        {
            _userResolver = userResolver;
        }

        public DbSet<Product> Products { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInformation()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();
            foreach(var entry in entries)
            {
                if(entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedOn = DateTime.UtcNow;
                    entry.Entity.CreatedBy = _userResolver.GetUserId() ?? Guid.Empty;
                }
                else if(entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedOn = DateTime.UtcNow;
                    entry.Entity.UpdatedBy = _userResolver.GetUserId() ?? Guid.Empty;
                }
            }
        }
    }
}
