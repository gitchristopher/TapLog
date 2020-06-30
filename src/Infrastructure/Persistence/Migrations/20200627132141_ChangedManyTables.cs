using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class ChangedManyTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Taps_Tests_TestId",
                table: "Taps");

            migrationBuilder.DropTable(
                name: "CycleStage");

            migrationBuilder.DropTable(
                name: "TestCycles");

            migrationBuilder.DropTable(
                name: "Cycles");

            migrationBuilder.DropIndex(
                name: "IX_Taps_TestId",
                table: "Taps");

            migrationBuilder.AddColumn<int>(
                name: "TestExecutionId",
                table: "Taps",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StageTests",
                columns: table => new
                {
                    StageId = table.Column<int>(nullable: false),
                    TestId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StageTests", x => new { x.StageId, x.TestId });
                    table.ForeignKey(
                        name: "FK_StageTests_Stages_StageId",
                        column: x => x.StageId,
                        principalTable: "Stages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StageTests_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestExecutions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(maxLength: 64, nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<string>(maxLength: 64, nullable: true),
                    LastModified = table.Column<DateTime>(nullable: true),
                    TestId = table.Column<int>(nullable: false),
                    StageId = table.Column<int>(nullable: false),
                    StageTestStageId = table.Column<int>(nullable: true),
                    StageTestTestId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestExecutions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestExecutions_StageTests_StageTestStageId_StageTestTestId",
                        columns: x => new { x.StageTestStageId, x.StageTestTestId },
                        principalTable: "StageTests",
                        principalColumns: new[] { "StageId", "TestId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Taps_TestExecutionId",
                table: "Taps",
                column: "TestExecutionId");

            migrationBuilder.CreateIndex(
                name: "IX_StageTests_TestId",
                table: "StageTests",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_TestExecutions_StageTestStageId_StageTestTestId",
                table: "TestExecutions",
                columns: new[] { "StageTestStageId", "StageTestTestId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Taps_TestExecutions_TestExecutionId",
                table: "Taps",
                column: "TestExecutionId",
                principalTable: "TestExecutions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Taps_TestExecutions_TestExecutionId",
                table: "Taps");

            migrationBuilder.DropTable(
                name: "TestExecutions");

            migrationBuilder.DropTable(
                name: "StageTests");

            migrationBuilder.DropIndex(
                name: "IX_Taps_TestExecutionId",
                table: "Taps");

            migrationBuilder.DropColumn(
                name: "TestExecutionId",
                table: "Taps");

            migrationBuilder.CreateTable(
                name: "Cycles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsCurrent = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cycles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CycleStage",
                columns: table => new
                {
                    CycleId = table.Column<int>(type: "int", nullable: false),
                    StageId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CycleStage", x => new { x.CycleId, x.StageId });
                    table.ForeignKey(
                        name: "FK_CycleStage_Cycles_CycleId",
                        column: x => x.CycleId,
                        principalTable: "Cycles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CycleStage_Stages_StageId",
                        column: x => x.StageId,
                        principalTable: "Stages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestCycles",
                columns: table => new
                {
                    TestId = table.Column<int>(type: "int", nullable: false),
                    CycleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestCycles", x => new { x.TestId, x.CycleId });
                    table.ForeignKey(
                        name: "FK_TestCycles_Cycles_CycleId",
                        column: x => x.CycleId,
                        principalTable: "Cycles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TestCycles_Tests_TestId",
                        column: x => x.TestId,
                        principalTable: "Tests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Taps_TestId",
                table: "Taps",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_CycleStage_StageId",
                table: "CycleStage",
                column: "StageId");

            migrationBuilder.CreateIndex(
                name: "IX_TestCycles_CycleId",
                table: "TestCycles",
                column: "CycleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Taps_Tests_TestId",
                table: "Taps",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
