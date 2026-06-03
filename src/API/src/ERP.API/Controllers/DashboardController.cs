using Dashboard.Application.DTOs;
using Dashboard.Application.Services;
using Dashboard.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [Authorize]
    public class DashboardController : BaseApiController
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public Task<DashboardViewModel> GetDashboard([FromQuery] DashboardQueryRequest query, CancellationToken cancellationToken)
        {
            return _dashboardService.GetDashboardAsync(query, cancellationToken);
        }

        [HttpGet("filters")]
        public Task<DashboardFilterOptionsViewModel> GetFilterOptions(CancellationToken cancellationToken)
        {
            return _dashboardService.GetFilterOptionsAsync(cancellationToken);
        }
    }
}
