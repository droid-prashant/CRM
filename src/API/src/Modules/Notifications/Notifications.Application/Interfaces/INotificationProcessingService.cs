namespace Notifications.Application.Interfaces
{
    public interface INotificationProcessingService
    {
        Task ProcessDueNotificationsAsync(string trigger, CancellationToken cancellationToken);
    }
}
