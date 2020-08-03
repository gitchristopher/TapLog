using AutoMapper;
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
using TapLog.Application.Common.Helper;

namespace TapLog.Application.Taps.Commands.CreateTap
{

    public class CreateTapCommand : IRequest<int>
    {
        // Properties
        public int TestExecutionId { get; set; }
        public int CardId { get; set; }
        public int DeviceId { get; set; }
        public string Tester { get; set; }
        public string CaseNumber { get; set; }
        public Result Result { get; set; }
        public Expected WasResultExpected { get; set; }
        public string TimeOf { get; set; }
        public decimal? Fare { get; set; }
        public decimal? BalanceBefore { get; set; }
        public decimal? BalanceAfter { get; set; }
        public string Notes { get; set; }
        public TapAction Action { get; set; }
        public int? PassId { get; set; }
        public int? ProductId { get; set; }
    }

    public class CreateTapCommandHandler : IRequestHandler<CreateTapCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly IIdentityService _identityService;

        public CreateTapCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService, IIdentityService identityService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _identityService = identityService;
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
            var pass = await _context.Passes.FindAsync(request.PassId);
            //if (pass == null)
            //{
            //    throw new NotFoundException(nameof(Pass), request.PassId);
            //}
            var product = await _context.Products.FindAsync(request.ProductId);
            //if (product == null)
            //{
            //    throw new NotFoundException(nameof(Product), request.ProductId);
            //}


            var styles = DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeLocal;
            var parseWorked = DateTime.TryParse(request.TimeOf, System.Globalization.CultureInfo.InvariantCulture, styles, out DateTime dateTime);
            if (!parseWorked)
            {
                // TODO Fix
                throw new NotFoundException("DateTime", request.TimeOf);
            }
            var userId = _currentUserService.UserId;
            var user = await _identityService.GetUserNameAsync(userId);

            var userNotes = (request.Notes != null) ? StringCleaner.CleanInput(request.Notes).Trim() : null;

            var entity = new Tap
            {
                TestExecutionId = testExecution.Id,
                CardId = card.Id,
                DeviceId = device.Id,
                Tester = user,
                CaseNumber = request.CaseNumber,
                Result = request.Result,
                WasResultExpected = request.WasResultExpected,
                TimeOf = dateTime,
                Fare = request?.Fare,
                BalanceBefore = request?.BalanceBefore,
                BalanceAfter = request?.BalanceAfter,
                Notes = (String.IsNullOrEmpty(userNotes)) ? null : userNotes,
                Action = request.Action,
                Product = product?.Name,
                Pass = pass?.Name,
            };

            _context.Taps.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
