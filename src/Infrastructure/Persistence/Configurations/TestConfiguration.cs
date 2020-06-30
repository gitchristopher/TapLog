using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class TestConfiguration : IEntityTypeConfiguration<Test>
    {
        public void Configure(EntityTypeBuilder<Test> builder)
        {
            builder.Property(t => t.JiraTestNumber).HasMaxLength(16).IsRequired();
            builder.Property(c => c.CreatedBy).HasMaxLength(64);
            builder.Property(c => c.LastModifiedBy).HasMaxLength(64);

            //builder.HasMany(t => t.Taps).WithOne(t => t.Test).IsRequired();
            builder.HasMany(t => t.StageTests).WithOne(t => t.Test).IsRequired();
        }
    }
}
