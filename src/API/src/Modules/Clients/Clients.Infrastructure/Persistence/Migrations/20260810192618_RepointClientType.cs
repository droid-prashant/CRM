using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clients.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RepointClientType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_ClientTypes_ClientTypeId",
                schema: "clients",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "ClientTypes",
                schema: "clients");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_LookupDetails_ClientTypeId",
                schema: "clients",
                table: "Clients",
                column: "ClientTypeId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_LookupDetails_ClientTypeId",
                schema: "clients",
                table: "Clients");

            migrationBuilder.CreateTable(
                name: "ClientTypes",
                schema: "clients",
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
                    table.PrimaryKey("PK_ClientTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientTypes_Code",
                schema: "clients",
                table: "ClientTypes",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_ClientTypes_ClientTypeId",
                schema: "clients",
                table: "Clients",
                column: "ClientTypeId",
                principalSchema: "clients",
                principalTable: "ClientTypes",
                principalColumn: "Id");
        }
    }
}
