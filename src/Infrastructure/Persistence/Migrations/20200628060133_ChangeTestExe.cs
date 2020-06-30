using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class ChangeTestExe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestExecutions_StageTests_StageTestStageId_StageTestTestId",
                table: "TestExecutions");

            migrationBuilder.DropIndex(
                name: "IX_TestExecutions_StageTestStageId_StageTestTestId",
                table: "TestExecutions");

            migrationBuilder.DropColumn(
                name: "StageTestStageId",
                table: "TestExecutions");

            migrationBuilder.DropColumn(
                name: "StageTestTestId",
                table: "TestExecutions");

            migrationBuilder.CreateIndex(
                name: "IX_TestExecutions_StageId_TestId",
                table: "TestExecutions",
                columns: new[] { "StageId", "TestId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TestExecutions_StageTests_StageId_TestId",
                table: "TestExecutions",
                columns: new[] { "StageId", "TestId" },
                principalTable: "StageTests",
                principalColumns: new[] { "StageId", "TestId" },
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestExecutions_StageTests_StageId_TestId",
                table: "TestExecutions");

            migrationBuilder.DropIndex(
                name: "IX_TestExecutions_StageId_TestId",
                table: "TestExecutions");

            migrationBuilder.AddColumn<int>(
                name: "StageTestStageId",
                table: "TestExecutions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StageTestTestId",
                table: "TestExecutions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestExecutions_StageTestStageId_StageTestTestId",
                table: "TestExecutions",
                columns: new[] { "StageTestStageId", "StageTestTestId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TestExecutions_StageTests_StageTestStageId_StageTestTestId",
                table: "TestExecutions",
                columns: new[] { "StageTestStageId", "StageTestTestId" },
                principalTable: "StageTests",
                principalColumns: new[] { "StageId", "TestId" },
                onDelete: ReferentialAction.Restrict);
        }
    }
}
