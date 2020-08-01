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

namespace TapLog.Application.Stages.Commands.DeleteStage
{

    public class DeleteStageCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteStageCommandHandler : IRequestHandler<DeleteStageCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeleteStageCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(DeleteStageCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Stages.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Stage), request.Id);
            }

            var orphanTests = await _context.StageTests.Include(x => x.Test).Where(x => x.Test.StageTests.Count() == 1).Where(x => x.StageId == request.Id).Select(x => x.Test).ToListAsync();

            _context.Stages.Remove(entity);
            _context.Tests.RemoveRange(orphanTests);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
