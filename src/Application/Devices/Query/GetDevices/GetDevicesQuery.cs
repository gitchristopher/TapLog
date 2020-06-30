using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;

namespace TapLog.Application.Devices.Query.GetDevices
{

    public class GetDevicesQuery : IRequest<List<DeviceDto>>
    {
    }

    public partial class GetDevicesQueryHandler : IRequestHandler<GetDevicesQuery, List<DeviceDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDevicesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<DeviceDto>> Handle(GetDevicesQuery request, CancellationToken cancellationToken)
        {
            var entities = await _context.Devices.ToListAsync();
            var responseDto = _mapper.Map<List<Device>, List<DeviceDto>>(entities);

            //var response = new TapsDto
            //                {
            //    //PriorityLevels = Enum.GetValues(typeof(PriorityLevel))
            //    //    .Cast<PriorityLevel>()
            //    //    .Select(p => new PriorityLevelDto { Value = (int)p, Name = p.ToString() })
            //    //    .ToList(),

            //    //Lists = await _context.TodoLists
            //    //    .ProjectTo<TodoListDto>(_mapper.ConfigurationProvider)
            //    //    .OrderBy(t => t.Title)
            //    //    .ToListAsync(cancellationToken)
            //};

            return responseDto;
        }
    }

}
