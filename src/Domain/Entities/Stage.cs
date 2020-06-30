using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;

namespace TapLog.Domain.Entities
{
    public class Stage : AuditableEntity
    {
        public Stage()
        {
            StageTests = new List<StageTest>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCurrent { get; set; }

        //Navigational properties
        public IEnumerable<StageTest> StageTests { get; set; }
    }
}
