using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(s => s.Name).HasMaxLength(32).IsRequired();

            builder.HasMany(s => s.Cards).WithOne(c => c.Product).OnDelete(DeleteBehavior.SetNull);
        }
    }
}
