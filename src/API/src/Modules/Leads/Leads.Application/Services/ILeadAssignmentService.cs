namespace Leads.Application.Services
{
    public interface ILeadAssignmentService
    {
        Task<Guid?> ResolveAssigneeAsync(Guid leadId, CancellationToken cancellationToken);
    }
}
