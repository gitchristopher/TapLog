using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;

namespace TapLog.Application.Cards.Query
{
    public class CardToDeleteDto : IMapFrom<Card>
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string Alias { get; set; }
        public string SupplierName { get; set; }
        public int TapCount { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Card, CardToDeleteDto>()
                .ForMember(dest => dest.TapCount, options => options.MapFrom(source => source.Taps.Count()));
        }
    }
}
