using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Devices.Query.GetDeviceToDelete
{

    public class GetDeviceToDeleteQuery : IRequest<DeviceToDeleteDto>
    {
        public int Id { get; set; }
    }

    public class GetDeviceToDeleteQueryHandler : IRequestHandler<GetDeviceToDeleteQuery, DeviceToDeleteDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDeviceToDeleteQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DeviceToDeleteDto> Handle(GetDeviceToDeleteQuery request, CancellationToken cancellationToken)
        {
            var responseDto = await _context.Devices.Where(x => x.Id == request.Id).Include(d => d.Taps).Select(d => new DeviceToDeleteDto { Id = d.Id, Code = d.Code, Name = d.Name, TapCount = d.Taps.Count() }).FirstOrDefaultAsync();

            return responseDto;
        }
    }

}
