using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;

namespace TapLog.Domain.Entities
{
    public class Product : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public IEnumerable<Card> Cards { get; set; }
    }
}
