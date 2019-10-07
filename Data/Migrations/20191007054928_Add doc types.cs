using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class Adddoctypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DocType",
                table: "ArtefactDocuments",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocType",
                table: "ArtefactDocuments");
        }
    }
}
