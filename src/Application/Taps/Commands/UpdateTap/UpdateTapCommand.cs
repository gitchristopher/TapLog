using AutoMapper;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Taps.Commands.UpdateTap
{

    public class UpdateTapCommand : IRequest
    {
        // Properties
        public int Id { get; set; }
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

    public class UpdateTapCommandHandler : IRequestHandler<UpdateTapCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateTapCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateTapCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Taps.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Tap), request.Id);
            }

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

            // Update the entity
            entity.TestExecutionId = request.TestExecutionId;
            entity.CardId = request.CardId;
            entity.DeviceId = request.DeviceId;
            //entity.TesterId = request.TesterId;
            entity.CaseNumber = request.CaseNumber;
            entity.Result = request.Result;
            entity.WasResultExpected = request.WasResultExpected;
            entity.TimeOf = dateTime;
            entity.Fare = request?.Fare;
            entity.BalanceBefore = request?.BalanceBefore;
            entity.BalanceAfter = request?.BalanceAfter;
            entity.Notes = request.Notes;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
