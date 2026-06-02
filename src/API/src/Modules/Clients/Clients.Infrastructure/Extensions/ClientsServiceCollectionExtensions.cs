using Clients.Application.Repositories;
using Clients.Application.Services;
using Clients.Infrastructure.Persistence.Data;
using Clients.Infrastructure.Repositories;
using Clients.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Clients.Infrastructure.Extensions
{
    public static class ClientsServiceCollectionExtensions
    {
        public static IServiceCollection AddClientsModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ClientsDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IClientService, ClientService>();
            services.AddScoped<IClientContactService, ClientContactService>();
            services.AddScoped<IClientProductService, ClientProductService>();
            services.AddScoped<IClientRepository, ClientRepository>();
            services.AddScoped<IClientContactRepository, ClientContactRepository>();
            services.AddScoped<IClientProductRepository, ClientProductRepository>();
            services.AddScoped<IClientUserLookupService, ClientUserLookupService>();

            return services;
        }
    }
}
