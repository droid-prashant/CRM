using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Partners.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RepointCountry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // leads.Countries was already dropped by the Leads module's own RepointCountryIndustry
            // migration. Partner.CountryId now references the shared lookups.LookupDetails table.
            migrationBuilder.CreateIndex(
                name: "IX_Partners_CountryId",
                schema: "partners",
                table: "Partners",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Partners_LookupDetails_CountryId",
                schema: "partners",
                table: "Partners",
                column: "CountryId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Partners_LookupDetails_CountryId",
                schema: "partners",
                table: "Partners");

            migrationBuilder.DropIndex(
                name: "IX_Partners_CountryId",
                schema: "partners",
                table: "Partners");
        }
    }
}
