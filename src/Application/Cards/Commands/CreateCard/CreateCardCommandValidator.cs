using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Cards.Commands.CreateCard
{
    public class CreateCardCommandValidator : AbstractValidator<CreateCardCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateCardCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(v => v.Number)
                .NotEmpty().WithMessage("Number is required.")
                .MaximumLength(32).WithMessage("Number must not exceed 32 characters.")
                .MustAsync(BeUniqueNumber).WithMessage("The specified Number already exists.");
            RuleFor(v => v.Alias)
                .MaximumLength(32).WithMessage("Alias must not exceed 32 characters.")
                .MustAsync(BeUniqueAlias).WithMessage("The specified Alias already exists.");
            RuleFor(v => v.SupplierId)
                .NotEmpty().WithMessage("Supplier must not be null.")
                .MustAsync(SupplierExist).WithMessage("Supplier does not exist.");
            RuleFor(v => v.PassId)
                .MustAsync(PassExist).WithMessage("Pass does not exist.").When(c => c.PassId != null);
            RuleFor(v => v.ProductId)
                .MustAsync(ProductExist).WithMessage("Product does not exist.").When(c => c.ProductId != null);
        }

        public async Task<bool> BeUniqueNumber(CreateCardCommand model, string number, CancellationToken cancellationToken)
        {
            return await _context.Cards
                .AllAsync(x => x.Number != number);
        }
        public async Task<bool> BeUniqueAlias(CreateCardCommand model, string alias, CancellationToken cancellationToken)
        {
            return await _context.Cards
                .Where(x => x.Alias.Length > 0)
                .AllAsync(x => x.Alias != alias);
        }
        public async Task<bool> SupplierExist(int id, CancellationToken cancellationToken)
        {
            return await _context.Suppliers.FindAsync(id) != null;
        }
        public async Task<bool> PassExist(int? id, CancellationToken cancellationToken)
        {
            return await _context.Passes.FindAsync(id) != null;
        }
        public async Task<bool> ProductExist(int? id, CancellationToken cancellationToken)
        {
            return await _context.Products.FindAsync(id) != null;
        }
    }
}
