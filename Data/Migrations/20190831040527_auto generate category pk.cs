using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class autogeneratecategorypk : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Category",
                nullable: false,
                defaultValue: "NEWID()",
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Category",
                nullable: false,
                oldClrType: typeof(string),
                oldDefaultValue: "NEWID()");
        }
    }
}
