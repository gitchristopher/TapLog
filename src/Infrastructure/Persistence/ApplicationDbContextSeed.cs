using TapLog.Domain.Entities;
using TapLog.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Internal;
using System.ComponentModel.Design.Serialization;

namespace TapLog.Infrastructure.Persistence
{
    public static class ApplicationDbContextSeed
    {
        public static async Task SeedDefaultUserAsync(UserManager<ApplicationUser> userManager)
        {
            var defaultUser = new ApplicationUser { UserName = "administrator@localhost", Email = "administrator@localhost" };

            if (userManager.Users.All(u => u.UserName != defaultUser.UserName))
            {
                await userManager.CreateAsync(defaultUser, "Administrator1!");
            }
        }

        public static async Task SeedSampleDataAsync(ApplicationDbContext context)
        {
            // Seed, if necessary
            if (!context.TodoLists.Any())
            {
                context.TodoLists.Add(new TodoList
                {
                    Title = "Shopping",
                    Items =
                    {
                        new TodoItem { Title = "Apples", Done = true },
                        new TodoItem { Title = "Milk", Done = true },
                        new TodoItem { Title = "Bread", Done = true },
                        new TodoItem { Title = "Toilet paper" },
                        new TodoItem { Title = "Pasta" },
                        new TodoItem { Title = "Tissues" },
                        new TodoItem { Title = "Tuna" },
                        new TodoItem { Title = "Water" }
                    }
                });

                await context.SaveChangesAsync();
            }

            if (!context.Devices.Any())
            {
                context.Devices.Add(new Device { Name = "BWP", Code = "01", Zone = 5, Latitude = "27.9637", Longitude = "153.4158" });
                context.Devices.Add(new Device { Name = "SPN", Code = "07", Zone = 5, Latitude = "28.0000", Longitude = "153.4167" });
                context.Devices.Add(new Device { Name = "MBA", Code = "12", Zone = 5, Latitude = "27.9630", Longitude = "153.4260" });
                context.Devices.Add(new Device { Name = "MBB", Code = "15", Zone = 5, Latitude = "27.9630", Longitude = "153.4260" });
                await context.SaveChangesAsync();
            }
            if (!context.Cards.Any())
            {
                context.Cards.Add(new Card { Alias = "MC ALICE", Number = "1234554321", Supplier = new Supplier { Name = "MC" } });
                context.Cards.Add(new Card { Alias = "AM BOB", Number = "2233445566", Supplier = new Supplier { Name = "AM" } });
                context.Cards.Add(new Card { Alias = "VC EVE", Number = "3216544321", Supplier = new Supplier { Name = "VC" } });
                context.Cards.Add(new Card { Alias = "GC IRINA", Number = "1234321566", Supplier = new Supplier { Name = "GC" } });
                await context.SaveChangesAsync();
            }
            if (!context.Stages.Any())
            {
                context.Stages.Add(new Stage { Name = "A", IsCurrent = true });
                context.Stages.Add(new Stage { Name = "B", IsCurrent = false });
                context.Stages.Add(new Stage { Name = "C", IsCurrent = false });
                context.Stages.Add(new Stage { Name = "D", IsCurrent = false });
                await context.SaveChangesAsync();
            }
        }
    }
}
