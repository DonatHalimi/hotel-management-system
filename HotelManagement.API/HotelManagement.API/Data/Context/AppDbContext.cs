using HotelManagement.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.API.Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();

                entity.Property(u => u.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}