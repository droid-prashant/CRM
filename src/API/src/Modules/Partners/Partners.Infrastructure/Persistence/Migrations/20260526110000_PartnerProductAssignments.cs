using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Partners.Infrastructure.Persistence.Data;

#nullable disable

namespace Partners.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(PartnersDbContext))]
    [Migration("20260526110000_PartnerProductAssignments")]
    public partial class PartnerProductAssignments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PartnerProducts",
                schema: "partners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PartnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnerProducts", x => x.Id);
                    table.ForeignKey("FK_PartnerProducts_Partners_PartnerId", x => x.PartnerId, "Partners", "Id", principalSchema: "partners", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex("IX_PartnerProducts_PartnerId_ProductId", "PartnerProducts", new[] { "PartnerId", "ProductId" }, schema: "partners", unique: true);

            migrationBuilder.Sql("""
                INSERT INTO "partners"."PartnerTypes" ("Id", "Code", "Name", "CreatedBy", "CreatedOn", "IsActive")
                VALUES ('41000000-0000-0000-0000-000000000007', 'SUPPLIER', 'Supplier', '00000000-0000-0000-0000-000000000000', TIMESTAMPTZ '2026-01-01 00:00:00+00', true)
                ON CONFLICT ("Code") DO NOTHING;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("PartnerProducts", schema: "partners");

            migrationBuilder.Sql("""
                DELETE FROM "partners"."PartnerTypes" pt
                WHERE pt."Code" = 'SUPPLIER'
                  AND NOT EXISTS (
                      SELECT 1
                      FROM "partners"."Partners" p
                      WHERE p."PartnerTypeId" = pt."Id"
                  );
                """);
        }
    }
}
