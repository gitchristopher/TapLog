using AutoMapper;
using FluentValidation;
using MediatR;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace TapLog.Application.Tests.Commands.CreateTest
{

    public class CreateTestCommand : IRequest<int>
    {
        public string JiraTestNumber { get; set; }
        public int StageId { get; set; }
    }

    public class CreateTestCommandHandler : IRequestHandler<CreateTestCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateTestCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateTestCommand request, CancellationToken cancellationToken)
        {
            var stage = await _context.Stages.FindAsync(request.StageId);
            if (stage == null)
            {
                return -1;
            }

            var newEntity = new StageTest
            {
                StageId = request.StageId
            };

            var jiraTestNumber = request.JiraTestNumber.Trim();
            
            var existingTest = await _context.StageTests.Where(x => x.Test.JiraTestNumber == jiraTestNumber).FirstOrDefaultAsync();
            
            if (existingTest != null)
            {
                if (existingTest.StageId == request.StageId)
                {
                    // Test already exists for the requested stage
                    return -1;
                }

                // Add the existing test to the requested stage
                newEntity.TestId = existingTest.TestId;

                _context.StageTests.Add(newEntity);
            }
            else
            {
                // Test doesnt exist so add it to the DB
                var entity = new Test
                {
                    JiraTestNumber = jiraTestNumber
                };
                _context.Tests.Add(entity);
                newEntity.TestId = entity.Id;
                _context.StageTests.Add(newEntity);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return newEntity.TestId;
        }
    }

}
