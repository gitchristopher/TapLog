using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class PassProductDeleteNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Passes_PassId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Products_ProductId",
                table: "Cards");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Passes_PassId",
                table: "Cards",
                column: "PassId",
                principalTable: "Passes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Products_ProductId",
                table: "Cards",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Passes_PassId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Products_ProductId",
                table: "Cards");

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
    }
}
