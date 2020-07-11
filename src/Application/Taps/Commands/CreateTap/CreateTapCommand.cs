﻿using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;
//using TapLog.Application.Common.Interfaces;
using System.Globalization;

namespace TapLog.Application.Taps.Commands.CreateTap
{

    public class CreateTapCommand : IRequest<int>
    {
        // Properties
        public int TestExecutionId { get; set; }
        public int CardId { get; set; }
        public int DeviceId { get; set; }
        public string TesterId { get; set; }
        public string CaseNumber { get; set; }
        public Result Result { get; set; }
        public Expected WasResultExpected { get; set; }
        public string TimeOf { get; set; }
        public decimal? Fare { get; set; }
        public decimal? BalanceBefore { get; set; }
        public decimal? BalanceAfter { get; set; }
        public string Notes { get; set; }
    }

    public class CreateTapCommandHandler : IRequestHandler<CreateTapCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public CreateTapCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<int> Handle(CreateTapCommand request, CancellationToken cancellationToken)
        {
            //Map request to entity
            var testExecution = await _context.TestExecutions.FindAsync(request.TestExecutionId);
            if (testExecution == null)
            {
                throw new NotFoundException(nameof(TestExecution), request.TestExecutionId);
            }
            var card = await _context.Cards.FindAsync(request.CardId);
            if (card == null)
            {
                throw new NotFoundException(nameof(Card), request.CardId);
            }
            var device = await _context.Devices.FindAsync(request.DeviceId);
            if (device == null)
            {
                throw new NotFoundException(nameof(Device), request.DeviceId);
            }
            var styles = DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeLocal;
            var parseWorked = DateTime.TryParse(request.TimeOf, System.Globalization.CultureInfo.InvariantCulture, styles, out DateTime dateTime);
            if (!parseWorked)
            {
                // TODO Fix
                throw new NotFoundException("DateTime", request.TimeOf);
            }
            //DateTime w = new DateTime();
            //DateTime x = new DateTime();
            //string y;
            //string z;
            //try
            //{
            //    w = DateTime.Parse(request.TimeOf, System.Globalization.CultureInfo.InvariantCulture);
            //    x = DateTime.Parse(request.TimeOf);

            //    y = DateTime.UtcNow.ToString("s", System.Globalization.CultureInfo.InvariantCulture);
            //    z = DateTime.Now.ToString("s", System.Globalization.CultureInfo.InvariantCulture);
            //}
            //catch (Exception e)
            //{

            //    throw e;
            //}

            //var userId = _currentUserService.UserId ?? string.Empty;

            var entity = new Tap
            {
                TestExecutionId = request.TestExecutionId,
                CardId = request.CardId,
                DeviceId = request.DeviceId,
                //TesterId = userId,
                CaseNumber = request.CaseNumber,
                Result = request.Result,
                WasResultExpected = request.WasResultExpected,
                TimeOf = dateTime,
                Fare = request?.Fare,
                BalanceBefore = request?.BalanceBefore,
                BalanceAfter = request?.BalanceAfter,
                Notes = request.Notes,
            };

            _context.Taps.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
