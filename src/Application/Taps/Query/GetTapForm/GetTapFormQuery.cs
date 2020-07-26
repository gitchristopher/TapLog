using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Cards.Query;
using TapLog.Application.Common.Interfaces;
using TapLog.Application.Devices.Query;
using TapLog.Application.Passes.Query;
using TapLog.Application.Products.Query;

namespace TapLog.Application.Taps.Query.GetTapForm
{

    public class GetTapFormQuery : IRequest<AddTapVM>
    {
    }

    public class GetTapFormQueryHandler : IRequestHandler<GetTapFormQuery, AddTapVM>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetTapFormQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AddTapVM> Handle(GetTapFormQuery request, CancellationToken cancellationToken)
        {
            var devices = await _context.Devices.ToListAsync();
            var cards = await _context.Cards
                                        .Include(x => x.Supplier)
                                        .Include(x => x.Pass)
                                        .Include(x => x.Product)
                                        .ToListAsync();

            var products = await _context.Products.ToListAsync();
            var passes = await _context.Passes.ToListAsync();

            var responseVM = new AddTapVM
            {
                Devices = _mapper.Map<List<DeviceDto>>(devices),
                Cards = _mapper.Map<List<CardDto>>(cards),
                Passes = _mapper.Map<List<PassDto>>(passes),
                Products = _mapper.Map<List<ProductDto>>(products)
            };

            return responseVM;
        }
    }

}
