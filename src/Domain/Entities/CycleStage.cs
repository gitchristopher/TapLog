using System;
using System.Collections.Generic;
using System.Text;

namespace TapLog.Domain.Entities
{
    public class CycleStage
    {
        public int CycleId { get; set; }
        public int StageId { get; set; }

        //Navigational properties
        public Cycle Cycle { get; set; }
        public Stage Stage { get; set; }
    }
}
