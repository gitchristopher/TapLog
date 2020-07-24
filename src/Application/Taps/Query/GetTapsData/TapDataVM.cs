using AutoMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using TapLog.Application.Common.Mappings;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Taps.Query.GetTapsData
{
    public class TapDataVM
    {
        public IEnumerable<TapDataRowDto> TapDataRow { get; set; }
        public int TotalCount { get; set; }
    }

    public class TapDataRowDto : IMapFrom<Tap>
    {
        public int Id { get; set; }
        public int TestExecutionId { get; set; }
        public int TestId { get; set; }
        public string Jira { get; set; }
        public string Stage { get; set; }
        public bool IsCurrentStage { get; set; }
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

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Tap, TapDataRowDto>()
                .ForMember(d => d.Result, opt => opt.MapFrom(s => (int)s.Result))
                .ForMember(d => d.WasResultExpected, opt => opt.MapFrom(s => (int)s.WasResultExpected))
                .ForMember(d => d.Action, opt => opt.MapFrom(s => (int)s.Action))
                .ForMember(d => d.Stage, opt => opt.MapFrom(s => s.TestExecution.StageTest.Stage.Name))
                .ForMember(d => d.IsCurrentStage, opt => opt.MapFrom(s => s.TestExecution.StageTest.Stage.IsCurrent))
                .ForMember(d => d.TestId, opt => opt.MapFrom(s => s.TestExecution.StageTest.Test.Id))
                .ForMember(d => d.Jira, opt => opt.MapFrom(s => s.TestExecution.StageTest.Test.JiraTestNumber))
                .ForMember(d => d.TimeOf, opt => opt.MapFrom(s => s.TimeOf.ToLocalTime().ToString("s", CultureInfo.CreateSpecificCulture("en-AU"))));
        }
    }
}
