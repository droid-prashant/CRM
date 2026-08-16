using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultCurrencyIdToLookupDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DefaultCurrencyId",
                schema: "lookups",
                table: "LookupDetails",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LookupDetails_DefaultCurrencyId",
                schema: "lookups",
                table: "LookupDetails",
                column: "DefaultCurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_LookupDetails_LookupDetails_DefaultCurrencyId",
                schema: "lookups",
                table: "LookupDetails",
                column: "DefaultCurrencyId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LookupDetails_LookupDetails_DefaultCurrencyId",
                schema: "lookups",
                table: "LookupDetails");

            migrationBuilder.DropIndex(
                name: "IX_LookupDetails_DefaultCurrencyId",
                schema: "lookups",
                table: "LookupDetails");

            migrationBuilder.DropColumn(
                name: "DefaultCurrencyId",
                schema: "lookups",
                table: "LookupDetails");
        }
    }
}
