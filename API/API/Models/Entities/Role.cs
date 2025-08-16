using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace API.Models.Entities
{
    public class Role
    {
        [Key]
        public Guid RoleID { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}