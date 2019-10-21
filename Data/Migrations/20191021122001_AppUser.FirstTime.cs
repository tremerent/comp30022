using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Migrations
{
    public partial class AppUserFirstTime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FirstTime",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_PersistedGrants_Expiration",
                table: "PersistedGrants",
                column: "Expiration");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceCodes_Expiration",
                table: "DeviceCodes",
                column: "Expiration");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PersistedGrants_Expiration",
                table: "PersistedGrants");

            migrationBuilder.DropIndex(
                name: "IX_DeviceCodes_Expiration",
                table: "DeviceCodes");

            migrationBuilder.DropColumn(
                name: "FirstTime",
                table: "AspNetUsers");
        }
    }
}
