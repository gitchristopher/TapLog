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

namespace TapLog.Application.Stages.Query.GetStage
{
    public class GetStageQuery : IRequest<StageDto>
    {
        public int Id { get; set; }
    }

    public class GetStageQueryHandler : IRequestHandler<GetStageQuery, StageDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetStageQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<StageDto> Handle(GetStageQuery request, CancellationToken cancellationToken)
        {
            var response = await _context.Stages.Include(s => s.StageTests).FirstOrDefaultAsync(s => s.Id == request.Id);
            var responseDto = _mapper.Map<StageDto>(response);
            return responseDto;
        }
    }

}
