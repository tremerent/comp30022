using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class Addprivacyanddescriptiontoartefact : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Artefacts",
                nullable: false,
                defaultValue: "NEWID()",
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Artefacts",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Visibility",
                table: "Artefacts",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Artefacts");

            migrationBuilder.DropColumn(
                name: "Visibility",
                table: "Artefacts");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Artefacts",
                nullable: false,
                oldClrType: typeof(string),
                oldDefaultValue: "NEWID()");
        }
    }
}
