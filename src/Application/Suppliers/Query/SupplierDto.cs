using AutoMapper;
using System;
using System.Collections.Generic;
using TapLog.Application.Cards.Query;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Suppliers.Query
{
    public class SupplierDto : IMapFrom<Supplier>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<CardDto> Cards { get; set; }
    }
}
