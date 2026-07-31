using Notifications.Application.ViewModels;

namespace Notifications.Application.Interfaces
{
    public interface INotificationProcessorStatusStore
    {
        NotificationProcessorStatusViewModel GetStatus();
        void MarkStarted(string trigger);
        void MarkCompleted(string trigger, bool succeeded, string message);
    }
}
