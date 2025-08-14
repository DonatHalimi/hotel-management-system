using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Validations
{
    public class PaginationValidation
    {
        public static void Validate(int page, int pageSize, string search, out IActionResult? validationResult)
        {
            validationResult = null;

            if (page < CoreConstants.MIN_PAGE_NUMBER)
            {
                validationResult = new BadRequestObjectResult($"Page number must be at least {CoreConstants.MIN_PAGE_SIZE}");
                return;
            }

            if (pageSize < CoreConstants.MIN_PAGE_SIZE)
            {
                validationResult = new BadRequestObjectResult($"Page size must be at least {CoreConstants.MIN_PAGE_SIZE}");
                return;
            }

            if (pageSize > CoreConstants.MAX_PAGE_SIZE)
            {
                validationResult = new BadRequestObjectResult($"Page size cannot exceed {CoreConstants.MAX_PAGE_SIZE}");
                return;
            }

            if (!string.IsNullOrEmpty(search) && search.Length > CoreConstants.MAX_SEARCH_LENGTH)
            {
                validationResult = new BadRequestObjectResult($"Search term cannot exceed {CoreConstants.MAX_SEARCH_LENGTH} characters.");
            }
        }
    }

    public class BulkDeleteValidation : AbstractValidator<BulkDeleteDTO>
    {
        public BulkDeleteValidation()
        {
            RuleFor(x => x.Ids)
                .NotEmpty().WithMessage("At least one ID is required")
                .Must(ids => ids.Length <= CoreConstants.MAX_DELETE_LENGTH).WithMessage($"Cannot delete more than {CoreConstants.MAX_DELETE_LENGTH} entries at once");
        }
    }
}