namespace API.Models.DTOs
{
    public class CreateRoleDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateRoleDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
