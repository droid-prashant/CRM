using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Partners.Application.Repositories;
using Partners.Application.Services;
using Partners.Infrastructure.Persistence.Data;
using Partners.Infrastructure.Repositories;

namespace Partners.Infrastructure.Extensions
{
    public static class PartnersServiceCollectionExtensions
    {
        public static IServiceCollection AddPartnersModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<PartnersDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IPartnerService, PartnerService>();
            services.AddScoped<IPartnerLookupService, PartnerService>();
            services.AddScoped<IPartnerRepository, PartnerRepository>();

            return services;
        }
    }
}
