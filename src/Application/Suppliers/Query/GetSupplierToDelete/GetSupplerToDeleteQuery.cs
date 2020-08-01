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

namespace TapLog.Application.Suppliers.Query.GetSupplierToDelete
{

    public class GetSupplierToDeleteQuery : IRequest<SupplierToDeleteDto>
    {
        public int Id { get; set; }
    }

    public class GetSupplierToDeleteQueryHandler : IRequestHandler<GetSupplierToDeleteQuery, SupplierToDeleteDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetSupplierToDeleteQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SupplierToDeleteDto> Handle(GetSupplierToDeleteQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Suppliers.Include(s => s.Cards).ThenInclude(c => c.Taps).FirstOrDefaultAsync(x => x.Id == request.Id);
            int cardCount = entity.Cards.Count();
            int tapCount = entity.Cards.SelectMany(x => x.Taps).ToList().Count();

            SupplierToDeleteDto responseDto = new SupplierToDeleteDto
            {
                Id = entity.Id,
                Name = entity.Name,
                CardCount = cardCount,
                TapCount = tapCount
            };

            return responseDto;
        }
    }

}
