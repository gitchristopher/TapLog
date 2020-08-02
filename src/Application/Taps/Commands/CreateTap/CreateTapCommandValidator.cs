using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Taps.Commands.CreateTap
{
    public class CreateTapCommandValidator : AbstractValidator<CreateTapCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateTapCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(t => t.TestExecutionId)
                .NotEmpty().WithMessage("Test Execution must not be null.")
                .MustAsync(ExecutionExist).WithMessage("Test Execution does not exist.");

            RuleFor(t => t.CardId)
                .NotEmpty().WithMessage("Card must not be null.")
                .MustAsync(CardExist).WithMessage("Card does not exist.");

            RuleFor(t => t.DeviceId)
                .NotEmpty().WithMessage("Device must not be null.")
                .MustAsync(DeviceExist).WithMessage("Device does not exist.");

            RuleFor(t => t.Tester)
                .NotEmpty().WithMessage("Tester must not be null.")
                .MaximumLength(64).WithMessage("Tester must not exceed 64 characters.");

            RuleFor(t => t.CaseNumber)
                .MaximumLength(16).WithMessage("CaseNumber must not exceed 16 characters.");

            RuleFor(t => t.Result)
                .IsInEnum();

            RuleFor(t => t.WasResultExpected)
                .IsInEnum();

            RuleFor(t => t.TimeOf)
                .NotEmpty().WithMessage("Time must not be null.");
            // TODO: Do better on validation of time

            RuleFor(t => t.Fare)
                .ScalePrecision(2, 5);

            RuleFor(t => t.BalanceBefore)
                .ScalePrecision(2, 5);

            RuleFor(t => t.BalanceAfter)
                .ScalePrecision(2, 5);

            RuleFor(t => t.Notes)
                .MaximumLength(256).WithMessage("Notes must not exceed 256 characters.");

            RuleFor(t => t.Action)
                .IsInEnum();

            RuleFor(t => t.PassId)
                .MustAsync(PassExist).WithMessage("Pass does not exist.").When(c => c.PassId != null);

            RuleFor(t => t.ProductId)
                .MustAsync(ProductExist).WithMessage("Product does not exist.").When(c => c.ProductId != null);
        }

        public async Task<bool> ExecutionExist(int testExecutionId, CancellationToken cancellationToken)
        {
            return await _context.TestExecutions.FindAsync(testExecutionId) != null;
        }
        public async Task<bool> CardExist(int cardId, CancellationToken cancellationToken)
        {
            return await _context.Cards.FindAsync(cardId) != null;
        }
        public async Task<bool> DeviceExist(int deviceId, CancellationToken cancellationToken)
        {
            return await _context.Devices.FindAsync(deviceId) != null;
        }
        public async Task<bool> PassExist(int? passId, CancellationToken cancellationToken)
        {
            return await _context.Passes.FindAsync(passId) != null;
        }
        public async Task<bool> ProductExist(int? productId, CancellationToken cancellationToken)
        {
            return await _context.Products.FindAsync(productId) != null;
        }
    }
}
