using System;
using System.Collections.Generic;
using System.Text;

namespace TapLog.Domain.Entities
{
    public class Cycle
    {
        public Cycle()
        {
            CycleStages = new List<CycleStage>();
            TestCycles = new List<TestCycle>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCurrent { get; set; }

        //Navigational properties
        public IEnumerable<CycleStage> CycleStages { get; set; }
        public IEnumerable<TestCycle> TestCycles { get; set; }
    }
}
