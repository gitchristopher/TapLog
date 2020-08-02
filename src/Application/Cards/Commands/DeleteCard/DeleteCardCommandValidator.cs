using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Cards.Commands.DeleteCard
{
    public class DeleteCardCommandValidator : AbstractValidator<DeleteCardCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteCardCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.Id)
                .MustAsync(Exist).WithMessage("The specified Card does not exist.");
        }

        public async Task<bool> Exist(int id, CancellationToken cancellationToken)
        {
            return await _context.Cards.FindAsync(id) != null;
        }
    }
}
