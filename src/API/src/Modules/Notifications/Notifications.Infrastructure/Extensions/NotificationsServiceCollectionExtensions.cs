using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Notifications.Application.Interfaces;
using Notifications.Infrastructure.Options;
using Notifications.Infrastructure.Persistence.Data;
using Notifications.Infrastructure.Services;

namespace Notifications.Infrastructure.Extensions
{
    public static class NotificationsServiceCollectionExtensions
    {
        public static IServiceCollection AddNotificationsModule(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<NotificationsDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.Configure<SmtpOptions>(configuration.GetSection("Smtp"));
            services.Configure<NotificationProcessorOptions>(configuration.GetSection("Notifications"));

            services.AddScoped<INotificationConfigurationService, NotificationConfigurationService>();
            services.AddScoped<INotificationProcessingService, NotificationProcessingService>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddSingleton<INotificationProcessorStatusStore, NotificationProcessorStatusStore>();
            services.AddHostedService<NotificationReminderHostedService>();

            return services;
        }
    }
}
