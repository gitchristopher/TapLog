using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class AlterTapEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Pass",
                table: "Taps",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Product",
                table: "Taps",
                maxLength: 32,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pass",
                table: "Taps");

            migrationBuilder.DropColumn(
                name: "Product",
                table: "Taps");
        }
    }
}
