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

namespace TapLog.Application.Passes.Commands.UpdatePass
{
    public class UpdatePassCommandValidator : AbstractValidator<UpdatePassCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePassCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(c => c.Name)
                .Transform(c => StringCleaner.CleanInput(c))
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(32).WithMessage("Name must not exceed 32 characters.")
                .MustAsync(BeUniqueName).WithMessage("The specified Name already exists.")
                .Must(NotContainBadCharactersName).WithMessage("Name can only contain a-zA-Z0-9_.$@-");
        }

        public async Task<bool> BeUniqueName(UpdatePassCommand model, string name, CancellationToken cancellationToken)
        {
            return await _context.Passes
                .Where(x => x.Id != model.Id)
                .AllAsync(x => x.Name != name);
        }
        public bool NotContainBadCharactersName(UpdatePassCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Name);
        }
    }
}
