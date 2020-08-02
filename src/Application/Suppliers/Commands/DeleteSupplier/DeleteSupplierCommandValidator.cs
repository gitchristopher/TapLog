using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Suppliers.Commands.DeleteSupplier
{
    public class DeleteSupplierCommandValidator : AbstractValidator<DeleteSupplierCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteSupplierCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.Id)
                .MustAsync(Exist).WithMessage("The specified Supplier does not exist.");
        }

        public async Task<bool> Exist(int id, CancellationToken cancellationToken)
        {
            return await _context.Suppliers.FindAsync(id) != null;
        }
    }
}
