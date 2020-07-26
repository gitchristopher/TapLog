using AutoMapper;
using System;
using System.Globalization;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Taps.Query
{
    public class TapDto : IMapFrom<Tap>
    {
        public int Id { get; set; }
        public int TestExecutionId { get; set; }
        public string TestJiraTestNumber { get; set; }
        public int CardId { get; set; }
        public string CardNumber { get; set; }
        public string CardAlias { get; set; }
        public string CardSupplierName { get; set; }
        public int DeviceId { get; set; }
        public string DeviceCode { get; set; }
        public string DeviceName { get; set; }
        public string Tester { get; set; }
        public string CaseNumber { get; set; }
        public int Result { get; set; }
        public int WasResultExpected { get; set; }
        public string TimeOf { get; set; }
        public decimal? Fare { get; set; }
        public decimal? BalanceBefore { get; set; }
        public decimal? BalanceAfter { get; set; }
        public string Notes { get; set; }
        public TapAction Action { get; set; }
        public string Pass { get; set; }
        public string Product { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Tap, TapDto>()
                .ForMember(d => d.Result, opt => opt.MapFrom(s => (int)s.Result))
                .ForMember(d => d.WasResultExpected, opt => opt.MapFrom(s => (int)s.WasResultExpected))
                .ForMember(d => d.Action, opt => opt.MapFrom(s => (int)s.Action))
                //.ForMember(d => d.Tester, opt => opt.MapFrom(s => s.Tester))
                .ForMember(d => d.TimeOf, opt => opt.MapFrom(s => s.TimeOf.ToLocalTime().ToString("s", CultureInfo.CreateSpecificCulture("en-AU"))));
        }
    }
}
