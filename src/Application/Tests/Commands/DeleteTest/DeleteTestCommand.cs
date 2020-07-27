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

namespace TapLog.Application.Tests.Commands.DeleteTest
{

    public class DeleteTestCommand : IRequest
    {
        public int Id { get; set; }
        public int StageId { get; set; }
    }

    public class DeleteTestCommandHandler : IRequestHandler<DeleteTestCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeleteTestCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(DeleteTestCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.StageTests.Include(t => t.Test).Where(x => x.StageId == request.StageId).Where(x => x.TestId == request.Id).FirstOrDefaultAsync();

            if (entity == null)
            {
                throw new NotFoundException(nameof(Test), request.Id);
            }

            var orphanTests = await _context.StageTests.Include(x => x.Test).Where(x => x.Test.StageTests.Count() == 1).Where(x => x.StageId == request.StageId).Select(x => x.Test).ToListAsync();

            // Delete the entity
            _context.Tests.RemoveRange(orphanTests);
            _context.StageTests.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
