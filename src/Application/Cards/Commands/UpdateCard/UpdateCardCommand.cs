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

namespace TapLog.Application.Cards.Commands.UpdateCard
{

    public class UpdateCardCommand : IRequest
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string Alias { get; set; }
        public int SupplierId { get; set; }
    }

    public class UpdateCardCommandHandler : IRequestHandler<UpdateCardCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateCardCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateCardCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the entity
            var entity = await _context.Cards.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Card), request.Id);
            }

            // Update the entity
            entity.Number = request.Number;
            entity.Alias = request.Alias;
            entity.SupplierId = request.SupplierId;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
