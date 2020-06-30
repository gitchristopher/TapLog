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

namespace TapLog.Application.Cards.Query.GetCards
{

    public class GetCardsQuery : IRequest<List<CardDto>>
    {
    }

    public partial class GetCardsQueryHandler : IRequestHandler<GetCardsQuery, List<CardDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCardsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<CardDto>> Handle(GetCardsQuery request, CancellationToken cancellationToken)
        {
            var entities = await _context.Cards.Include(c => c.Supplier).Include(c => c.Taps).ThenInclude(c => c.Device).ToListAsync();
            var responseDto = _mapper.Map<List<Card>, List<CardDto>>(entities);

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
