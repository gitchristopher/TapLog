﻿using AutoMapper;
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

namespace TapLog.Application.TestExecutions.Commands.DeleteTestExecution
{

    public class DeleteTestExecutionCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteTestExecutionCommandHandler : IRequestHandler<DeleteTestExecutionCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeleteTestExecutionCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(DeleteTestExecutionCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.TestExecutions.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(TestExecution), request.Id);
            }

            // Delete the entity
            _context.TestExecutions.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
