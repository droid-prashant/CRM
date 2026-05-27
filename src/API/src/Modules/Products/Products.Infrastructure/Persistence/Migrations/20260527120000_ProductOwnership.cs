using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Products.Infrastructure.Persistence.Data;

#nullable disable

namespace Products.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ProductsDbContext))]
    [Migration("20260527120000_ProductOwnership")]
    public partial class ProductOwnership : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "products"."Products"
                    ADD COLUMN IF NOT EXISTS "OwnershipType" integer NOT NULL DEFAULT 1,
                    ADD COLUMN IF NOT EXISTS "OwnerPartnerId" uuid NULL;

                UPDATE "products"."Products"
                SET "OwnershipType" = 1,
                    "OwnerPartnerId" = NULL
                WHERE "OwnershipType" NOT IN (1, 2);

                UPDATE "products"."Products"
                SET "OwnerPartnerId" = NULL
                WHERE "OwnershipType" = 1;

                CREATE INDEX IF NOT EXISTS "IX_Products_OwnerPartnerId"
                    ON "products"."Products" ("OwnerPartnerId");
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "products"."IX_Products_OwnerPartnerId";

                ALTER TABLE "products"."Products"
                    DROP COLUMN IF EXISTS "OwnerPartnerId",
                    DROP COLUMN IF EXISTS "OwnershipType";
                """);
        }
    }
}
