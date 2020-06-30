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

namespace TapLog.Application.Taps.Query.GetTaps
{

    public class GetTapsQuery : IRequest<List<TapDto>>
    {
    }

    public partial class GetTapsQueryHandler : IRequestHandler<GetTapsQuery, List<TapDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetTapsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TapDto>> Handle(GetTapsQuery request, CancellationToken cancellationToken)
        {
            var entities = await _context.Taps
                                          .Include(t => t.Device)
                                          .Include(t => t.Card)
                                            .ThenInclude(c => c.Supplier)
                                          .Include(t => t.TestExecution)
                                            .ThenInclude(te => te.StageTest)
                                                .ThenInclude(st => st.Test)
                                          .ToListAsync();
            var responseDto = _mapper.Map<List<Tap>, List<TapDto>>(entities);

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
