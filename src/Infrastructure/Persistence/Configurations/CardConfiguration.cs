using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class CardConfiguration : IEntityTypeConfiguration<Card>
    {
        public void Configure(EntityTypeBuilder<Card> builder)
        {
            builder.Property(c => c.Alias).HasMaxLength(32);
            builder.Property(c => c.Number).HasMaxLength(32).IsRequired();
            builder.Property(c => c.SupplierId).IsRequired();
            builder.Property(c => c.CreatedBy).HasMaxLength(64);
            builder.Property(c => c.LastModifiedBy).HasMaxLength(64);

            builder.HasOne(c => c.Supplier).WithMany(t => t.Cards).IsRequired();
            builder.HasMany(t => t.Taps).WithOne(c => c.Card).IsRequired();
        }
    }
}
