using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Suppliers.Commands.CreateSupplier
{
    public class CreateSupplierCommandValidator : AbstractValidator<CreateSupplierCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateSupplierCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(v => v.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(32).WithMessage("Name must not exceed 32 characters.")
                .MustAsync(BeUniqueName).WithMessage("The specified Supplier already exists.");
        }

        public async Task<bool> BeUniqueName(CreateSupplierCommand model, string name, CancellationToken cancellationToken)
        {
            return await _context.Suppliers
                .AllAsync(x => x.Name != name);
        }
    }
}