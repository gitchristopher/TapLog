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
namespace TapLog.Application.Cards.Commands.CreateCard
{

    public class CreateCardCommand : IRequest<int>
    {
        public string Number { get; set; }
        public string Alias { get; set; }
        public int SupplierId { get; set; }
    }

    public class CreateCardCommandHandler : IRequestHandler<CreateCardCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateCardCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateCardCommand request, CancellationToken cancellationToken)
        {
            //Map request to entity
            var entity = new Card
            {
                Number = request.Number,
                Alias = request.Alias,
                SupplierId = request.SupplierId
            };

            _context.Cards.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
