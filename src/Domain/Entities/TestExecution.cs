using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;

namespace TapLog.Domain.Entities
{
    public class TestExecution : AuditableEntity
    {
        public int Id { get; set; }
        public int TestId { get; set; }
        public int StageId { get; set; }


        //Navigation Properties
        public StageTest StageTest { get; set; }
        //public Stage Stage { get; set; }
        //public Test Test { get; set; }
        public IEnumerable<Tap> Taps { get; set; }
    }
}
