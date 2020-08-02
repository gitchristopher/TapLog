using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Products.Commands.DeleteProduct
{
    public class DeleteProductCommandValidator : AbstractValidator<DeleteProductCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteProductCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.Id)
                .MustAsync(Exist).WithMessage("The specified Product does not exist.");
        }

        public async Task<bool> Exist(int id, CancellationToken cancellationToken)
        {
            return await _context.Products.FindAsync(id) != null;
        }
    }
}
