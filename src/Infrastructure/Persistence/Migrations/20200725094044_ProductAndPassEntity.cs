using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class ProductAndPassEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PassId",
                table: "Cards",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "Cards",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Passes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<string>(nullable: true),
                    LastModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Passes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<string>(nullable: true),
                    LastModified = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cards_PassId",
                table: "Cards",
                column: "PassId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_ProductId",
                table: "Cards",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Passes_PassId",
                table: "Cards",
                column: "PassId",
                principalTable: "Passes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Products_ProductId",
                table: "Cards",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Passes_PassId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Products_ProductId",
                table: "Cards");

            migrationBuilder.DropTable(
                name: "Passes");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Cards_PassId",
                table: "Cards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ProductId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "PassId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Cards");
        }
    }
}
