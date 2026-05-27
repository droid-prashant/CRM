using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Partners.Infrastructure.Persistence.Data;

#nullable disable

namespace Partners.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(PartnersDbContext))]
    [Migration("20260527113000_RemoveDistributorPartnerType")]
    public partial class RemoveDistributorPartnerType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$
                DECLARE
                    distributor_id uuid;
                BEGIN
                    SELECT "Id" INTO distributor_id
                    FROM "partners"."PartnerTypes"
                    WHERE "Code" = 'DISTRIBUTOR'
                    LIMIT 1;

                    IF distributor_id IS NULL THEN
                        RETURN;
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM "partners"."Partners"
                        WHERE "PartnerTypeId" = distributor_id
                    ) THEN
                        UPDATE "partners"."PartnerTypes"
                        SET "IsActive" = false
                        WHERE "Id" = distributor_id;
                    ELSE
                        DELETE FROM "partners"."PartnerTypes"
                        WHERE "Id" = distributor_id;
                    END IF;
                END $$;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO "partners"."PartnerTypes" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES ('41000000-0000-0000-0000-000000000008', 'DISTRIBUTOR', 'Distributor', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true)
                ON CONFLICT ("Code") DO UPDATE
                SET "Name" = EXCLUDED."Name",
                    "IsActive" = true;
                """);
        }
    }
}
