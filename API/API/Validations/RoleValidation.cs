using API.Data.Context;
using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace API.Validations
{
    public class CreateRoleDTOValidation : AbstractValidator<CreateRoleDTO>
    {
        public CreateRoleDTOValidation(AppDbContext context)
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Role name is required")
                .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("Role name must start with a capital letter and be at least 3 letters long, containing only letters")
                .MaximumLength(RoleConstants.MAX_NAME_LENGTH).WithMessage($"Role name cannot exceed {RoleConstants.MAX_NAME_LENGTH} characters")
                .MustAsync(async (name, cancellation) => await RoleValidation.IsRoleUniqueAsync(name, context)).WithMessage("Role name already exists");

            RuleFor(x => x.Description)
                .MaximumLength(RoleConstants.MAX_DESCRIPTION_LENGTH).WithMessage($"Description cannot exceed {RoleConstants.MAX_DESCRIPTION_LENGTH} characters");
        }
    }

    public class UpdateRoleDTOValidation : AbstractValidator<UpdateRoleDTO>
    {
        public UpdateRoleDTOValidation()
        {
            RuleFor(x => x.Name)
                .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("Role name must start with a capital letter and be at least 3 letters long, containing only letters")
                .MaximumLength(RoleConstants.MAX_NAME_LENGTH).WithMessage($"Role name cannot exceed {RoleConstants.MAX_NAME_LENGTH} characters")
                .When(x => x.Name != null);

            RuleFor(x => x.Description)
                .MaximumLength(RoleConstants.MAX_DESCRIPTION_LENGTH).WithMessage($"Description cannot exceed {RoleConstants.MAX_DESCRIPTION_LENGTH} characters")
                .When(x => x.Description != null);
        }
    }

    public static class RoleValidation
    {
        public static async Task<bool> IsRoleValid(Guid? roleId, AppDbContext context)
        {
            if (roleId == null || roleId == Guid.Empty)
                return false;

            return await context.Roles.AnyAsync(r => r.RoleID == roleId);
        }

        public static async Task<bool> IsRoleUniqueAsync(string name, AppDbContext context)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            return !await context.Roles.AnyAsync(r => EF.Functions.Like(r.Name.ToLower(), name.ToLower()));
        }
    }
}
