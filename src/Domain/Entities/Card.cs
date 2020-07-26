using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;

namespace TapLog.Domain.Entities
{
    public class Card : AuditableEntity
    {
        public Card()
        {
            Taps = new List<Tap>();
        }

        public int Id { get; set; }
        public string Number { get; set; }
        public string Alias { get; set; }
        public int SupplierId { get; set; }
        public int? ProductId { get; set; }
        public int? PassId { get; set; }

        //Navigational properties
        public Supplier Supplier { get; set; }
        public IEnumerable<Tap> Taps { get; set; }
        public Product Product { get; set; }
        public Pass Pass { get; set; }
    }
}
