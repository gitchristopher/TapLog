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

namespace TapLog.Application.Tests.Query.GetTest
{
    public class GetTestQuery : IRequest<TestDto>
    {
        public int Id { get; set; }
    }

    public class GetTestQueryHandler : IRequestHandler<GetTestQuery, TestDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetTestQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TestDto> Handle(GetTestQuery request, CancellationToken cancellationToken)
        {
            var response = await _context.Tests
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
                                          //.Include(t => t.StageTests)
                                          //   .ThenInclude(st => st.TestExecutions)
                                          //       .ThenInclude(te => te.Taps)
                                          //           .ThenInclude(t => t.Card)
                                          //              .ThenInclude(t => t.Product)
                                          //.Include(t => t.StageTests)
                                          //   .ThenInclude(st => st.TestExecutions)
                                          //       .ThenInclude(te => te.Taps)
                                          //           .ThenInclude(t => t.Card)
                                          //              .ThenInclude(t => t.Pass)
                                          .FirstOrDefaultAsync(d => d.Id == request.Id);
            var responseDto2 = _mapper.Map<Test, TestDto>(response);

            return responseDto2;
        }
    }

}
