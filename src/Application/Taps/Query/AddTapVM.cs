using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Application.Cards.Query;
using TapLog.Application.Devices.Query;
using TapLog.Application.Passes.Query;
using TapLog.Application.Products.Query;

namespace TapLog.Application.Taps.Query
{
    public class AddTapVM
    {
        public List<DeviceDto> Devices { get; set; }
        public List<CardDto> Cards { get; set; }
        public List<PassDto> Passes { get; set; }
        public List<ProductDto> Products { get; set; }

    }
}
