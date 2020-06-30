using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class TestExecutionConfiguration : IEntityTypeConfiguration<TestExecution>
    {
        public void Configure(EntityTypeBuilder<TestExecution> builder)
        {
            builder.HasOne(te => te.StageTest).WithMany(st => st.TestExecutions).HasForeignKey(te => new { te.StageId, te.TestId});
            builder.HasMany(te => te.Taps).WithOne(t => t.TestExecution);
            builder.Property(t => t.CreatedBy).HasMaxLength(64);
            builder.Property(c => c.LastModifiedBy).HasMaxLength(64);
        }
    }
}
