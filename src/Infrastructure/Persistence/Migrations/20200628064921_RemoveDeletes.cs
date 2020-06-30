using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class RemoveDeletes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Suppliers_SupplierId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_StageTests_Stages_StageId",
                table: "StageTests");

            migrationBuilder.DropForeignKey(
                name: "FK_StageTests_Tests_TestId",
                table: "StageTests");

            migrationBuilder.DropForeignKey(
                name: "FK_Taps_Cards_CardId",
                table: "Taps");

            migrationBuilder.DropForeignKey(
                name: "FK_Taps_TestExecutions_TestExecutionId",
                table: "Taps");

            migrationBuilder.DropForeignKey(
                name: "FK_TestExecutions_StageTests_StageId_TestId",
                table: "TestExecutions");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Suppliers_SupplierId",
                table: "Cards",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StageTests_Stages_StageId",
                table: "StageTests",
                column: "StageId",
                principalTable: "Stages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StageTests_Tests_TestId",
                table: "StageTests",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Taps_Cards_CardId",
                table: "Taps",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Taps_TestExecutions_TestExecutionId",
                table: "Taps",
                column: "TestExecutionId",
                principalTable: "TestExecutions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestExecutions_StageTests_StageId_TestId",
                table: "TestExecutions",
                columns: new[] { "StageId", "TestId" },
                principalTable: "StageTests",
                principalColumns: new[] { "StageId", "TestId" },
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Suppliers_SupplierId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_StageTests_Stages_StageId",
                table: "StageTests");

            migrationBuilder.DropForeignKey(
                name: "FK_StageTests_Tests_TestId",
                table: "StageTests");

            migrationBuilder.DropForeignKey(
                name: "FK_Taps_Cards_CardId",
                table: "Taps");

            migrationBuilder.DropForeignKey(
                name: "FK_Taps_TestExecutions_TestExecutionId",
                table: "Taps");

            migrationBuilder.DropForeignKey(
                name: "FK_TestExecutions_StageTests_StageId_TestId",
                table: "TestExecutions");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Suppliers_SupplierId",
                table: "Cards",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StageTests_Stages_StageId",
                table: "StageTests",
                column: "StageId",
                principalTable: "Stages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StageTests_Tests_TestId",
                table: "StageTests",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Taps_Cards_CardId",
                table: "Taps",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Taps_TestExecutions_TestExecutionId",
                table: "Taps",
                column: "TestExecutionId",
                principalTable: "TestExecutions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TestExecutions_StageTests_StageId_TestId",
                table: "TestExecutions",
                columns: new[] { "StageId", "TestId" },
                principalTable: "StageTests",
                principalColumns: new[] { "StageId", "TestId" },
                onDelete: ReferentialAction.Restrict);
        }
    }
}
