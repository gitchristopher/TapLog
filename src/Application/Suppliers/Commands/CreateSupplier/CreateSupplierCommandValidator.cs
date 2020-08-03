using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Helper;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Suppliers.Commands.CreateSupplier
{
    public class CreateSupplierCommandValidator : AbstractValidator<CreateSupplierCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateSupplierCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(s => s.Name)
                .Transform(s => StringCleaner.CleanInput(s))
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(32).WithMessage("Name must not exceed 32 characters.")
                .MustAsync(BeUniqueName).WithMessage("The specified Supplier already exists.")
                .Must(NotContainBadCharactersName).WithMessage("Name can only contain a-zA-Z0-9_.$@-");
        }

        public async Task<bool> BeUniqueName(CreateSupplierCommand model, string name, CancellationToken cancellationToken)
        {
            return await _context.Suppliers
                .AllAsync(x => x.Name != name);
        }
        public bool NotContainBadCharactersName(CreateSupplierCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Name);
        }
    }
}