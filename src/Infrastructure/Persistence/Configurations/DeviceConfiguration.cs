using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TapLog.Domain.Entities;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class DeviceConfiguration : IEntityTypeConfiguration<Device>
    {
        public void Configure(EntityTypeBuilder<Device> builder)
        {
            builder.Property(d => d.Code).HasMaxLength(32).IsRequired();
            builder.Property(d => d.Name).HasMaxLength(64).IsRequired();
            builder.Property(c => c.CreatedBy).HasMaxLength(64);
            builder.Property(c => c.LastModifiedBy).HasMaxLength(64);

            builder.HasMany(d => d.Taps).WithOne(t => t.Device).IsRequired();
        }
    }
}
