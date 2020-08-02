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

namespace TapLog.Application.TestExecutions.Commands.UpdateTestExecution
{

    public class UpdateTestExecutionCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class UpdateTestExecutionCommandHandler : IRequestHandler<UpdateTestExecutionCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateTestExecutionCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateTestExecutionCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.TestExecutions.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(TestExecution), request.Id);
            }

            // Update the entity
            //entity.Code = request.Code;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
