using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Leads.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RepointCountryIndustry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Countries_CountryId",
                schema: "leads",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Industries_IndustryId",
                schema: "leads",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_Countries_CountryId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_Industries_IndustryId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropTable(
                name: "Countries",
                schema: "leads");

            migrationBuilder.DropTable(
                name: "Industries",
                schema: "leads");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_LookupDetails_CountryId",
                schema: "leads",
                table: "Clients",
                column: "CountryId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_LookupDetails_IndustryId",
                schema: "leads",
                table: "Clients",
                column: "IndustryId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LookupDetails_CountryId",
                schema: "leads",
                table: "Leads",
                column: "CountryId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LookupDetails_IndustryId",
                schema: "leads",
                table: "Leads",
                column: "IndustryId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_LookupDetails_CountryId",
                schema: "leads",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_LookupDetails_IndustryId",
                schema: "leads",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LookupDetails_CountryId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LookupDetails_IndustryId",
                schema: "leads",
                table: "Leads");

            migrationBuilder.CreateTable(
                name: "Countries",
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
                    table.PrimaryKey("PK_Countries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Industries",
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
                    table.PrimaryKey("PK_Industries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Countries_Code",
                schema: "leads",
                table: "Countries",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Industries_Code",
                schema: "leads",
                table: "Industries",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Countries_CountryId",
                schema: "leads",
                table: "Clients",
                column: "CountryId",
                principalSchema: "leads",
                principalTable: "Countries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Industries_IndustryId",
                schema: "leads",
                table: "Clients",
                column: "IndustryId",
                principalSchema: "leads",
                principalTable: "Industries",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_Countries_CountryId",
                schema: "leads",
                table: "Leads",
                column: "CountryId",
                principalSchema: "leads",
                principalTable: "Countries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_Industries_IndustryId",
                schema: "leads",
                table: "Leads",
                column: "IndustryId",
                principalSchema: "leads",
                principalTable: "Industries",
                principalColumn: "Id");
        }
    }
}
