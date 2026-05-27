using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Products.Infrastructure.Persistence.Data;

#nullable disable

namespace Products.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ProductsDbContext))]
    [Migration("20260524114000_ProductMaster")]
    public partial class ProductMaster : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(name: "products");

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF to_regclass('"products"."Products"') IS NULL THEN
                        IF to_regclass('"leads"."Products"') IS NOT NULL THEN
                            ALTER TABLE "leads"."Products" SET SCHEMA "products";
                        ELSE
                            CREATE TABLE "products"."Products" (
                                "Id" uuid NOT NULL,
                                "Code" character varying(50) NOT NULL,
                                "Name" character varying(200) NOT NULL,
                                "Description" text NULL,
                                "ProductType" integer NOT NULL DEFAULT 1,
                                "DeploymentType" integer NOT NULL DEFAULT 4,
                                "IsSubscriptionBased" boolean NOT NULL DEFAULT false,
                                "IsLicenseBased" boolean NOT NULL DEFAULT false,
                                "IsDeleted" boolean NOT NULL DEFAULT false,
                                "CreatedBy" uuid NOT NULL,
                                "CreatedOn" timestamp with time zone NOT NULL,
                                "UpdatedBy" uuid NULL,
                                "UpdatedOn" timestamp with time zone NULL,
                                "IsActive" boolean NOT NULL DEFAULT true,
                                CONSTRAINT "PK_Products" PRIMARY KEY ("Id")
                            );
                        END IF;
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "products"."Products"
                    ADD COLUMN IF NOT EXISTS "ProductType" integer NOT NULL DEFAULT 1,
                    ADD COLUMN IF NOT EXISTS "DeploymentType" integer NOT NULL DEFAULT 4,
                    ADD COLUMN IF NOT EXISTS "Description" text NULL,
                    ADD COLUMN IF NOT EXISTS "IsSubscriptionBased" boolean NOT NULL DEFAULT false,
                    ADD COLUMN IF NOT EXISTS "IsLicenseBased" boolean NOT NULL DEFAULT false,
                    ADD COLUMN IF NOT EXISTS "IsDeleted" boolean NOT NULL DEFAULT false,
                    ADD COLUMN IF NOT EXISTS "CategoryName" text NULL;

                ALTER TABLE "products"."Products"
                    ALTER COLUMN "Name" TYPE character varying(200),
                    ALTER COLUMN "Description" TYPE text,
                    ALTER COLUMN "ProductType" TYPE integer USING CASE
                        WHEN "ProductType"::text ~ '^[0-9]+$' THEN "ProductType"::text::integer
                        WHEN upper("ProductType"::text) = 'SOFTWARE' THEN 1
                        WHEN upper("ProductType"::text) = 'SERVICE' THEN 2
                        WHEN upper("ProductType"::text) = 'ADDON' THEN 3
                        WHEN upper("ProductType"::text) = 'HARDWARE' THEN 4
                        WHEN "CategoryName" IS NOT NULL AND upper("CategoryName") = 'SERVICE' THEN 2
                        WHEN "CategoryName" IS NOT NULL AND upper("CategoryName") = 'ADDON' THEN 3
                        WHEN "CategoryName" IS NOT NULL AND upper("CategoryName") = 'HARDWARE' THEN 4
                        ELSE 1
                    END,
                    ALTER COLUMN "DeploymentType" TYPE integer USING CASE
                        WHEN "DeploymentType"::text ~ '^[0-9]+$' THEN "DeploymentType"::text::integer
                        WHEN upper("DeploymentType"::text) = 'CLOUD' THEN 1
                        WHEN upper("DeploymentType"::text) IN ('ONPREMISE', 'ON_PREMISE', 'ON PREMISE') THEN 2
                        WHEN upper("DeploymentType"::text) = 'HYBRID' THEN 3
                        ELSE 4
                    END;

                UPDATE "products"."Products"
                SET "ProductType" = 1
                WHERE "ProductType" NOT IN (1, 2, 3, 4);

                UPDATE "products"."Products"
                SET "DeploymentType" = 4
                WHERE "DeploymentType" NOT IN (1, 2, 3, 4);

                ALTER TABLE "products"."Products"
                    DROP COLUMN IF EXISTS "CategoryName";

                CREATE UNIQUE INDEX IF NOT EXISTS "IX_Products_Code"
                    ON "products"."Products" ("Code");

                CREATE INDEX IF NOT EXISTS "IX_Products_Name_ProductType_DeploymentType"
                    ON "products"."Products" ("Name", "ProductType", "DeploymentType");
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "products"."IX_Products_Name_ProductType_DeploymentType";

                ALTER TABLE "products"."Products"
                    ADD COLUMN IF NOT EXISTS "CategoryName" text NULL,
                    DROP COLUMN IF EXISTS "IsDeleted",
                    DROP COLUMN IF EXISTS "IsLicenseBased",
                    DROP COLUMN IF EXISTS "IsSubscriptionBased",
                    DROP COLUMN IF EXISTS "Description",
                    DROP COLUMN IF EXISTS "DeploymentType",
                    DROP COLUMN IF EXISTS "ProductType";

                DO $$
                BEGIN
                    IF to_regclass('"products"."Products"') IS NOT NULL
                       AND to_regclass('"leads"."Products"') IS NULL THEN
                        ALTER TABLE "products"."Products" SET SCHEMA "leads";
                    END IF;
                END $$;
                """);
        }
    }
}
