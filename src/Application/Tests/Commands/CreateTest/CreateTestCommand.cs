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
using System.Text.RegularExpressions;
using System;

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
                throw new NotFoundException(nameof(Stage), request.StageId);
            }

            var newEntity = new StageTest
            {
                Stage = stage
            };

            var jiraNumber = CleanInput(request.JiraTestNumber).Trim();

            //var existingTest = await _context.StageTests.Include(st => st.Test).Include(st => st.Stage).Where(x => x.Test.JiraTestNumber == jiraNumber).FirstOrDefaultAsync();
            var existingTest = await _context.Tests.Include(t => t.StageTests).Where(x => x.JiraTestNumber == jiraNumber).FirstOrDefaultAsync();
            if (existingTest != null)
            {
                if (existingTest.StageTests.Where(x => x.StageId == request.StageId).FirstOrDefault() != null)
                {
                    // Test already exists for the requested stage
                    return -1;
                }

                // Add the existing test to the requested stage
                newEntity.Test = existingTest;
            }
            else
            {
                // Test doesnt exist so add it to the DB
                newEntity.Test = new Test { JiraTestNumber = jiraNumber };
            }

            _context.StageTests.Add(newEntity);
            await _context.SaveChangesAsync(cancellationToken);

            return newEntity.TestId;
        }
        private static string CleanInput(string strIn)
        {
            // Replace invalid characters with empty strings.
            try
            {
                return Regex.Replace(strIn, @"[^\w\s\.@-]", "",
                                     RegexOptions.None, TimeSpan.FromSeconds(1.5));
            }
            // If we timeout when replacing invalid characters,
            // we should return Empty.
            catch (RegexMatchTimeoutException)
            {
                return String.Empty;
            }
        }
    }

}
