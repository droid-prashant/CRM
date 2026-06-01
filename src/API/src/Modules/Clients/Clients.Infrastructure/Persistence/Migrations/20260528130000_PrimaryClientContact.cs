using Clients.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clients.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ClientsDbContext))]
    [Migration("20260528130000_PrimaryClientContact")]
    public partial class PrimaryClientContact : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                WITH ranked_primary_contacts AS (
                    SELECT
                        "Id",
                        ROW_NUMBER() OVER (
                            PARTITION BY "ClientId"
                            ORDER BY "IsActive" DESC, "CreatedOn" ASC, "Id" ASC
                        ) AS "Rank"
                    FROM "clients"."ClientContacts"
                    WHERE "IsPrimary" = true AND "IsDeleted" = false
                )
                UPDATE "clients"."ClientContacts" contact
                SET "IsPrimary" = false
                FROM ranked_primary_contacts ranked
                WHERE contact."Id" = ranked."Id" AND ranked."Rank" > 1;

                UPDATE "clients"."ClientContacts"
                SET "IsPrimary" = false
                WHERE "IsPrimary" = true AND "IsActive" = false;

                CREATE UNIQUE INDEX IF NOT EXISTS "IX_ClientContacts_ClientId_IsPrimary"
                    ON "clients"."ClientContacts" ("ClientId", "IsPrimary")
                    WHERE "IsPrimary" = true AND "IsDeleted" = false;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "clients"."IX_ClientContacts_ClientId_IsPrimary";
                """);
        }
    }
}
