using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Tests.Commands.DeleteTest
{
    public class DeleteTestCommandValidator : AbstractValidator<DeleteTestCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteTestCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.TestId)
                .MustAsync(TestExist).WithMessage("The specified Test does not exist for the given stage.");
            RuleFor(v => v.StageId)
                .MustAsync(StageExist).WithMessage("The specified Stage does not exist for the given test.");
        }

        public async Task<bool> TestExist(DeleteTestCommand model, int id, CancellationToken cancellationToken)
        {
            return await _context.StageTests.FindAsync(model.StageId, model.TestId) != null;
        }

        public async Task<bool> StageExist(DeleteTestCommand model, int id, CancellationToken cancellationToken)
        {
            return await _context.StageTests.FindAsync(model.StageId, model.TestId) != null;
        }
    }
}
