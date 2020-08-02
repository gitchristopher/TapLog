﻿using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Stages.Commands.UpdateStage
{
    public class UpdateStageCommandValidator : AbstractValidator<UpdateStageCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateStageCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(v => v.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(32).WithMessage("Name must not exceed 32 characters.")
                .MustAsync(BeUniqueName).WithMessage("The specified Name already exists.");
        }

        public async Task<bool> BeUniqueName(UpdateStageCommand model, string name, CancellationToken cancellationToken)
        {
            return await _context.Stages
                .Where(c => c.Id != model.Id)
                .AllAsync(x => x.Name != name);
        }
    }
}
