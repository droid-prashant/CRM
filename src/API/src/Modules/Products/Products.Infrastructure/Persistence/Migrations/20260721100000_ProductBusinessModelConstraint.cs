using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Products.Infrastructure.Persistence.Data;

#nullable disable

namespace Products.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ProductsDbContext))]
    [Migration("20260721100000_ProductBusinessModelConstraint")]
    public partial class ProductBusinessModelConstraint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_constraint
                        WHERE conname = 'CK_Products_ExactlyOneBusinessModel'
                    ) THEN
                        ALTER TABLE "products"."Products"
                            ADD CONSTRAINT "CK_Products_ExactlyOneBusinessModel"
                            CHECK ("IsSubscriptionBased" <> "IsLicenseBased") NOT VALID;
                    END IF;
                END $$;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "products"."Products"
                    DROP CONSTRAINT IF EXISTS "CK_Products_ExactlyOneBusinessModel";
                """);
        }
    }
}
