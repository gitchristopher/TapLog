using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;

namespace TapLog.Application.Suppliers.Query.GetSuppliers
{

    public class GetSuppliersQuery : IRequest<List<SupplierDto>>
    {
    }

    public partial class GetSuppliersQueryHandler : IRequestHandler<GetSuppliersQuery, List<SupplierDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetSuppliersQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<SupplierDto>> Handle(GetSuppliersQuery request, CancellationToken cancellationToken)
        {
            var entities = await _context.Suppliers.Include(s => s.Cards).ThenInclude(c => c.Taps).ThenInclude(t => t.Device).ToListAsync();
            var responseDto = _mapper.Map<List<Supplier>, List<SupplierDto>>(entities);

            //var response = new TapsDto
            //                {
            //    //PriorityLevels = Enum.GetValues(typeof(PriorityLevel))
            //    //    .Cast<PriorityLevel>()
            //    //    .Select(p => new PriorityLevelDto { Value = (int)p, Name = p.ToString() })
            //    //    .ToList(),

            //    //Lists = await _context.TodoLists
            //    //    .ProjectTo<TodoListDto>(_mapper.ConfigurationProvider)
            //    //    .OrderBy(t => t.Title)
            //    //    .ToListAsync(cancellationToken)
            //};

            return responseDto;
        }
    }

}
