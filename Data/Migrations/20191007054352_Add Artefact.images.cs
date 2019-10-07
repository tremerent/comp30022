using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class AddArtefactimages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ArtefactDocuments",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Url = table.Column<string>(nullable: true),
                    ArtefactId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtefactDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArtefactDocuments_Artefacts_ArtefactId",
                        column: x => x.ArtefactId,
                        principalTable: "Artefacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArtefactDocuments_ArtefactId",
                table: "ArtefactDocuments",
                column: "ArtefactId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArtefactDocuments");
        }
    }
}
