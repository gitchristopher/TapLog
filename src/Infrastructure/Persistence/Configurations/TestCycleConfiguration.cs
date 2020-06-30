using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    //public class TestCycleConfiguration : IEntityTypeConfiguration<TestCycle>
    //{
    //    public void Configure(EntityTypeBuilder<TestCycle> builder)
    //    {
    //        builder.HasKey(tc => new { tc.TestId, tc.CycleId });
    //        builder.HasOne(tc => tc.Test).WithMany(t => t.TestCycles).HasForeignKey(tc => tc.TestId);
    //        builder.HasOne(tc => tc.Cycle).WithMany(c => c.TestCycles).HasForeignKey(tc => tc.CycleId);
    //    }
    //}
}
