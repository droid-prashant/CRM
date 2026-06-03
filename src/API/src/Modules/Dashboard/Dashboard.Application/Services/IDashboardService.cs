using Dashboard.Application.DTOs;
using Dashboard.Application.ViewModels;

namespace Dashboard.Application.Services
{
    public interface IDashboardService
    {
        Task<DashboardViewModel> GetDashboardAsync(DashboardQueryRequest query, CancellationToken cancellationToken);
        Task<DashboardFilterOptionsViewModel> GetFilterOptionsAsync(CancellationToken cancellationToken);
    }
}
