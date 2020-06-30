using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    //class CycleStageConfiguration : IEntityTypeConfiguration<CycleStage>
    //{
    //    public void Configure(EntityTypeBuilder<CycleStage> builder)
    //    {
    //        builder.HasKey(cs => new { cs.CycleId, cs.StageId});
    //        builder.HasOne(cs => cs.Cycle).WithMany(c => c.CycleStages).HasForeignKey(cs => cs.CycleId);
    //        builder.HasOne(cs => cs.Stage).WithMany(s => s.CycleStages).HasForeignKey(cs => cs.StageId);
    //    }
    //}
}
