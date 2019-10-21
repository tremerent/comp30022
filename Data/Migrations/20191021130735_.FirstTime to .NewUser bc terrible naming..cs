using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Migrations
{
    public partial class FirstTimetoNewUserbcterriblenaming : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstTime",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "NewUser",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewUser",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "FirstTime",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
