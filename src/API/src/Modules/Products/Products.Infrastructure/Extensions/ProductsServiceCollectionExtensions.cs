using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Products.Application.Repositories;
using Products.Application.Services;
using Products.Infrastructure.Persistence.Data;
using Products.Infrastructure.Repositories;
using Products.Infrastructure.Services;

namespace Products.Infrastructure.Extensions
{
    public static class ProductsServiceCollectionExtensions
    {
        public static IServiceCollection AddProductsModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ProductsDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<ProductService>();
            services.AddScoped<IProductService>(provider => provider.GetRequiredService<ProductService>());
            services.AddScoped<IProductLookupService>(provider => provider.GetRequiredService<ProductService>());
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductOwnerPartnerLookupService, ProductOwnerPartnerLookupService>();

            return services;
        }
    }
}
