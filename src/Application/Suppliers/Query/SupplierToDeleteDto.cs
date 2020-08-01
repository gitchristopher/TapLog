using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;

namespace TapLog.Application.Suppliers.Query
{
    public class SupplierToDeleteDto : IMapFrom<Supplier>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CardCount { get; set; }
        public int TapCount { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Supplier, SupplierToDeleteDto>()
                .ForMember(destinationMember => destinationMember.CardCount, memberOptions => memberOptions.MapFrom(sourceMember => sourceMember.Cards.Count()));
        }
    }
}
