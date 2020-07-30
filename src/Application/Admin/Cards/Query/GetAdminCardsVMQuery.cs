using AutoMapper;
using AutoMapper.QueryableExtensions;
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

namespace TapLog.Application.Admin.Cards.Query
{

    public class GetAdminCardsVMQuery : IRequest<AdminCardVM>
    {
    }

    public class GetAdminCardsVMQueryHandler : IRequestHandler<GetAdminCardsVMQuery, AdminCardVM>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetAdminCardsVMQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AdminCardVM> Handle(GetAdminCardsVMQuery request, CancellationToken cancellationToken)
        {
            var response = new AdminCardVM
            {
                Passes = await _context.Passes.ProjectTo<PassListItemDto>(_mapper.ConfigurationProvider)
                .OrderBy(p => p.Name).ToListAsync(),
                Products = await _context.Products.ProjectTo<ProductListItemDto>(_mapper.ConfigurationProvider)
                .OrderBy(p => p.Name).ToListAsync(),
                Suppliers = await _context.Suppliers.ProjectTo<SupplierListItemDto>(_mapper.ConfigurationProvider)
                .OrderBy(p => p.Name).ToListAsync(),
            };

            return response;
        }
    }

}
