using ERP.Identity.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Notifications.Application.DTOs;
using Notifications.Application.Interfaces;
using Notifications.Application.ViewModels;
using Notifications.Domain.Constants;

namespace ERP.API.Controllers.Notifications
{
    public class NotificationsController : BaseApiController
    {
        private readonly INotificationConfigurationService _configurationService;
        private readonly INotificationProcessingService _processingService;

        public NotificationsController(INotificationConfigurationService configurationService, INotificationProcessingService processingService)
        {
            _configurationService = configurationService;
            _processingService = processingService;
        }

        [HttpGet("configurations")]
        [Authorize(Policy = PermissionPolicyNames.NotificationsView)]
        public async Task<ActionResult<IReadOnlyList<NotificationConfigurationViewModel>>> GetConfigurations(CancellationToken cancellationToken)
        {
            return Ok(await _configurationService.GetConfigurationsAsync(cancellationToken));
        }

        [HttpGet("event-types")]
        [Authorize(Policy = PermissionPolicyNames.NotificationsView)]
        public async Task<ActionResult<IReadOnlyList<NotificationEventTypeViewModel>>> GetEventTypes(CancellationToken cancellationToken)
        {
            return Ok(await _configurationService.GetEventTypesAsync(cancellationToken));
        }

        [HttpGet("processor-status")]
        [Authorize(Policy = PermissionPolicyNames.NotificationsView)]
        public async Task<ActionResult<NotificationProcessorStatusViewModel>> GetProcessorStatus(CancellationToken cancellationToken)
        {
            return Ok(await _configurationService.GetProcessorStatusAsync(cancellationToken));
        }

        [HttpPut("configurations/{eventType}")]
        [Authorize(Policy = PermissionPolicyNames.NotificationsEdit)]
        public async Task<ActionResult<NotificationConfigurationViewModel>> UpdateConfiguration(string eventType, [FromBody] NotificationConfigurationRequest request, CancellationToken cancellationToken)
        {
            return Ok(await _configurationService.UpdateConfigurationAsync(eventType, request, cancellationToken));
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IReadOnlyList<InAppNotificationViewModel>>> GetMyNotifications(CancellationToken cancellationToken)
        {
            return Ok(await _configurationService.GetMyNotificationsAsync(cancellationToken));
        }

        [HttpPatch("{notificationId:guid}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead(Guid notificationId, CancellationToken cancellationToken)
        {
            var result = await _configurationService.MarkAsReadAsync(notificationId, cancellationToken);
            return result.Succeeded ? NoContent() : BadRequest(new { errors = new[] { result.Message } });
        }

        [HttpPatch("read-all")]
        [Authorize]
        public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken)
        {
            var result = await _configurationService.MarkAllAsReadAsync(cancellationToken);
            return result.Succeeded ? NoContent() : BadRequest(new { errors = new[] { result.Message } });
        }

        [HttpPost("resolve")]
        [Authorize]
        public async Task<IActionResult> ResolveEvent([FromBody] ResolveNotificationEventRequest request, CancellationToken cancellationToken)
        {
            var result = await _configurationService.ResolveEventAsync(request, cancellationToken);
            return result.Succeeded ? NoContent() : BadRequest(new { errors = new[] { result.Message } });
        }

        [HttpPost("process")]
        [Authorize(Policy = PermissionPolicyNames.NotificationsEdit)]
        public async Task<IActionResult> ProcessDueNotifications(CancellationToken cancellationToken)
        {
            await _processingService.ProcessDueNotificationsAsync(NotificationProcessingTriggers.Manual, cancellationToken);
            return NoContent();
        }
    }
}
