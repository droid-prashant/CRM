namespace Leads.Application.Services
{
    public class LeadAssignmentService : ILeadAssignmentService
    {
        public Task<Guid?> ResolveAssigneeAsync(Guid leadId, CancellationToken cancellationToken)
        {
            return Task.FromResult<Guid?>(null);
        }
    }
}
