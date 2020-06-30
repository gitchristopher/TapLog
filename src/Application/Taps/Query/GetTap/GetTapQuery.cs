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

namespace TapLog.Application.Taps.Query.GetTap
{

    public class GetTapQuery : IRequest<TapDto>
    {
        public int Id { get; set; }
    }

    public class GetTapQueryHandler : IRequestHandler<GetTapQuery, TapDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetTapQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TapDto> Handle(GetTapQuery request, CancellationToken cancellationToken)
        {
            var response = await _context.Taps.Include(t => t.Card).ThenInclude(c => c.Supplier)
                                                 .Include(t => t.Device)
                                                 .Include(t => t.TestExecution).ThenInclude(te => te.StageTest).ThenInclude(st => st.Test)
                                                 .FirstOrDefaultAsync(t => t.Id == request.Id);

            var responseDto = _mapper.Map<TapDto>(response);
            //    .Select(t => new TapDto
            //{
            //    Id = t.Id,
            //    TestExecutionId = t.TestExecutionId,
            //    TestJiraTestNumber = t.TestExecution.StageTest.Test.JiraTestNumber,
            //    CardId = t.CardId,
            //    CardNumber = t.Card.Number,
            //    CardAlias = t.Card.Alias,
            //    CardSupplierName = t.Card.Supplier.Name,
            //    DeviceId = t.DeviceId,
            //    DeviceCode = t.Device.Code,
            //    TesterId = t.TesterId,
            //    CaseNumber = t.CaseNumber,
            //    Result = (int)t.Result,
            //    WasResultExpected = (int)t.WasResultExpected,
            //    TimeOf = t.TimeOf,
            //    Fare = t.Fare,
            //    BalanceBefore = t.BalanceBefore,
            //    BalanceAfter = t.BalanceAfter,
            //    Notes = t.Notes,
            //}).FirstOrDefaultAsync(t => t.Id == request.Id);

            return responseDto;
        }
    }

}
