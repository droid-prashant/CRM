using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed Currency (3) reusing the exact GUIDs already hardcoded in
            // OpportunityRepository/OpportunityService, so existing Opportunity and
            // OpportunityCommercialBreakdown rows keep resolving their CurrencyId with no data migration.
            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                VALUES
                    ('70000000-0000-0000-0000-000000000001', 3, 'Nepalese Rupee', NULL, 1, 'NPR', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('70000000-0000-0000-0000-000000000002', 3, 'US Dollar', NULL, 2, 'USD', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('70000000-0000-0000-0000-000000000003', 3, 'Indian Rupee', NULL, 3, 'INR', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true)
                ON CONFLICT ("Id") DO NOTHING;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "lookups"."LookupDetails" WHERE "LookupId" = 3;""");
        }
    }
}
