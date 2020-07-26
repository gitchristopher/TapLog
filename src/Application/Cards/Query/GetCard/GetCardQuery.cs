using AutoMapper;
using AutoMapper.QueryableExtensions;
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

namespace TapLog.Application.Cards.Query.GetCard
{

    public class GetCardQuery : IRequest<CardDto>
    {
        public int Id { get; set; }
    }

    public class GetCardQueryHandler : IRequestHandler<GetCardQuery, CardDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCardQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CardDto> Handle(GetCardQuery request, CancellationToken cancellationToken)
        {
            var response = await _context.Cards
                                            .Include(c => c.Supplier)
                                            .Include(c => c.Product)
                                            .Include(c => c.Pass)
                                            .Include(c => c.Taps)
                                                .ThenInclude(c => c.Device)
                                            .FirstOrDefaultAsync(c => c.Id == request.Id);
            var responseDto = _mapper.Map<CardDto>(response);
            return responseDto;
        }
    }

}
