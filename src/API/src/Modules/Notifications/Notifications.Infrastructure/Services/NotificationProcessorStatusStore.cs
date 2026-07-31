using Notifications.Application.Interfaces;
using Notifications.Application.ViewModels;

namespace Notifications.Infrastructure.Services
{
    public class NotificationProcessorStatusStore : INotificationProcessorStatusStore
    {
        private readonly object _syncRoot = new();
        private readonly NotificationProcessorStatusViewModel _status = new();

        public NotificationProcessorStatusViewModel GetStatus()
        {
            lock (_syncRoot)
            {
                return new NotificationProcessorStatusViewModel
                {
                    IsRunning = _status.IsRunning,
                    CurrentTrigger = _status.CurrentTrigger,
                    LastStartedOn = _status.LastStartedOn,
                    LastCompletedOn = _status.LastCompletedOn,
                    LastTrigger = _status.LastTrigger,
                    LastSucceeded = _status.LastSucceeded,
                    LastMessage = _status.LastMessage
                };
            }
        }

        public void MarkStarted(string trigger)
        {
            lock (_syncRoot)
            {
                _status.IsRunning = true;
                _status.CurrentTrigger = trigger;
                _status.LastStartedOn = DateTime.UtcNow;
                _status.LastMessage = "Notification processing is running.";
            }
        }

        public void MarkCompleted(string trigger, bool succeeded, string message)
        {
            lock (_syncRoot)
            {
                _status.IsRunning = false;
                _status.CurrentTrigger = null;
                _status.LastCompletedOn = DateTime.UtcNow;
                _status.LastTrigger = trigger;
                _status.LastSucceeded = succeeded;
                _status.LastMessage = message;
            }
        }
    }
}
