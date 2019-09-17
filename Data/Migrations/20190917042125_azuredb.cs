using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class azuredb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Artefacts",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artefacts_OwnerId",
                table: "Artefacts",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artefacts_AspNetUsers_OwnerId",
                table: "Artefacts",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artefacts_AspNetUsers_OwnerId",
                table: "Artefacts");

            migrationBuilder.DropIndex(
                name: "IX_Artefacts_OwnerId",
                table: "Artefacts");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Artefacts");
        }
    }
}
