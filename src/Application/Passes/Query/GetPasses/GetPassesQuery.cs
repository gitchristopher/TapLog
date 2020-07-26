using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Passes.Query.GetPasses
{

    public class GetPassesQuery : IRequest<List<PassDto>>
    {
    }

    public class GetPassesQueryHandler : IRequestHandler<GetPassesQuery, List<PassDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPassesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<PassDto>> Handle(GetPassesQuery request, CancellationToken cancellationToken)
        {
            var entities = await _context.Passes.ToListAsync();
            var responseDto = _mapper.Map<List<Pass>, List<PassDto>>(entities);

            return responseDto;
        }
    }

}
