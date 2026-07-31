using Notifications.Application.DTOs;
using Notifications.Application.ViewModels;

namespace Notifications.Application.Interfaces
{
    public interface INotificationConfigurationService
    {
        Task<IReadOnlyList<NotificationConfigurationViewModel>> GetConfigurationsAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<NotificationEventTypeViewModel>> GetEventTypesAsync(CancellationToken cancellationToken);
        Task<NotificationProcessorStatusViewModel> GetProcessorStatusAsync(CancellationToken cancellationToken);
        Task<NotificationConfigurationViewModel> UpdateConfigurationAsync(string eventType, NotificationConfigurationRequest request, CancellationToken cancellationToken);
        Task<IReadOnlyList<InAppNotificationViewModel>> GetMyNotificationsAsync(CancellationToken cancellationToken);
        Task<NotificationOperationResult> MarkAsReadAsync(Guid notificationId, CancellationToken cancellationToken);
        Task<NotificationOperationResult> MarkAllAsReadAsync(CancellationToken cancellationToken);
        Task<NotificationOperationResult> ResolveEventAsync(ResolveNotificationEventRequest request, CancellationToken cancellationToken);
    }
}
