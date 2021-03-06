﻿using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Helper;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Tests.Commands.UpdateTest
{
    public class UpdateTestCommandValidator : AbstractValidator<UpdateTestCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateTestCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(t => t.JiraTestNumber)
                .Transform(t => StringCleaner.CleanInput(t))
                .NotEmpty().WithMessage("Jira Test Number is required.")
                .MaximumLength(16).WithMessage("Jira Test Number must not exceed 16 characters.")
                .MustAsync(BeUnique).WithMessage("The specified Test already exists.")
                .Must(NotContainBadCharactersJira).WithMessage("Jira Test Number can only contain a-zA-Z0-9_.$@-");
            RuleFor(v => v.Id)
                .NotEmpty().WithMessage("Test must not be null.")
                .MustAsync(TestExist).WithMessage("Test does not exist.");
        }

        public async Task<bool> BeUnique(UpdateTestCommand model, string jiraTestNumber, CancellationToken cancellationToken)
        {
            return await _context.Tests
                .Where(c => c.Id != model.Id)
                .AllAsync(x => x.JiraTestNumber != jiraTestNumber);
        }
        public async Task<bool> TestExist(int id, CancellationToken cancellationToken)
        {
            return await _context.Tests.FindAsync(id) != null;
        }
        public bool NotContainBadCharactersJira(UpdateTestCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.JiraTestNumber);
        }
    }
}
