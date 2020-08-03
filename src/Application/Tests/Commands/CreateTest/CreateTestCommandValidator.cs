using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Helper;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Tests.Commands.CreateTest
{
    public class CreateTestCommandValidator : AbstractValidator<CreateTestCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateTestCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(t => t.JiraTestNumber)
                .Transform(t => StringCleaner.CleanInput(t))
                .NotEmpty().WithMessage("Jira Test Number is required.")
                .MaximumLength(16).WithMessage("Jira Test Number must not exceed 16 characters.")
                .Must(NotContainBadCharactersJira).WithMessage("Jira Test Number can only contain a-zA-Z0-9_.$@-");
            RuleFor(v => v.StageId)
                .NotEmpty().WithMessage("Stage must not be null.")
                .MustAsync(StageExist).WithMessage("Stage does not exist.");
        }
        public async Task<bool> StageExist(int stageId, CancellationToken cancellationToken)
        {
            return await _context.Stages.FindAsync(stageId) != null;
        }
        public bool NotContainBadCharactersJira(CreateTestCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.JiraTestNumber);
        }
    }
}
