using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Partners.Infrastructure.Persistence.Data;

#nullable disable

namespace Partners.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(PartnersDbContext))]
    [Migration("20260527100000_PartnerTypeEcosystem")]
    public partial class PartnerTypeEcosystem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$
                DECLARE
                    old_sales_agent_id uuid;
                    new_sales_agent_id uuid;
                BEGIN
                    SELECT "Id" INTO old_sales_agent_id
                    FROM "partners"."PartnerTypes"
                    WHERE "Code" = 'SALES-AGENT'
                    LIMIT 1;

                    SELECT "Id" INTO new_sales_agent_id
                    FROM "partners"."PartnerTypes"
                    WHERE "Code" = 'SALES_AGENT'
                    LIMIT 1;

                    IF old_sales_agent_id IS NOT NULL AND new_sales_agent_id IS NULL THEN
                        UPDATE "partners"."PartnerTypes"
                        SET "Code" = 'SALES_AGENT',
                            "Name" = 'Sales Agent',
                            "IsActive" = true
                        WHERE "Id" = old_sales_agent_id;
                    ELSIF old_sales_agent_id IS NOT NULL AND new_sales_agent_id IS NOT NULL THEN
                        UPDATE "partners"."Partners"
                        SET "PartnerTypeId" = new_sales_agent_id
                        WHERE "PartnerTypeId" = old_sales_agent_id;

                        DELETE FROM "partners"."PartnerTypes"
                        WHERE "Id" = old_sales_agent_id;
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                INSERT INTO "partners"."PartnerTypes" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('41000000-0000-0000-0000-000000000002', 'RESELLER', 'Reseller', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000008', 'DISTRIBUTOR', 'Distributor', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000004', 'VENDOR', 'Vendor', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000007', 'SUPPLIER', 'Supplier', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000005', 'SALES_AGENT', 'Sales Agent', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000003', 'AFFILIATE', 'Affiliate', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000001', 'CONSULTANT', 'Consultant', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000009', 'TECHNOLOGY_PARTNER', 'Technology Partner', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000010', 'IMPLEMENTATION_PARTNER', 'Implementation Partner', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000011', 'SERVICE_PARTNER', 'Service Partner', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000012', 'STRATEGIC_PARTNER', 'Strategic Partner', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000006', 'OTHER', 'Other', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true)
                ON CONFLICT ("Code") DO UPDATE
                SET "Name" = EXCLUDED."Name",
                    "IsActive" = true;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM "partners"."PartnerTypes" pt
                WHERE pt."Code" IN (
                    'DISTRIBUTOR',
                    'TECHNOLOGY_PARTNER',
                    'IMPLEMENTATION_PARTNER',
                    'SERVICE_PARTNER',
                    'STRATEGIC_PARTNER'
                )
                  AND NOT EXISTS (
                      SELECT 1
                      FROM "partners"."Partners" p
                      WHERE p."PartnerTypeId" = pt."Id"
                  );
                """);

            migrationBuilder.Sql("""
                UPDATE "partners"."PartnerTypes"
                SET "Code" = 'SALES-AGENT',
                    "Name" = 'Sales Agent'
                WHERE "Code" = 'SALES_AGENT'
                  AND NOT EXISTS (
                      SELECT 1
                      FROM "partners"."PartnerTypes"
                      WHERE "Code" = 'SALES-AGENT'
                  );
                """);
        }
    }
}
