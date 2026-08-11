using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lookups.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDialingCodeToLookupDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DialingCode",
                schema: "lookups",
                table: "LookupDetails",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "lookups"."LookupDetails" SET "DialingCode" = '+977' WHERE "Id" = '50000000-0000-0000-0000-000000000001';
                UPDATE "lookups"."LookupDetails" SET "DialingCode" = '+1' WHERE "Id" = '50000000-0000-0000-0000-000000000002';
                UPDATE "lookups"."LookupDetails" SET "DialingCode" = '+91' WHERE "Id" = '50000000-0000-0000-0000-000000000003';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DialingCode",
                schema: "lookups",
                table: "LookupDetails");
        }
    }
}
