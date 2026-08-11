using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedLeadSourceCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed LeadSource (6) and LeadCategory (7) from their existing dedicated tables, preserving
            // Id and Code so the FK added on leads.Leads in the Leads module's own migration resolves
            // correctly, and so LeadService's Code-based PARTNER/CAMPAIGN checks keep working unchanged.
            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                SELECT "Id", 6, "Name", NULL, (ROW_NUMBER() OVER (ORDER BY "Name"))::int, "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive"
                FROM "leads"."LeadSources"
                ON CONFLICT ("Id") DO NOTHING;
                """);

            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                SELECT "Id", 7, "Name", NULL, (ROW_NUMBER() OVER (ORDER BY "Name"))::int, "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive"
                FROM "leads"."LeadCategories"
                ON CONFLICT ("Id") DO NOTHING;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "lookups"."LookupDetails" WHERE "LookupId" IN (6, 7);""");
        }
    }
}
