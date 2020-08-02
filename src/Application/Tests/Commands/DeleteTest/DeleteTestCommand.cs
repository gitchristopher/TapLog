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
        public int TestId { get; set; }
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
            var entity = await _context.StageTests.Include(t => t.Test).Where(x => x.StageId == request.StageId).Where(x => x.TestId == request.TestId).FirstOrDefaultAsync();

            if (entity == null)
            {
                throw new NotFoundException(nameof(Test), request.TestId);
            }

            // Delete the entity
            _context.StageTests.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
