using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Opportunities.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrencyForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_OpportunityCommercialBreakdowns_CurrencyId",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns",
                column: "CurrencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Opportunities_CurrencyId",
                schema: "leads",
                table: "Opportunities",
                column: "CurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Opportunities_LookupDetails_CurrencyId",
                schema: "leads",
                table: "Opportunities",
                column: "CurrencyId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OpportunityCommercialBreakdowns_LookupDetails_CurrencyId",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns",
                column: "CurrencyId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Opportunities_LookupDetails_CurrencyId",
                schema: "leads",
                table: "Opportunities");

            migrationBuilder.DropForeignKey(
                name: "FK_OpportunityCommercialBreakdowns_LookupDetails_CurrencyId",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns");

            migrationBuilder.DropIndex(
                name: "IX_OpportunityCommercialBreakdowns_CurrencyId",
                schema: "leads",
                table: "OpportunityCommercialBreakdowns");

            migrationBuilder.DropIndex(
                name: "IX_Opportunities_CurrencyId",
                schema: "leads",
                table: "Opportunities");
        }
    }
}
