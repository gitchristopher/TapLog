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

namespace TapLog.Application.Devices.Commands.UpdateDevice
{

    public class UpdateDeviceCommand : IRequest
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class UpdateDeviceCommandHandler : IRequestHandler<UpdateDeviceCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateDeviceCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateDeviceCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Devices.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Device), request.Id);
            }

            // Update the entity
            entity.Code = request.Code;
            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
