using AutoMapper;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Devices.Commands.DeleteDevice
{

    public class DeleteDeviceCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteDeviceCommandHandler : IRequestHandler<DeleteDeviceCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeleteDeviceCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(DeleteDeviceCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Devices.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Device), request.Id);
            }

            // Delete the entity
            _context.Devices.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
