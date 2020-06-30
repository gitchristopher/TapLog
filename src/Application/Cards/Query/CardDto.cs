using AutoMapper;
using System;
using System.Collections.Generic;
using TapLog.Application.Common.Mappings;
using TapLog.Application.Taps.Query;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Cards.Query
{
    public class CardDto : IMapFrom<Card>
    {

        public int Id { get; set; }
        public string Number { get; set; }
        public string Alias { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public IEnumerable<TapDto> Taps { get; set; }
    }
}
