using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Migrations
{
    public partial class Cascadeonartefactdeletion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArtefactComments_Artefacts_ArtefactId",
                table: "ArtefactComments");

            migrationBuilder.DropForeignKey(
                name: "FK_ArtefactDocuments_Artefacts_ArtefactId",
                table: "ArtefactDocuments");

            migrationBuilder.AddForeignKey(
                name: "FK_ArtefactComments_Artefacts_ArtefactId",
                table: "ArtefactComments",
                column: "ArtefactId",
                principalTable: "Artefacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ArtefactDocuments_Artefacts_ArtefactId",
                table: "ArtefactDocuments",
                column: "ArtefactId",
                principalTable: "Artefacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArtefactComments_Artefacts_ArtefactId",
                table: "ArtefactComments");

            migrationBuilder.DropForeignKey(
                name: "FK_ArtefactDocuments_Artefacts_ArtefactId",
                table: "ArtefactDocuments");

            migrationBuilder.AddForeignKey(
                name: "FK_ArtefactComments_Artefacts_ArtefactId",
                table: "ArtefactComments",
                column: "ArtefactId",
                principalTable: "Artefacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ArtefactDocuments_Artefacts_ArtefactId",
                table: "ArtefactDocuments",
                column: "ArtefactId",
                principalTable: "Artefacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
