using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Taps.Query.GetTapsData
{

    public class GetTapsDataQuery : IRequest<TapDataVM>
    {
        public int? StageId { get; set; }
        public int? TestId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }

    public class GetTapsDataQueryHandler : IRequestHandler<GetTapsDataQuery, TapDataVM>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IIdentityService _identityService;

        public GetTapsDataQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
        {
            _context = context;
            _mapper = mapper;
            _identityService = identityService;
        }

        public async Task<TapDataVM> Handle(GetTapsDataQuery request, CancellationToken cancellationToken)
        {

            var query = _context.Taps
                                      .Include(t => t.Device)
                                      .Include(t => t.Card)
                                        .ThenInclude(c => c.Supplier)
                                      .Include(t => t.TestExecution)
                                        .ThenInclude(te => te.StageTest)
                                            .ThenInclude(st => st.Test)
                                      .Include(t => t.TestExecution)
                                        .ThenInclude(te => te.StageTest)
                                            .ThenInclude(st => st.Stage)
                                      .AsQueryable();

            if (request.StageId != null)
            {
                query = query.Where(t => t.TestExecution.StageTest.StageId == request.StageId);
            }
            if (request.TestId != null)
            {
                query = query.Where(t => t.TestExecution.StageTest.TestId == request.TestId);
            }
            if (!string.IsNullOrEmpty(request.StartDate))
            {
                var startDate = this.ConvertDate(request.StartDate);
                query = query.Where(t => t.TimeOf > startDate);
            }
            if (!string.IsNullOrEmpty(request.EndDate))
            {
                var endDate = this.ConvertDate(request.EndDate);
                endDate = endDate.AddDays(1);
                query = query.Where(t => t.TimeOf < endDate);
            }

            query = query.OrderBy(t => t.TimeOf);
            
            var entities = await query.ToListAsync();

            var responseDto = _mapper.Map<List<Tap>, List<TapDataRowDto>>(entities);

            var responseVM = new TapDataVM
            {
                TapDataRow = responseDto,
                TotalCount = responseDto.Count
            };

            return responseVM;
        }

        private DateTime ConvertDate(string date)
        {
            var styles = DateTimeStyles.AssumeUniversal;
            var parseWorked = DateTime.TryParse(date, System.Globalization.CultureInfo.InvariantCulture, styles, out DateTime startDate);
            if (!parseWorked)
            {
                // TODO Fix
                throw new NotFoundException("DateTime", date);
            }
            return startDate;
        }
        //private DateTime ConvertDateAlt(string date)
        //{
        //    var styles = DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeLocal;
        //    var parseWorked = DateTime.TryParse(date, System.Globalization.CultureInfo.InvariantCulture, styles, out DateTime startDate);
        //    if (!parseWorked)
        //    {
        //        // TODO Fix
        //        throw new NotFoundException("DateTime", date);
        //    }
        //    return startDate;
        //}
    }

}
