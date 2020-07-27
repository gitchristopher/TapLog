using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Tests.Commands.UpdateTest
{

    public class UpdateTestCommand : IRequest
    {
        public int Id { get; set; }
        public string JiraTestNumber { get; set; }
    }

    public class UpdateTestCommandHandler : IRequestHandler<UpdateTestCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateTestCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateTestCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Tests.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Test), request.Id);
            }

            var jiraNumber = CleanInput(request.JiraTestNumber).Trim();
            
            var existingTest = await _context.Tests.FirstOrDefaultAsync(x => x.JiraTestNumber == jiraNumber);
            if (existingTest == null)
            {
                entity.JiraTestNumber = jiraNumber;
            }
            else
            {
                // TODO Fix the return statements 
                throw new NotFoundException(nameof(Test), request.Id);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
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
