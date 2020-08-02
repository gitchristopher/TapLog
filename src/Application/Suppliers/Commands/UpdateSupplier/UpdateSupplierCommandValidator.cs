using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Suppliers.Commands.UpdateSupplier
{
    public class UpdateSupplierCommandValidator : AbstractValidator<UpdateSupplierCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateSupplierCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(v => v.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(32).WithMessage("Name must not exceed 32 characters.")
                .MustAsync(BeUniqueName).WithMessage("The specified Supplier already exists.");
        }

        public async Task<bool> BeUniqueName(UpdateSupplierCommand model, string name, CancellationToken cancellationToken)
        {
            return await _context.Suppliers
                .Where(c => c.Id != model.Id)
                .AllAsync(x => x.Name != name);
        }
    }
}
