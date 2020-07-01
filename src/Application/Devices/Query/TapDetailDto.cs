using AutoMapper;
using System;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Devices.Query
{
    public class TapDetailDto : IMapFrom<Tap>
    {
        public int Id { get; set; }
        public int TestExecutionId { get; set; }
        //public string TestJiraTestNumber { get; set; }
        public int CardId { get; set; }
        public string CardNumber { get; set; }
        public string CardAlias { get; set; }
        public string CardSupplierName { get; set; }
        public int DeviceId { get; set; }
        public string DeviceCode { get; set; }
        public string DeviceName { get; set; }
        public string TesterId { get; set; }
        public string CaseNumber { get; set; }
        public int Result { get; set; }
        public int WasResultExpected { get; set; }
        public DateTime TimeOf { get; set; }
        public decimal? Fare { get; set; }
        public decimal? BalanceBefore { get; set; }
        public decimal? BalanceAfter { get; set; }
        public string Notes { get; set; }


        public void Mapping(Profile profile)
        {
            profile.CreateMap<Tap, TapDetailDto>()
                .ForMember(d => d.Result, opt => opt.MapFrom(s => (int)s.Result))
                .ForMember(d => d.WasResultExpected, opt => opt.MapFrom(s => (int)s.WasResultExpected))
                .ForMember(d => d.TesterId, opt => opt.MapFrom(s => s.CreatedBy));
        }
    }
}
