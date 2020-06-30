using System;
using System.Collections.Generic;
using System.Text;

namespace TapLog.Domain.Entities
{
    public class StageTest
    {
        public int StageId { get; set; }
        public int TestId { get; set; }

        //Navigation Properties
        public Stage Stage { get; set; }
        public Test Test { get; set; }
        public IEnumerable<TestExecution> TestExecutions { get; set; }
    }
}
