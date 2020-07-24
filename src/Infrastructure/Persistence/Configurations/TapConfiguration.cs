using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class TapConfiguration : IEntityTypeConfiguration<Tap>
    {
        public void Configure(EntityTypeBuilder<Tap> builder)
        {
            builder.Property(t => t.TestExecutionId).IsRequired();
            builder.Property(t => t.CardId).IsRequired();
            builder.Property(t => t.DeviceId).IsRequired();
            builder.Property(t => t.Tester).IsRequired().HasMaxLength(64);
            builder.Property(t => t.CaseNumber).HasMaxLength(16);
            builder.Property(t => t.Result).IsRequired();
            builder.Property(t => t.WasResultExpected).IsRequired();
            builder.Property(t => t.Action).IsRequired();
            builder.Property(t => t.TimeOf).IsRequired();
            builder.Property(t => t.Fare).HasColumnType("decimal(3,2)");
            builder.Property(t => t.BalanceBefore).HasColumnType("decimal(5,2)");
            builder.Property(t => t.BalanceAfter).HasColumnType("decimal(5,2)");
            builder.Property(t => t.Notes).HasMaxLength(256);
            builder.Property(t => t.CreatedBy).HasMaxLength(64);
            builder.Property(t => t.LastModifiedBy).HasMaxLength(64);

            builder.HasOne(t => t.Card).WithMany(c => c.Taps).IsRequired();
            builder.HasOne(t => t.Device).WithMany(c => c.Taps).IsRequired();
            builder.HasOne(t => t.TestExecution).WithMany(te => te.Taps).IsRequired();
        }
    }
}
