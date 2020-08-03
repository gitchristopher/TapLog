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
            //var entity = await _context.StageTests.Include(t => t.Test).Where(x => x.StageId == request.StageId).Where(x => x.TestId == request.TestId).FirstOrDefaultAsync();

            // Get all the stagetests that realate to the test to be deleted
            // Select the single stagetest to be deleted
            // If it doesnt exist throw an error
            // Check to see if the list only has one entry and if it does get the test entity then delete it
            // If it doesnt, dont delete the test as it exists in other stages
            // Just delete the stagetest for the requested test.
            // this will cascade and delete the executions and taps for that stagetest.

            var entities = await _context.StageTests.Include(t => t.Test).Where(x => x.TestId == request.TestId).ToListAsync();
            if (entities.Count == 0)
            {
                throw new NotFoundException(nameof(Test), request.TestId);
            }

            var specificStageTest = entities.Where(x => x.StageId == request.StageId).FirstOrDefault();
            if (specificStageTest == null)
            {
                throw new NotFoundException(nameof(Stage), request.StageId);
            }

            if (entities.Count == 1)
            {
                var orphanTest = await _context.Tests.FindAsync(specificStageTest.TestId);
                _context.Tests.Remove(orphanTest);
            }

            // Delete the entity
            _context.StageTests.Remove(specificStageTest);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
