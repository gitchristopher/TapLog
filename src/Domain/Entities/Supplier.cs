using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;

namespace TapLog.Domain.Entities
{
    public class Supplier
    {
        public Supplier()
        {
            Cards = new List<Card>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        //Navigational properties
        public IEnumerable<Card> Cards { get; set; }
    }
}
