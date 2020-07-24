using AutoMapper;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace TapLog.Application.Tests.Query.GetCurrentTests
{

    public class GetCurrentTestsQuery : IRequest<List<TestDto>>
    {
    }

    public class GetCurrentTestsQueryHandler : IRequestHandler<GetCurrentTestsQuery, List<TestDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCurrentTestsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TestDto>> Handle(GetCurrentTestsQuery request, CancellationToken cancellationToken)
        {
            var testListDto = await _context.StageTests
                .Where(s => s.Stage.IsCurrent)
                .Include(s => s.Test)
                .Select(t => new TestDto 
                {
                    Id = t.TestId, 
                    JiraTestNumber = t.Test.JiraTestNumber, 
                    StageTests = null 
                })
                .ToListAsync();

            return testListDto;
        }
    }

}
