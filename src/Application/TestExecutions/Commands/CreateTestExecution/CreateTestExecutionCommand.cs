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
namespace TapLog.Application.TestExecutions.Commands.CreateTestExecution
{

    public class CreateTestExecutionCommand : IRequest<int>
    {
        public int TestId { get; set; }
        public int StageId { get; set; }
    }

    public class CreateTestExecutionCommandHandler : IRequestHandler<CreateTestExecutionCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateTestExecutionCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateTestExecutionCommand request, CancellationToken cancellationToken)
        {
            var ste = await _context.StageTests.Where(st => st.TestId == request.TestId && st.StageId == request.StageId).FirstOrDefaultAsync();


            //Map request to entity
            var entity = new TestExecution
            {
                //TestId = request.TestId,
                //StageId = request.StageId,
            };


            if (ste != null)
            {
                ste.TestExecutions = new List<TestExecution>() { entity };
            }
            else
            {
                var test = await _context.Tests.FindAsync(request.TestId);
                if (test == null)
                {
                    throw new NotFoundException(nameof(test), request.TestId);
                }

                var stage = await _context.Stages.FindAsync(request.StageId);
                if (stage == null)
                {
                    throw new NotFoundException(nameof(stage), request.StageId);
                }

                var stageTestEntity = new StageTest
                {
                    TestId = request.TestId,
                    StageId = request.StageId,
                    TestExecutions = new List<TestExecution>() { entity }
                };

                _context.StageTests.Add(stageTestEntity);
            }

            //_context.TestExecutions.Add(entity);
            //_context.StageTests.Add(stageTestEntity);


            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
