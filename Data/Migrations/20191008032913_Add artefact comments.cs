using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class Addartefactcomments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ArtefactComments",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false, defaultValue: "NEWID()"),
                    Body = table.Column<string>(nullable: true),
                    AuthorId = table.Column<string>(nullable: true),
                    ArtefactId = table.Column<string>(nullable: true),
                    ParentCommentId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtefactComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArtefactComments_Artefacts_ArtefactId",
                        column: x => x.ArtefactId,
                        principalTable: "Artefacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ArtefactComments_AspNetUsers_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ArtefactComments_ArtefactComments_ParentCommentId",
                        column: x => x.ParentCommentId,
                        principalTable: "ArtefactComments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArtefactComments_ArtefactId",
                table: "ArtefactComments",
                column: "ArtefactId");

            migrationBuilder.CreateIndex(
                name: "IX_ArtefactComments_AuthorId",
                table: "ArtefactComments",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_ArtefactComments_ParentCommentId",
                table: "ArtefactComments",
                column: "ParentCommentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArtefactComments");
        }
    }
}
