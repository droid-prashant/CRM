using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Products.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConvertProductTypesToLookups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProductTypeId",
                schema: "products",
                table: "Products",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeploymentTypeId",
                schema: "products",
                table: "Products",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OwnershipTypeId",
                schema: "products",
                table: "Products",
                type: "uuid",
                nullable: true);

            // Backfill from the old int-backed enum columns using the fixed lookup GUIDs seeded by
            // the Lookups module's SeedProductLookups migration (LookupId 8/9/10).
            migrationBuilder.Sql("""
                UPDATE "products"."Products"
                SET "ProductTypeId" = CASE "ProductType"
                        WHEN 1 THEN '91000000-0000-0000-0000-000000000001'::uuid
                        WHEN 2 THEN '91000000-0000-0000-0000-000000000002'::uuid
                        WHEN 3 THEN '91000000-0000-0000-0000-000000000003'::uuid
                        WHEN 4 THEN '91000000-0000-0000-0000-000000000004'::uuid
                        ELSE '91000000-0000-0000-0000-000000000001'::uuid
                    END,
                    "DeploymentTypeId" = CASE "DeploymentType"
                        WHEN 1 THEN '92000000-0000-0000-0000-000000000001'::uuid
                        WHEN 2 THEN '92000000-0000-0000-0000-000000000002'::uuid
                        WHEN 3 THEN '92000000-0000-0000-0000-000000000003'::uuid
                        WHEN 4 THEN '92000000-0000-0000-0000-000000000004'::uuid
                        ELSE '92000000-0000-0000-0000-000000000004'::uuid
                    END,
                    "OwnershipTypeId" = CASE "OwnershipType"
                        WHEN 1 THEN '93000000-0000-0000-0000-000000000001'::uuid
                        WHEN 2 THEN '93000000-0000-0000-0000-000000000002'::uuid
                        ELSE '93000000-0000-0000-0000-000000000001'::uuid
                    END;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductTypeId",
                schema: "products",
                table: "Products",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DeploymentTypeId",
                schema: "products",
                table: "Products",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "OwnershipTypeId",
                schema: "products",
                table: "Products",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropIndex(
                name: "IX_Products_Name_ProductType_DeploymentType",
                schema: "products",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductType",
                schema: "products",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DeploymentType",
                schema: "products",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OwnershipType",
                schema: "products",
                table: "Products");

            migrationBuilder.CreateIndex(
                name: "IX_Products_DeploymentTypeId",
                schema: "products",
                table: "Products",
                column: "DeploymentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name_ProductTypeId_DeploymentTypeId",
                schema: "products",
                table: "Products",
                columns: new[] { "Name", "ProductTypeId", "DeploymentTypeId" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_OwnershipTypeId",
                schema: "products",
                table: "Products",
                column: "OwnershipTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductTypeId",
                schema: "products",
                table: "Products",
                column: "ProductTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_LookupDetails_DeploymentTypeId",
                schema: "products",
                table: "Products",
                column: "DeploymentTypeId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_LookupDetails_OwnershipTypeId",
                schema: "products",
                table: "Products",
                column: "OwnershipTypeId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_LookupDetails_ProductTypeId",
                schema: "products",
                table: "Products",
                column: "ProductTypeId",
                principalSchema: "lookups",
                principalTable: "LookupDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_LookupDetails_DeploymentTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_LookupDetails_OwnershipTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_LookupDetails_ProductTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_DeploymentTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_Name_ProductTypeId_DeploymentTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_OwnershipTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ProductTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "ProductType",
                schema: "products",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DeploymentType",
                schema: "products",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 4);

            migrationBuilder.AddColumn<int>(
                name: "OwnershipType",
                schema: "products",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.Sql("""
                UPDATE "products"."Products"
                SET "ProductType" = CASE "ProductTypeId"::text
                        WHEN '91000000-0000-0000-0000-000000000001' THEN 1
                        WHEN '91000000-0000-0000-0000-000000000002' THEN 2
                        WHEN '91000000-0000-0000-0000-000000000003' THEN 3
                        WHEN '91000000-0000-0000-0000-000000000004' THEN 4
                        ELSE 1
                    END,
                    "DeploymentType" = CASE "DeploymentTypeId"::text
                        WHEN '92000000-0000-0000-0000-000000000001' THEN 1
                        WHEN '92000000-0000-0000-0000-000000000002' THEN 2
                        WHEN '92000000-0000-0000-0000-000000000003' THEN 3
                        WHEN '92000000-0000-0000-0000-000000000004' THEN 4
                        ELSE 4
                    END,
                    "OwnershipType" = CASE "OwnershipTypeId"::text
                        WHEN '93000000-0000-0000-0000-000000000001' THEN 1
                        WHEN '93000000-0000-0000-0000-000000000002' THEN 2
                        ELSE 1
                    END;
                """);

            migrationBuilder.DropColumn(
                name: "ProductTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DeploymentTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OwnershipTypeId",
                schema: "products",
                table: "Products");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name_ProductType_DeploymentType",
                schema: "products",
                table: "Products",
                columns: new[] { "Name", "ProductType", "DeploymentType" });
        }
    }
}
