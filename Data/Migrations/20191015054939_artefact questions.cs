using Microsoft.EntityFrameworkCore.Migrations;

namespace Artefactor.Data.Migrations
{
    public partial class artefactquestions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "ArtefactComments",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AnswerCommentId",
                table: "ArtefactComments",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAnswered",
                table: "ArtefactComments",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ArtefactComments_AnswerCommentId",
                table: "ArtefactComments",
                column: "AnswerCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ArtefactComments_ArtefactComments_AnswerCommentId",
                table: "ArtefactComments",
                column: "AnswerCommentId",
                principalTable: "ArtefactComments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArtefactComments_ArtefactComments_AnswerCommentId",
                table: "ArtefactComments");

            migrationBuilder.DropIndex(
                name: "IX_ArtefactComments_AnswerCommentId",
                table: "ArtefactComments");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "ArtefactComments");

            migrationBuilder.DropColumn(
                name: "AnswerCommentId",
                table: "ArtefactComments");

            migrationBuilder.DropColumn(
                name: "IsAnswered",
                table: "ArtefactComments");
        }
    }
}
