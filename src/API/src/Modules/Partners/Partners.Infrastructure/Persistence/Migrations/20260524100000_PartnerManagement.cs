using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Partners.Infrastructure.Persistence.Data;

#nullable disable

namespace Partners.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(PartnersDbContext))]
    [Migration("20260524100000_PartnerManagement")]
    public partial class PartnerManagement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(name: "partners");

            migrationBuilder.CreateTable(
                name: "PartnerTypes",
                schema: "partners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table => table.PrimaryKey("PK_PartnerTypes", x => x.Id));

            migrationBuilder.CreateTable(
                name: "Partners",
                schema: "partners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    PartnerTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    CountryId = table.Column<Guid>(type: "uuid", nullable: false),
                    ContactPerson = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    PhoneNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Email = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Remarks = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partners", x => x.Id);
                    table.ForeignKey("FK_Partners_PartnerTypes_PartnerTypeId", x => x.PartnerTypeId, "PartnerTypes", "Id", principalSchema: "partners", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex("IX_PartnerTypes_Code", "PartnerTypes", "Code", schema: "partners", unique: true);
            migrationBuilder.CreateIndex("IX_Partners_Code", "Partners", "Code", schema: "partners", unique: true);
            migrationBuilder.CreateIndex("IX_Partners_Name_PartnerTypeId_CountryId", "Partners", new[] { "Name", "PartnerTypeId", "CountryId" }, schema: "partners");
            migrationBuilder.CreateIndex("IX_Partners_PartnerTypeId", "Partners", "PartnerTypeId", schema: "partners");

            migrationBuilder.Sql("""
                INSERT INTO "partners"."PartnerTypes" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES
                    ('41000000-0000-0000-0000-000000000001', 'CONSULTANT', 'Consultant', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000002', 'RESELLER', 'Reseller', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000003', 'AFFILIATE', 'Affiliate', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000004', 'VENDOR', 'Vendor', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000005', 'SALES-AGENT', 'Sales Agent', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true),
                    ('41000000-0000-0000-0000-000000000006', 'OTHER', 'Other', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true)
                ON CONFLICT ("Code") DO NOTHING;
                """);

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF to_regclass('"leads"."Partners"') IS NOT NULL THEN
                        INSERT INTO "partners"."Partners"
                            ("Id", "Code", "Name", "PartnerTypeId", "CountryId", "CreatedBy", "CreatedOn", "UpdatedBy", "UpdatedOn", "IsActive")
                        SELECT
                            "Id",
                            "Code",
                            "Name",
                            '41000000-0000-0000-0000-000000000006',
                            '50000000-0000-0000-0000-000000000001',
                            "CreatedBy",
                            "CreatedOn",
                            "UpdatedBy",
                            "UpdatedOn",
                            "IsActive"
                        FROM "leads"."Partners"
                        ON CONFLICT ("Id") DO NOTHING;
                    END IF;
                END $$;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("Partners", schema: "partners");
            migrationBuilder.DropTable("PartnerTypes", schema: "partners");
        }
    }
}
