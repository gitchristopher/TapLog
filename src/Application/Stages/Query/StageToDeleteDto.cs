using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;

namespace TapLog.Application.Stages.Query
{
    public class StageToDeleteDto : IMapFrom<Stage>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCurrent { get; set; }
        public int StageTestCount { get; set; }
        public int OrphanTestCount { get; set; }
        public int ExecutionCount { get; set; }
        public int TapCount { get; set; }
    }
}
