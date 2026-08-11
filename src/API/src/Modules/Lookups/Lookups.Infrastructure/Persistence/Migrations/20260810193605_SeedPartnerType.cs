using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedPartnerType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed PartnerType (5) from partners.PartnerTypes, preserving Id so the FK added on
            // partners.Partners.PartnerTypeId in the Partners module's own migration resolves correctly.
            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                SELECT "Id", 5, "Name", NULL, (ROW_NUMBER() OVER (ORDER BY "Name"))::int, "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive"
                FROM "partners"."PartnerTypes"
                ON CONFLICT ("Id") DO NOTHING;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "lookups"."LookupDetails" WHERE "LookupId" = 5;""");
        }
    }
}
