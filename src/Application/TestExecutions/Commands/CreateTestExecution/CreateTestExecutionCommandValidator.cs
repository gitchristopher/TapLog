using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.TestExecutions.Commands.CreateTestExecution
{
    public class CreateTestExecutionCommandValidator : AbstractValidator<CreateTestExecutionCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateTestExecutionCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(v => v.TestId)
                .NotEmpty().WithMessage("Test is required.")
                .MustAsync(TestExist).WithMessage("The specified Test does not exist.");
            RuleFor(v => v.StageId)
                .NotEmpty().WithMessage("Stage is required.")
                .MustAsync(StageExist).WithMessage("The specified Stage does not exist.");
        }
        public async Task<bool> TestExist(int testId, CancellationToken cancellationToken)
        {
            return await _context.Tests.FindAsync(testId) != null;
        }
        public async Task<bool> StageExist(int stageId, CancellationToken cancellationToken)
        {
            return await _context.Stages.FindAsync(stageId) != null;
        }
    }
}