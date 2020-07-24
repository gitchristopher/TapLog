using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class AddTapActionEnum : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Action",
                table: "Taps",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Action",
                table: "Taps");
        }
    }
}
