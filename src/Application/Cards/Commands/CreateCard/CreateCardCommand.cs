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
namespace TapLog.Application.Cards.Commands.CreateCard
{

    public class CreateCardCommand : IRequest<int>
    {
        public string Number { get; set; }
        public string Alias { get; set; }
        public int SupplierId { get; set; }
        public int? ProductId { get; set; }
        public int? PassId { get; set; }
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
            var supplierEntity = await _context.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.Id == request.SupplierId);
            if (supplierEntity == null)
            {
                throw new NotFoundException(nameof(Product), request.ProductId);
            }

            Pass passEntity = null;
            if (request.PassId != null)
            {
                passEntity = await _context.Passes.AsNoTracking().FirstOrDefaultAsync(s => s.Id == request.PassId);
                if (passEntity == null)
                {
                    throw new NotFoundException(nameof(Pass), request.PassId);
                }
            }

            Product productEntity = null;
            if (request.ProductId != null)
            {
                productEntity = await _context.Products.AsNoTracking().FirstOrDefaultAsync(s => s.Id == request.ProductId);
                if (productEntity == null)
                {
                    throw new NotFoundException(nameof(Product), request.ProductId);
                }
            }


            //Map request to entity
            var entity = new Card
            {
                Number = request.Number,
                Alias = request.Alias,
                SupplierId = request.SupplierId,
                PassId = request?.PassId ?? null,
                ProductId = request?.ProductId ?? null
            };

            _context.Cards.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}
