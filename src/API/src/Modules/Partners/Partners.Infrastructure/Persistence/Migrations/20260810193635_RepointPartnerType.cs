using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Partners.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RepointPartnerType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Partners_PartnerTypes_PartnerTypeId",
                schema: "partners",
                table: "Partners");

            migrationBuilder.DropTable(
                name: "PartnerTypes",
                schema: "partners");

            migrationBuilder.AddForeignKey(
                name: "FK_Partners_LookupDetails_PartnerTypeId",
                schema: "partners",
                table: "Partners",
                column: "PartnerTypeId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Partners_LookupDetails_PartnerTypeId",
                schema: "partners",
                table: "Partners");

            migrationBuilder.CreateTable(
                name: "PartnerTypes",
                schema: "partners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnerTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PartnerTypes_Code",
                schema: "partners",
                table: "PartnerTypes",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Partners_PartnerTypes_PartnerTypeId",
                schema: "partners",
                table: "Partners",
                column: "PartnerTypeId",
                principalSchema: "partners",
                principalTable: "PartnerTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
