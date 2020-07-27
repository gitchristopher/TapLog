using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;
namespace TapLog.Application.Stages.Commands.CreateStage
{

    public class CreateStageCommand : IRequest<int>
    {
        public string Name { get; set; }
        public bool IsCurrent { get; set; }
    }

    public class CreateStageCommandHandler : IRequestHandler<CreateStageCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateStageCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateStageCommand request, CancellationToken cancellationToken)
        {
            //Map request to entity
            var entity = new Stage
            {
                Name = request.Name,
                IsCurrent = request.IsCurrent
            };

            if (request.IsCurrent)
            {
                var current = await _context.Stages.FirstOrDefaultAsync(x => x.IsCurrent == true);
                if (current != null)
                {
                    current.IsCurrent = false;
                }
            }

            _context.Stages.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
