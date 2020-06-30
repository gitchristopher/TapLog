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
using TapLog.Application.Taps.Query;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Devices.Query.GetDevice
{
    public class GetDeviceQuery : IRequest<DeviceDetailDto>
    {
        public int Id { get; set; }
    }

    public class GetDeviceQueryHandler : IRequestHandler<GetDeviceQuery, DeviceDetailDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDeviceQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DeviceDetailDto> Handle(GetDeviceQuery request, CancellationToken cancellationToken)
        {
            var response = await _context.Devices.Include(d => d.Taps).ThenInclude(t => t.Card).ThenInclude(c => c.Supplier).FirstOrDefaultAsync(d => d.Id == request.Id);
            var responseDto = _mapper.Map<DeviceDetailDto>(response);

            return responseDto;
        }
    }

}
