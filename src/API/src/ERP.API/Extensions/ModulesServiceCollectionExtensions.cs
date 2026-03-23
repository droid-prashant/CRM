using Inventory.Application.Interfaces;
using Inventory.Application.Repositories;
using Inventory.Application.Services;
using Inventory.Infrastructure.Persistence.Data;
using Inventory.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ERP.API.Extensions
{
    public static class ModulesServiceCollectionExtensions
    {
        public static IServiceCollection RegisterAllModules(this IServiceCollection services, IConfiguration configuration)
        {
            // Each module registers its own dependencies
            services.AddSchoolModule();
            services.AddAccountsModule();
            services.AddHRModule();
            services.AddInventoryModule(configuration);

            // Future modules → just add here

            return services;
        }

        public static IServiceCollection AddDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<InventoryDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            return services;
        }


        public static IServiceCollection AddSchoolModule(this IServiceCollection services)
        {
            // Register module services here, later
            // Example: services.AddScoped<IStudentService, StudentService>();
            return services;
        }

        public static IServiceCollection AddAccountsModule(this IServiceCollection services)
        {
            // Register accounts services later
            return services;
        }


        public static IServiceCollection AddHRModule(this IServiceCollection services)
        {
            // Register module services here, later
            return services;
        }

        public static IServiceCollection AddInventoryModule(this IServiceCollection services, IConfiguration configuration)
        {
            AddDbContext(services, configuration);

            services.AddScoped<IInventoryDbContext>(x => x.GetRequiredService<InventoryDbContext>());

            services.AddScoped<IInventoryService, InventoryService>();

            services.AddScoped<IInventoryRepository, InventoryRepository>();
            return services;
        }
    }
}
