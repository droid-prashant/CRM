using Clients.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clients.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ClientsDbContext))]
    [Migration("20260816140000_DropClientContactFullName")]
    public partial class DropClientContactFullName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "clients"."ClientContacts" DROP COLUMN IF EXISTS "FullName";
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "clients"."ClientContacts" ADD COLUMN IF NOT EXISTS "FullName" character varying(250) NOT NULL DEFAULT '';
                """);
        }
    }
}
