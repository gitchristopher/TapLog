using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Helper;
using TapLog.Application.Common.Interfaces;

namespace TapLog.Application.Devices.Commands.CreateDevice
{
    public class CreateDeviceCommandValidator : AbstractValidator<CreateDeviceCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateDeviceCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(d => d.Code)
                .Transform(d => StringCleaner.CleanInput(d))
                .NotEmpty().WithMessage("Code is required.")
                .MaximumLength(32).WithMessage("Code must not exceed 32 characters.")
                .MustAsync(BeUniqueCode).WithMessage("The specified Code already exists.")
                .Must(NotContainBadCharactersCode).WithMessage("Code can only contain a-zA-Z0-9_.$@-");
            RuleFor(d => d.Name)
                .Transform(d => StringCleaner.CleanInput(d))
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(64).WithMessage("Code must not exceed 64 characters.")
                .Must(NotContainBadCharactersName).WithMessage("Name can only contain a-zA-Z0-9_.$@-");
            RuleFor(d => d.Zone)
                .NotEmpty().WithMessage("Zone is required.")
                .ExclusiveBetween(0, 100).WithMessage("Zone must be between 0 and 100.");
            RuleFor(d => d.Latitude)
                .Transform(d => StringCleaner.CleanInput(d))
                .MaximumLength(16).WithMessage("Latitude must not exceed 16 characters")
                .Must(NotContainBadCharactersLat).WithMessage("Latitude can only contain a-zA-Z0-9_.$@-");
            RuleFor(d => d.Longitude)
                .Transform(d => StringCleaner.CleanInput(d))
                .MaximumLength(16).WithMessage("Longitude must not exceed 16 characters")
                .Must(NotContainBadCharactersLng).WithMessage("Longitude can only contain a-zA-Z0-9_.$@-");
        }

        public async Task<bool> BeUniqueCode(CreateDeviceCommand model, string code, CancellationToken cancellationToken)
        {
            return await _context.Devices
                .AllAsync(x => x.Code != code);
        }
        public bool NotContainBadCharactersName(CreateDeviceCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Name);
        }
        public bool NotContainBadCharactersCode(CreateDeviceCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Code);
        }
        public bool NotContainBadCharactersLat(CreateDeviceCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Latitude);
        }
        public bool NotContainBadCharactersLng(CreateDeviceCommand model, string input)
        {
            return !StringCleaner.HasBadCharacters(model.Longitude);
        }
    }

}
