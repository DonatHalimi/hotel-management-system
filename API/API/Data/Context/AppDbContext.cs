using API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Context
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        public DbSet<Payment> Payments { get; set; }

        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>()
                .HasMany(r => r.Users)
                .WithOne(u => u.Role)
                .HasForeignKey(u => u.RoleID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Hotel>()
                .HasMany(h => h.Rooms)
                .WithOne(r => r.Hotel)
                .HasForeignKey(r => r.HotelID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoomType>()
                .HasMany(rt => rt.Rooms)
                .WithOne(r => r.RoomType)
                .HasForeignKey(r => r.RoomTypeID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Guest>()
                .HasMany(g => g.Bookings)
                .WithOne(b => b.Guest)
                .HasForeignKey(b => b.GuestID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Room>()
                .HasMany(r => r.Bookings)
                .WithOne(b => b.Room)
                .HasForeignKey(b => b.RoomID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithMany()
                .HasForeignKey(p => p.BookingID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Booking)
                .WithMany()
                .HasForeignKey(i => i.BookingID)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}