using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ERP.Identity.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleAuditAndCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "AspNetRoles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "AspNetRoles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "AspNetRoles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "AspNetRoles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "AspNetRoles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoles_Code",
                table: "AspNetRoles",
                column: "Code",
                unique: true,
                filter: "\"Code\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetRoles_Code",
                table: "AspNetRoles");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "AspNetRoles");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "AspNetRoles");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "AspNetRoles");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "AspNetRoles");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "AspNetRoles");
        }
    }
}
