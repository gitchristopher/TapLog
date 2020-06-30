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

namespace TapLog.Application.Stages.Query.GetStages
{

    public class GetStagesQuery : IRequest<List<StageDto>>
    {
    }

    public partial class GetStagesQueryHandler : IRequestHandler<GetStagesQuery, List<StageDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetStagesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<StageDto>> Handle(GetStagesQuery request, CancellationToken cancellationToken)
        {
            var entities = await _context.Stages.ToListAsync();
            var responseDto = _mapper.Map<List<Stage>, List<StageDto>>(entities);

            return responseDto;
        }
    }

}
