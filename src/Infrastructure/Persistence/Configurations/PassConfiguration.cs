using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class PassConfiguration : IEntityTypeConfiguration<Pass>
    {
        public void Configure(EntityTypeBuilder<Pass> builder)
        {
            builder.Property(s => s.Name).HasMaxLength(32).IsRequired();

            builder.HasMany(s => s.Cards).WithOne(c => c.Pass);
        }
    }
}
