﻿using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Application.Cards.Query;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;

namespace TapLog.Application.Passes.Query
{
    public class PassDto : IMapFrom<Pass>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<CardDto> Cards { get; set; }
    }
}
