using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class Artefactdocumentautocreateimages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "ArtefactDocuments",
                nullable: false,
                defaultValue: "NEWID()",
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "ArtefactDocuments",
                nullable: false,
                oldClrType: typeof(string),
                oldDefaultValue: "NEWID()");
        }
    }
}
