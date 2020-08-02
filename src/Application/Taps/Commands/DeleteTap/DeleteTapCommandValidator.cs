using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Taps.Commands.DeleteTap
{
    public class DeleteTapCommandValidator : AbstractValidator<DeleteTapCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteTapCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(t => t.Id)
                .MustAsync(Exist).WithMessage("The specified Tap does not exist.");
        }

        public async Task<bool> Exist(int id, CancellationToken cancellationToken)
        {
            return await _context.Taps.FindAsync(id) != null;
        }
    }
}
