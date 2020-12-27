using TapLog.Domain.Entities;
using TapLog.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Internal;
using System.ComponentModel.Design.Serialization;
using System.Collections.Generic;
using System;

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
                    Title = "Refactor",
                    Items =
                    {
                        new TodoItem { Title = "Use in memory DB", Done = true },
                        new TodoItem { Title = "Show login details on welcome screen", Done = true },
                        new TodoItem { Title = "Seed more data", Done = true },
                        new TodoItem { Title = "Rename 3rd version of components from russian" },
                        new TodoItem { Title = "Remove old versions of components" },
                        new TodoItem { Title = "Update repo with screenshots" }
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
                context.Cards.Add(new Card { Alias = "MC ALICE", Number = "1234554321", Supplier = new Supplier { Name = "MC" }, Product = new Product { Name = "Child" } });
                context.Cards.Add(new Card { Alias = "AM BOB", Number = "2233445566", Supplier = new Supplier { Name = "AM" }, Product = new Product { Name = "Adult" } });
                context.Cards.Add(new Card { Alias = "VC EVE", Number = "3216544321", Supplier = new Supplier { Name = "VC" }, Product = new Product { Name = "Senior" } });
                context.Cards.Add(new Card { Alias = "GC IRINA", Number = "1234321566", Supplier = new Supplier { Name = "GC" }, Pass = new Pass { Name = "GE1 Day" } });
                await context.SaveChangesAsync();
            }
            if (!context.Stages.Any())
            {
                context.Stages.Add(new Stage { Name = "1", IsCurrent = true });
                context.Stages.Add(new Stage { Name = "2", IsCurrent = false });
                context.Stages.Add(new Stage { Name = "3", IsCurrent = false });
                await context.SaveChangesAsync();
            }
            if (!context.Tests.Any())
            {
                var s1 = context.Stages.FirstOrDefault(x => x.Name == "1");
                var s2 = context.Stages.FirstOrDefault(x => x.Name == "2");
                context.Tests.Add(new Test { JiraTestNumber = "CAB",
                    StageTests = new List<StageTest> {
                        new StageTest { StageId = s1.Id },
                    }
                });
                context.Tests.Add(new Test { JiraTestNumber = "BCA",
                    StageTests = new List<StageTest> {
                        new StageTest { StageId = s1.Id },
                        new StageTest { StageId = s2.Id },
                    }
                });
                context.Tests.Add(new Test
                {
                    JiraTestNumber = "ABC",
                    StageTests = new List<StageTest>
                    {
                        new StageTest
                        {
                            StageId = s1.Id,
                            TestExecutions = new List<TestExecution>
                            {
                                new TestExecution
                                {
                                    StageId = s1.Id,
                                    Created = DateTime.UtcNow
                                }
                            }
                        }
                    }
                });
                await context.SaveChangesAsync();
            }
            if (!context.Taps.Any())
            {
                var execution = context.TestExecutions.FirstOrDefault();
                execution.Taps = new List<Tap>
                {
                    new Tap
                    {
                        Action = Domain.Enums.TapAction.ForcedExit,
                        BalanceBefore = 5,
                        BalanceAfter = 0,
                        Card = context.Cards.FirstOrDefault(),
                        CardId = context.Cards.FirstOrDefault().Id,
                        Device = context.Devices.Last(),
                        DeviceId = context.Devices.Last().Id,
                        Fare = 5,
                        Notes = "Tap didnt work",
                        Product = context.Cards.FirstOrDefault().Product.Name,
                        Result = Domain.Enums.Result.Unsuccessful,
                        Tester = "Chris",
                        TimeOf = DateTime.Now.AddSeconds(30),
                        CaseNumber = "XYZ",
                        WasResultExpected = Domain.Enums.Expected.No
                    },
                    new Tap
                    {
                        Action = Domain.Enums.TapAction.Exit,
                        BalanceBefore = 10,
                        BalanceAfter = 5,
                        Card = context.Cards.FirstOrDefault(),
                        CardId = context.Cards.FirstOrDefault().Id,
                        Device = context.Devices.Last(),
                        DeviceId = context.Devices.Last().Id,
                        Fare = 5,
                        Notes = "Tap worked",
                        Product = context.Cards.FirstOrDefault().Product.Name,
                        Result = Domain.Enums.Result.Successful,
                        Tester = "Chris",
                        TimeOf = DateTime.Now.AddSeconds(15),
                        CaseNumber = "XYZ",
                        WasResultExpected = Domain.Enums.Expected.Yes
                    },
                    new Tap
                    {
                        Action = Domain.Enums.TapAction.Entry,
                        BalanceBefore = 10,
                        BalanceAfter = 10,
                        Card = context.Cards.FirstOrDefault(),
                        CardId = context.Cards.FirstOrDefault().Id,
                        Device = context.Devices.FirstOrDefault(),
                        DeviceId = context.Devices.FirstOrDefault().Id,
                        Fare = 0,
                        Notes = "Tap worked",
                        Product = context.Cards.FirstOrDefault().Product.Name,
                        Result = Domain.Enums.Result.Successful,
                        Tester = "Chris",
                        TimeOf = DateTime.Now,
                        CaseNumber = "XYZ",
                        WasResultExpected = Domain.Enums.Expected.Yes
                    }
                };
                await context.SaveChangesAsync();
            }
        }
    }
}
