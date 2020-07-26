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

namespace TapLog.Application.Passes.Commands.CreatePass
{

    public class CreatePassCommand : IRequest<int>
    {
        // Properties
        public string Name { get; set; }
    }

    public class CreatePassCommandHandler : IRequestHandler<CreatePassCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreatePassCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreatePassCommand request, CancellationToken cancellationToken)
        {
            //Map request to entity
            var entity = new Pass
            {
                Name = request.Name
            };

            _context.Passes.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
