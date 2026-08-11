using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedCountryIndustry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed Industry (1) and Country (2) from their existing dedicated tables, preserving Id
            // so the foreign keys added on Client/Lead/Partner in later migrations resolve correctly.
            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                SELECT "Id", 1, "Name", NULL, (ROW_NUMBER() OVER (ORDER BY "Name"))::int, "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive"
                FROM "leads"."Industries"
                ON CONFLICT ("Id") DO NOTHING;
                """);

            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                SELECT "Id", 2, "Name", NULL, (ROW_NUMBER() OVER (ORDER BY "Name"))::int, "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive"
                FROM "leads"."Countries"
                ON CONFLICT ("Id") DO NOTHING;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "lookups"."LookupDetails" WHERE "LookupId" IN (1, 2);""");
        }
    }
}
