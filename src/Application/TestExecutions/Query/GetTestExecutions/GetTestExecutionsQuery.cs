using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;

namespace TapLog.Application.TestExecutions.Query.GetTestExecutions
{

    public class GetTestExecutionsQuery : IRequest<List<TestExecutionDto>>
    {
        public int? TestId { get; set; }
        public int? StageId { get; set; }
    }

    public partial class GetTestExecutionsQueryHandler : IRequestHandler<GetTestExecutionsQuery, List<TestExecutionDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetTestExecutionsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TestExecutionDto>> Handle(GetTestExecutionsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.TestExecutions
                                            .Include(te => te.Taps)
                                                .ThenInclude(t => t.Device)
                                            .Include(te => te.Taps)
                                                .ThenInclude(t => t.Card)
                                                    .ThenInclude(c => c.Supplier)
                                            .Include(te => te.StageTest)
                                                .ThenInclude(st => st.Stage)
                                            .Include(te => te.StageTest)
                                                .ThenInclude(st => st.Test)
                                            .AsQueryable();

            if (request.StageId != null && request.TestId != null)
            {
                query = query.Where(x => x.TestId == request.TestId && x.StageId == request.StageId);
            }

            var entities = await query.ToListAsync();

            var responseDto = _mapper.Map<List<TestExecution>, List<TestExecutionDto>>(entities);

            return responseDto;
        }
    }

}
