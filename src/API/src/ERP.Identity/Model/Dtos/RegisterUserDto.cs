namespace ERP.Identity.Model.Dtos
{
    public class RegisterUserDto
    {
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public required string FullName { get; set; }
        public required string Password { get; set; }
        public required Guid DepartmentId { get; set; }
        public required List<string> Roles { get; set; }
    }
}
