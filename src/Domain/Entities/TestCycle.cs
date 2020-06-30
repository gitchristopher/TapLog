using System;
using System.Collections.Generic;
using System.Text;

namespace TapLog.Domain.Entities
{
    public class TestCycle
    {
        public int TestId { get; set; }
        public int CycleId { get; set; }

        //Navigational properties
        public Test Test { get; set; }
        public Cycle Cycle { get; set; }
    }
}
