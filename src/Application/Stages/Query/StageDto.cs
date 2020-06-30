using AutoMapper;
using System;
using System.Collections.Generic;
using TapLog.Application.Common.Mappings;
using TapLog.Application.StageTests;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Stages.Query
{
    public class StageDto : IMapFrom<Stage>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCurrent { get; set; }
        public IEnumerable<StageTestDto> StageTests { get; set; }
    }
}
