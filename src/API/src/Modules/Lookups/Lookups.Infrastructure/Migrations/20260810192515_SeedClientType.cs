using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedClientType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed ClientType (4) from clients.ClientTypes, preserving Id so the FK added on
            // clients.Clients.ClientTypeId in the Clients module's own migration resolves correctly.
            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                SELECT "Id", 4, "Name", NULL, (ROW_NUMBER() OVER (ORDER BY "Name"))::int, "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive"
                FROM "clients"."ClientTypes"
                ON CONFLICT ("Id") DO NOTHING;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "lookups"."LookupDetails" WHERE "LookupId" = 4;""");
        }
    }
}
