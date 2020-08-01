using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;

namespace TapLog.Application.Devices.Query
{
    public class DeviceToDeleteDto : IMapFrom<Device>
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int TapCount { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Device, DeviceToDeleteDto>()
                .ForMember(d => d.TapCount, opt => opt.MapFrom(source => source.Taps.Count()));
        }
    }
}