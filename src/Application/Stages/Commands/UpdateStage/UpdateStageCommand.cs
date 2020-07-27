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

namespace TapLog.Application.Stages.Commands.UpdateStage
{

    public class UpdateStageCommand : IRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCurrent { get; set; }
    }

    public class UpdateStageCommandHandler : IRequestHandler<UpdateStageCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateStageCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateStageCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Stages.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Stage), request.Id);
            }

            if (request.IsCurrent && entity.IsCurrent != true)
            {
                var current = await _context.Stages.FirstOrDefaultAsync(x => x.IsCurrent == true);
                if (current != null)
                {
                    current.IsCurrent = false;
                }
            }

            // Update the entity
            entity.Name = request.Name;
            entity.IsCurrent = request.IsCurrent;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
