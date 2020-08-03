using AutoMapper;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Helper;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Suppliers.Commands.UpdateSupplier
{

    public class UpdateSupplierCommand : IRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateSupplierCommandHandler : IRequestHandler<UpdateSupplierCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateSupplierCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
        {
            var name = StringCleaner.CleanInput(request.Name).Trim();
            if (String.IsNullOrEmpty(name))
            {
                throw new NotFoundException("User input is bad.", request.Name);
            }

            // Retrieve the entity
            var entity = await _context.Suppliers.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Supplier), request.Id);
            }

            // Update the entity
            entity.Name = name;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
