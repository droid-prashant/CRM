using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedProductLookups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed ProductType (8), DeploymentType (9), OwnershipType (10) with fixed GUIDs (freshly
            // minted here, since these were previously plain int-backed enums with no table at all).
            // The Products module's own migration backfills Products.ProductType/DeploymentType/
            // OwnershipType (int) into new Guid FK columns using these exact same GUIDs.
            migrationBuilder.Sql("""
                INSERT INTO "lookups"."LookupDetails" ("Id", "LookupId", "Name", "Description", "Order", "Code", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                VALUES
                    ('91000000-0000-0000-0000-000000000001', 8, 'Software', NULL, 1, 'Software', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('91000000-0000-0000-0000-000000000002', 8, 'Service', NULL, 2, 'Service', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('91000000-0000-0000-0000-000000000003', 8, 'Addon', NULL, 3, 'Addon', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('91000000-0000-0000-0000-000000000004', 8, 'Hardware', NULL, 4, 'Hardware', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('92000000-0000-0000-0000-000000000001', 9, 'Cloud', NULL, 1, 'Cloud', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('92000000-0000-0000-0000-000000000002', 9, 'On Premise', NULL, 2, 'OnPremise', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('92000000-0000-0000-0000-000000000003', 9, 'Hybrid', NULL, 3, 'Hybrid', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('92000000-0000-0000-0000-000000000004', 9, 'Not Applicable', NULL, 4, 'NotApplicable', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('93000000-0000-0000-0000-000000000001', 10, 'In House', NULL, 1, 'InHouse', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true),
                    ('93000000-0000-0000-0000-000000000002', 10, 'Partner', NULL, 2, 'PartnerOwned', '00000000-0000-0000-0000-000000000000', now(), NULL, NULL, true)
                ON CONFLICT ("Id") DO NOTHING;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "lookups"."LookupDetails" WHERE "LookupId" IN (8, 9, 10);""");
        }
    }
}
