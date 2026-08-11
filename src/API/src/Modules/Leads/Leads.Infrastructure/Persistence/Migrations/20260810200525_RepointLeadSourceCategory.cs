using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RepointLeadSourceCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadCategories_CategoryId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadSources_SourceId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropTable(
                name: "LeadCategories",
                schema: "leads");

            migrationBuilder.DropTable(
                name: "LeadSources",
                schema: "leads");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LookupDetails_CategoryId",
                schema: "leads",
                table: "Leads",
                column: "CategoryId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LookupDetails_SourceId",
                schema: "leads",
                table: "Leads",
                column: "SourceId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LookupDetails_CategoryId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LookupDetails_SourceId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.CreateTable(
                name: "LeadCategories",
                schema: "leads",
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
                    table.PrimaryKey("PK_LeadCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LeadSources",
                schema: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    RequiresPartner = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadSources", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LeadCategories_Code",
                schema: "leads",
                table: "LeadCategories",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeadSources_Code",
                schema: "leads",
                table: "LeadSources",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadCategories_CategoryId",
                schema: "leads",
                table: "Leads",
                column: "CategoryId",
                principalSchema: "leads",
                principalTable: "LeadCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadSources_SourceId",
                schema: "leads",
                table: "Leads",
                column: "SourceId",
                principalSchema: "leads",
                principalTable: "LeadSources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
