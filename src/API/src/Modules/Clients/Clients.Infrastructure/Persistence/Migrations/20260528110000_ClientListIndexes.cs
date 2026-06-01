using Clients.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clients.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ClientsDbContext))]
    [Migration("20260528110000_ClientListIndexes")]
    public partial class ClientListIndexes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE INDEX IF NOT EXISTS "IX_Clients_IsDeleted_CreatedOn"
                    ON "clients"."Clients" ("IsDeleted", "CreatedOn");

                CREATE INDEX IF NOT EXISTS "IX_Clients_CountryId"
                    ON "clients"."Clients" ("CountryId");

                CREATE INDEX IF NOT EXISTS "IX_Clients_IndustryId"
                    ON "clients"."Clients" ("IndustryId");

                CREATE INDEX IF NOT EXISTS "IX_Clients_Status"
                    ON "clients"."Clients" ("Status");
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "clients"."IX_Clients_Status";
                DROP INDEX IF EXISTS "clients"."IX_Clients_IndustryId";
                DROP INDEX IF EXISTS "clients"."IX_Clients_CountryId";
                DROP INDEX IF EXISTS "clients"."IX_Clients_IsDeleted_CreatedOn";
                """);
        }
    }
}
