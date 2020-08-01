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

namespace TapLog.Application.Cards.Query.GetCardToDelete
{

    public class GetCardToDeleteQuery : IRequest<CardToDeleteDto>
    {
        public int Id { get; set; }
    }

    public class GetCardToDeleteQueryHandler : IRequestHandler<GetCardToDeleteQuery, CardToDeleteDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCardToDeleteQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CardToDeleteDto> Handle(GetCardToDeleteQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Cards.Include(c => c.Taps).Include(c => c.Supplier).FirstOrDefaultAsync(c => c.Id == request.Id);

            var responseDto = _mapper.Map<Card, CardToDeleteDto>(entity);

            return responseDto;
        }
    }

}
