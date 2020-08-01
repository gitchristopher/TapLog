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

namespace TapLog.Application.Passes.Commands.UpdatePass
{

    public class UpdatePassCommand : IRequest
    {
        // Properties
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdatePassCommandHandler : IRequestHandler<UpdatePassCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdatePassCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdatePassCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Passes.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Pass), request.Id);
            }

            var tapsToUpdate = await _context.Taps.Where(x => x.Pass == entity.Name).ToListAsync();
            foreach (var tap in tapsToUpdate)
            {
                tap.Pass = request.Name;
            }

            // Update the entity
            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
