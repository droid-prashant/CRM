using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RepointCountry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // No physical DDL: OpportunitiesDbContext now reads Country lookups through the
            // shared lookups.LookupDetails table instead of leads.Countries directly. The FK on
            // leads.Clients.CountryId was already dropped/repointed by the Leads module's own
            // RepointCountryIndustry migration, since both contexts map the same physical table.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
