using TapLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TapLog.Infrastructure.Persistence.Configurations
{
    public class TodoItemConfiguration : IEntityTypeConfiguration<TodoItem>
    {
        public void Configure(EntityTypeBuilder<TodoItem> builder)
        {
            builder.Property(t => t.Title)
                .HasMaxLength(200)
                .IsRequired();
            builder.Property(c => c.CreatedBy).HasMaxLength(64);
            builder.Property(c => c.LastModifiedBy).HasMaxLength(64);
            builder.Property(c => c.Note).HasMaxLength(256);
        }
    }
}
