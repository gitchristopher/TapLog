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

namespace TapLog.Application.Passes.Commands.DeletePass
{

    public class DeletePassCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeletePassCommandHandler : IRequestHandler<DeletePassCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeletePassCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(DeletePassCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Passes.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Pass), request.Id);
            }

            // Delete the entity
            _context.Passes.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
