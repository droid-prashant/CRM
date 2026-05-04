using Leads.Application.Interfaces;
using Leads.Application.Repositories;
using Leads.Application.Services;
using Leads.Infrastructure.Persistence.Data;
using Leads.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Leads.Infrastructure.Extensions
{
    public static class LeadsServiceCollectionExtensions
    {
        public static IServiceCollection AddLeadsModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<LeadsDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<ILeadsDbContext>(provider => provider.GetRequiredService<LeadsDbContext>());
            services.AddScoped<ILeadAssignmentService, LeadAssignmentService>();
            services.AddScoped<ILeadLookupService, LeadLookupService>();
            services.AddScoped<ILeadService, LeadService>();
            services.AddScoped<ILeadRepository, LeadRepository>();

            return services;
        }
    }
}
