using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;

namespace TapLog.Application.Tests.Query.GetTests
{

    public class GetTestsQuery : IRequest<List<TestDto>>
    {
        public int? StageId { get; set; }
    }

    public partial class GetTestsQueryHandler : IRequestHandler<GetTestsQuery, List<TestDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetTestsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TestDto>> Handle(GetTestsQuery request, CancellationToken cancellationToken)
        {
            if (request.StageId != null)
            {
                var testListDto = await _context.StageTests.Where(x => x.StageId == request.StageId).Include(s => s.Test).Select(z => new TestDto{Id = z.TestId, JiraTestNumber = z.Test.JiraTestNumber }).ToListAsync();
                //var testListDto = _mapper.Map<List<Test>, List<TestDto>>(l);
                
                var list = await _context.Tests.Include(t => t.StageTests).ThenInclude(st => st.Stage).ToListAsync();
                var testList = list.SelectMany(x => x.StageTests).Where(x => x.StageId == request.StageId);
                
                var listDto = _mapper.Map<List<Test>, List<TestDto>>(list);

                return testListDto;
            }

            var entities = await _context.Tests
                                         .Include(t => t.StageTests)
                                            .ThenInclude(st => st.Stage)
                                         .Include(t => t.StageTests)
                                            .ThenInclude(st => st.TestExecutions)
                                                .ThenInclude(te => te.Taps)
                                                    .ThenInclude(t => t.Card)
                                                        .ThenInclude(c => c.Supplier)
                                         .Include(t => t.StageTests)
                                            .ThenInclude(st => st.TestExecutions)
                                                .ThenInclude(te => te.Taps)
                                                    .ThenInclude(t => t.Device)
                                         .ToListAsync();
            var responseDto = _mapper.Map<List<Test>, List<TestDto>>(entities);

            return responseDto;
        }
    }
}
