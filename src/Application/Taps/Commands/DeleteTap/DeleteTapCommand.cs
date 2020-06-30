using AutoMapper;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Taps.Commands.DeleteTap
{

    public class DeleteTapCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteTapCommandHandler : IRequestHandler<DeleteTapCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeleteTapCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(DeleteTapCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Taps.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Tap), request.Id);
            }

            // Delete the entity
            _context.Taps.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
