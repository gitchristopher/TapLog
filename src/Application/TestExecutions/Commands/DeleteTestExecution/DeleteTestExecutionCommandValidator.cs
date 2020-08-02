using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.TestExecutions.Commands.DeleteTestExecution
{
    public class DeleteTestExecutionCommandValidator : AbstractValidator<DeleteTestExecutionCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteTestExecutionCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.Id)
                .MustAsync(Exist).WithMessage("The specified Test Execution does not exist.");
        }

        public async Task<bool> Exist(int id, CancellationToken cancellationToken)
        {
            return await _context.TestExecutions.FindAsync(id) != null;
        }
    }
}
