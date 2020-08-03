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

namespace TapLog.Application.Devices.Commands.UpdateDevice
{

    public class UpdateDeviceCommand : IRequest
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int Zone { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
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
            var code = StringCleaner.CleanInput(request.Code).Trim();
            var name = StringCleaner.CleanInput(request.Name).Trim();
            if (String.IsNullOrEmpty(code) || String.IsNullOrEmpty(name))
            {
                throw new NotFoundException("User input is bad.", request.Id);
            }
            // Retrieve the entity
            var entity = await _context.Devices.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Device), request.Id);
            }

            var lat = (entity.Latitude != null) ? StringCleaner.CleanInput(request.Latitude).Trim() : null;
            var lng = (entity.Longitude != null) ? StringCleaner.CleanInput(request.Longitude).Trim() : null;

            // Update the entity
            entity.Code = code;
            entity.Name = name;
            entity.Zone = request.Zone;
            entity.Latitude = (String.IsNullOrEmpty(lat)) ? null : lat;
            entity.Longitude = (String.IsNullOrEmpty(lng)) ? null : lng;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
