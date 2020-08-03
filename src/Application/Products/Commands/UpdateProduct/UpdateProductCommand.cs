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
using TapLog.Application.Common.Helper;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Products.Commands.UpdateProduct
{

    public class UpdateProductCommand : IRequest
    {
        // Properties
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateProductCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var name = StringCleaner.CleanInput(request.Name).Trim();
            if (String.IsNullOrEmpty(name))
            {
                throw new NotFoundException("User input is bad.", request.Id);
            }

            // Retrieve the entity
            var entity = await _context.Products.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Product), request.Id);
            }

            var tapsToUpdate = await _context.Taps.Where(x => x.Product == entity.Name).ToListAsync();
            foreach (var tap in tapsToUpdate)
            {
                tap.Product = name;
            }

            // Update the entity
            entity.Name= name;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
