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

namespace TapLog.Application.Cards.Commands.CreateCard
{
    public class CreateCardCommandValidator : AbstractValidator<CreateCardCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateCardCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(c => c.Number)
                .Transform(c => StringCleaner.CleanInput(c))
                .NotEmpty().WithMessage("Number is required.")
                .MaximumLength(32).WithMessage("Number must not exceed 32 characters.")
                .MustAsync(BeUniqueNumber).WithMessage("The specified Number already exists.")
                .Must(NotContainBadCharactersNumber).WithMessage("Number can only contain a-zA-Z0-9_.$@-");
            //When(c => c?.Alias != null, () =>
            //{
            //    RuleFor(c => c.Alias)
            //    .Transform(c => StringCleaner.CleanInput(c))
            //    .MaximumLength(32).WithMessage("Alias must not exceed 32 characters.")
            //    .MustAsync(BeUniqueAlias).WithMessage("The specified Alias already exists.")
            //    .Must(NotContainBadCharactersAlias).WithMessage("Can only contain a-zA-Z0-9_.$@-");
            //});
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
        
        public bool NotContainBadCharactersNumber(CreateCardCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Number);
        }
        public bool NotContainBadCharactersAlias(CreateCardCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Alias);
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
