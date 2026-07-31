using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Notifications.Application.Interfaces;
using Notifications.Domain.Constants;
using Notifications.Infrastructure.Options;

namespace Notifications.Infrastructure.Services
{
    public class NotificationReminderHostedService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IOptions<NotificationProcessorOptions> _options;
        private readonly ILogger<NotificationReminderHostedService> _logger;

        public NotificationReminderHostedService(
            IServiceProvider serviceProvider,
            IOptions<NotificationProcessorOptions> options,
            ILogger<NotificationReminderHostedService> logger)
        {
            _serviceProvider = serviceProvider;
            _options = options;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!_options.Value.Enabled)
            {
                _logger.LogInformation("Notification background processor is disabled.");
                return;
            }

            _logger.LogInformation("Notification background processor started. Interval: {IntervalMinutes} minutes.", Math.Max(5, _options.Value.ProcessorIntervalMinutes));
            await Task.Delay(TimeSpan.FromSeconds(20), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var service = scope.ServiceProvider.GetRequiredService<INotificationProcessingService>();
                    await service.ProcessDueNotificationsAsync(NotificationProcessingTriggers.Background, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    return;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Notification reminder processing failed.");
                }

                var interval = Math.Max(5, _options.Value.ProcessorIntervalMinutes);
                await Task.Delay(TimeSpan.FromMinutes(interval), stoppingToken);
            }
        }
    }
}
