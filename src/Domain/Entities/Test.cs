using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;

namespace TapLog.Domain.Entities
{
    public class Test : AuditableEntity
    {
        public Test()
        {
            //Taps = new List<Tap>();
            StageTests = new List<StageTest>();
            //TestExecutions = new List<TestExecution>();
        }

        public int Id { get; set; }
        public string JiraTestNumber { get; set; }

        //Navigation
        //public IEnumerable<Tap> Taps { get; set; }
        public IEnumerable<StageTest> StageTests { get; set; }
        //public IEnumerable<TestExecution> TestExecutions { get; set; }
    }
}
