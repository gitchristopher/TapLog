using TapLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace TapLog.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<TodoList> TodoLists { get; set; }

        DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Pass> Passes { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<Stage> Stages { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Tap> Taps { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<StageTest> StageTests { get; set; }
        public DbSet<TestExecution> TestExecutions { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
