using AutoMapper;
using System;
using System.Collections.Generic;
using TapLog.Application.Common.Mappings;
using TapLog.Application.Taps.Query;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Devices.Query
{
    public class DeviceDto : IMapFrom<Device>
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        //public IEnumerable<TapDto> Taps { get; set; }
    }
}
