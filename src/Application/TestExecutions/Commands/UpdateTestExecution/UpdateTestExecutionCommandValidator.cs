using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.TestExecutions.Commands.UpdateTestExecution
{
    class UpdateTestExecutionCommandValidator : AbstractValidator<UpdateTestExecutionCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateTestExecutionCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(v => v.Id)
                .NotEmpty().WithMessage("This has not been implemented.");
            RuleFor(v => v.Id)
                .Null().WithMessage("This has not been implemented.");
        }
    }
}