using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Passes.Commands.DeletePass
{
    public class DeletePassCommandValidator : AbstractValidator<DeletePassCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeletePassCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.Id)
                .MustAsync(Exist).WithMessage("The specified Pass does not exist.");
        }

        public async Task<bool> Exist(int id, CancellationToken cancellationToken)
        {
            return await _context.Passes.FindAsync(id) != null;
        }
    }
}
