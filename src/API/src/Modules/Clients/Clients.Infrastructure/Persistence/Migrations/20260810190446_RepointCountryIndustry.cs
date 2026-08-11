using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clients.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RepointCountryIndustry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // leads.Countries / leads.Industries were already dropped by the Leads module's own
            // RepointCountryIndustry migration (both physically owned there). Client.CountryId /
            // IndustryId now reference the shared lookups.LookupDetails table instead.
            // IX_Clients_CountryId / IX_Clients_IndustryId already exist (created by ClientListIndexes).
            migrationBuilder.AddForeignKey(
                name: "FK_Clients_LookupDetails_CountryId",
                schema: "clients",
                table: "Clients",
                column: "CountryId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_LookupDetails_IndustryId",
                schema: "clients",
                table: "Clients",
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
                schema: "clients",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_LookupDetails_IndustryId",
                schema: "clients",
                table: "Clients");
        }
    }
}
