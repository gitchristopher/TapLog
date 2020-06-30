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
using TapLog.Application.Cards.Query;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Suppliers.Query.GetSupplier
{

    public class GetSupplierQuery : IRequest<SupplierDto>
    {
        public int Id { get; set; }
    }

    public class GetSupplierQueryHandler : IRequestHandler<GetSupplierQuery, SupplierDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetSupplierQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SupplierDto> Handle(GetSupplierQuery request, CancellationToken cancellationToken)
        {
            var response = await _context.Suppliers.Include(s => s.Cards).FirstOrDefaultAsync(s => s.Id == request.Id);
            var responseDto = _mapper.Map<SupplierDto>(response);

            return responseDto;
        }
    }

}
