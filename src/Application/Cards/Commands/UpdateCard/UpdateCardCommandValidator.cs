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

namespace TapLog.Application.Cards.Commands.UpdateCard
{
    public class UpdateCardCommandValidator : AbstractValidator<UpdateCardCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCardCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(c => c.Number)
                .Transform(c => StringCleaner.CleanInput(c))
                .NotEmpty().WithMessage("Number is required.")
                .MaximumLength(32).WithMessage("Number must not exceed 32 characters.")
                .MustAsync(BeUniqueNumber).WithMessage("The specified Number already exists.")
                .Must(NotContainBadCharactersNumber).WithMessage("Number can only contain a-zA-Z0-9_.$@-");
            RuleFor(c => c.Alias)
                .Transform(c => StringCleaner.CleanInput(c))
                .MaximumLength(32).WithMessage("Alias must not exceed 32 characters.")
                .MustAsync(BeUniqueAlias).WithMessage("The specified Alias already exists.")
                .Must(NotContainBadCharactersAlias).WithMessage("Alias can only contain a-zA-Z0-9_.$@-");
            RuleFor(c => c.SupplierId)
                .NotEmpty().WithMessage("Supplier must not be null.")
                .MustAsync(SupplierExist).WithMessage("Supplier does not exist.");
            RuleFor(c => c.PassId)
                .MustAsync(PassExist).WithMessage("Pass does not exist.").When(c => c.PassId != null);
            RuleFor(c => c.ProductId)
                .MustAsync(ProductExist).WithMessage("Product does not exist.").When(c => c.ProductId != null);
        }
        
        public bool NotContainBadCharactersNumber(UpdateCardCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Number);
        }
        public bool NotContainBadCharactersAlias(UpdateCardCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Alias);
        }
        public async Task<bool> BeUniqueNumber(UpdateCardCommand model, string number, CancellationToken cancellationToken)
        {
            return await _context.Cards
                .Where(c => c.Id != model.Id)
                .AllAsync(x => x.Number != number);
        }
        public async Task<bool> BeUniqueAlias(UpdateCardCommand model, string alias, CancellationToken cancellationToken)
        {
            return await _context.Cards
                .Where(x => x.Alias.Length > 0)
                .AllAsync(x => x.Alias != alias);
        }
        public async Task<bool> SupplierExist(int supplierId, CancellationToken cancellationToken)
        {
            return await _context.Suppliers.FindAsync(supplierId) != null;
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
