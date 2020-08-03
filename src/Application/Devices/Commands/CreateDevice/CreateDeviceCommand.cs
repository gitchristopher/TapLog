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
namespace TapLog.Application.Devices.Commands.CreateDevice
{

    public class CreateDeviceCommand : IRequest<int>
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public int Zone { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }

    public class CreateDeviceCommandHandler : IRequestHandler<CreateDeviceCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateDeviceCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateDeviceCommand request, CancellationToken cancellationToken)
        {
            //Map request to entity
            var entity = new Device
            {
                Code = request.Code,
                Name = request.Name,
                Zone = request.Zone,
                Latitude = (request.Latitude?.Length == 0) ? null : request.Latitude,
                Longitude = (request.Longitude?.Length == 0) ? null : request.Longitude
            };

            _context.Devices.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
