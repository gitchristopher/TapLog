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
using TapLog.Application.Common.Helper;
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
        public int? PassId { get; set; }
        public int? ProductId { get; set; }
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
            var number = StringCleaner.CleanInput(request.Number).Trim();
            if (String.IsNullOrEmpty(number))
            {
                throw new NotFoundException("User input is bad.", request.Id);
            }
            // Retrieve the entity
            var entity = await _context.Cards.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Card), request.Id);
            }

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

            var alias = (request.Alias != null) ? StringCleaner.CleanInput(request.Alias).Trim() : null;

            // Update the entity
            entity.Number = number;
            entity.Alias = (String.IsNullOrEmpty(request.Alias)) ? null : alias;
            entity.SupplierId = request.SupplierId;
            entity.ProductId = request.ProductId ?? null;
            entity.PassId = request.PassId ?? null;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
