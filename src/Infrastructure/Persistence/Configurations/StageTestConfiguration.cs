using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class StageTestConfiguration : IEntityTypeConfiguration<StageTest>
    {
        public void Configure(EntityTypeBuilder<StageTest> builder)
        {
            builder.HasKey(st => new { st.StageId, st.TestId});
            builder.HasOne(st => st.Stage).WithMany(s => s.StageTests).HasForeignKey(st => st.StageId);
            builder.HasOne(st => st.Test).WithMany(t => t.StageTests).HasForeignKey(cs => cs.TestId);

            builder.HasMany(st => st.TestExecutions).WithOne(te => te.StageTest);
        }
    }
}
