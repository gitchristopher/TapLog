using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TapLog.Application.Common.Mappings;
using TapLog.Application.Passes.Query;
using TapLog.Application.Products.Query;
using TapLog.Application.Suppliers.Query;
using TapLog.Domain.Entities;

namespace TapLog.Application.Admin.Cards
{
    public class AdminCardVM
    {
        public IEnumerable<PassListItemDto> Passes { get; set; }
        public IEnumerable<ProductListItemDto> Products { get; set; }
        public IEnumerable<SupplierListItemDto> Suppliers { get; set; }
    }

    public class PassListItemDto : IMapFrom<Pass>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CardCount { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Pass, PassListItemDto>().ForMember(dest => dest.CardCount, options => options.MapFrom(source => source.Cards.Count()));
        }
    }

    public class ProductListItemDto : IMapFrom<Product>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CardCount { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Product, ProductListItemDto>().ForMember(dest => dest.CardCount, options => options.MapFrom(source => source.Cards.Count()));
        }
    }

    public class SupplierListItemDto : IMapFrom<Supplier>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CardCount { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Supplier, SupplierListItemDto>().ForMember(dest => dest.CardCount, options => options.MapFrom(source => source.Cards.Count()));
        }
    }
}