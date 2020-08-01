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

namespace TapLog.Application.Stages.Query.GetStageToDelete
{

    public class GetStageToDeleteQuery : IRequest<StageToDeleteDto>
    {
        public int Id { get; set; }
    }

    public class GetStageToDeleteQueryHandler : IRequestHandler<GetStageToDeleteQuery, StageToDeleteDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetStageToDeleteQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<StageToDeleteDto> Handle(GetStageToDeleteQuery request, CancellationToken cancellationToken)
        {
            var stage = await _context.Stages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id);
            var entities = await _context.StageTests.Include(s => s.TestExecutions).ThenInclude(e => e.Taps)
                                                    .Include(s => s.Stage)
                                                    .Include(s => s.Test)
                                                    .Where(st => st.StageId == request.Id).ToListAsync();

            var orphanTests = await _context.StageTests.Include(x => x.Test).Where(x => x.Test.StageTests.Count() == 1).Where(x => x.StageId == request.Id).Select(x => x.Test).ToListAsync();

            var stCount = entities.Count();
            var eCount = entities.SelectMany(st => st.TestExecutions).Count();
            var tCount = entities.SelectMany(st => st.TestExecutions).SelectMany(te => te.Taps).Count();
            int oCount = orphanTests.Count();

            StageToDeleteDto responseDto = new StageToDeleteDto()
            {
                StageTestCount = stCount,
                ExecutionCount = eCount,
                TapCount = tCount,
                OrphanTestCount = oCount
            };

            if (stage != null)
            {
                responseDto.Id = stage.Id;
                responseDto.Name = stage.Name;
                responseDto.IsCurrent = stage.IsCurrent;
            }

            return responseDto;
        }
    }

}
