using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Stages.Commands.DeleteStage
{
    public class DeleteStageCommandValidator : AbstractValidator<DeleteStageCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteStageCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.Id)
                .MustAsync(Exist).WithMessage("The specified Stage does not exist.");
        }

        public async Task<bool> Exist(int id, CancellationToken cancellationToken)
        {
            return await _context.Stages.FindAsync(id) != null;
        }
    }
}
