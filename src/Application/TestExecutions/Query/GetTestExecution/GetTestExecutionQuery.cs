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

namespace TapLog.Application.TestExecutions.Query.GetTestExecution
{
    public class GetTestExecutionQuery : IRequest<TestExecutionDto>
    {
        public int Id { get; set; }
    }

    public class GetTestExecutionQueryHandler : IRequestHandler<GetTestExecutionQuery, TestExecutionDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetTestExecutionQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TestExecutionDto> Handle(GetTestExecutionQuery request, CancellationToken cancellationToken)
        {

            var response = await _context.TestExecutions
                                            .Include(te => te.Taps)
                                                .ThenInclude(t => t.Device)
                                            .Include(te => te.Taps)
                                                .ThenInclude(t => t.Card)
                                                    .ThenInclude(c => c.Supplier)
                                            .Include(te => te.StageTest)
                                                .ThenInclude(st => st.Stage)
                                            .Include(te => te.StageTest)
                                                .ThenInclude(st => st.Test)
                                            .FirstOrDefaultAsync(d => d.Id == request.Id);
            var responseDto = _mapper.Map<TestExecution, TestExecutionDto>(response);

            return responseDto;
        }
    }

}
