using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;

namespace TapLog.Domain.Entities
{
    public class Device : AuditableEntity
    {
        public Device()
        {
            Taps = new List<Tap>();
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        //Navigational properties
        public IEnumerable<Tap> Taps { get; set; }
    }
}
