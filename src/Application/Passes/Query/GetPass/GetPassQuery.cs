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

namespace TapLog.Application.Passes.Query.GetPass
{

    public class GetPassQuery : IRequest<PassDto>
    {
        public int Id { get; set; }
    }

    public class GetPassQueryHandler : IRequestHandler<GetPassQuery, PassDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPassQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PassDto> Handle(GetPassQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Passes.FindAsync(request.Id);
            var responseDto = _mapper.Map<Pass, PassDto>(entity);

            return responseDto;
        }
    }

}
