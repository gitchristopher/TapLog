using AutoMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using TapLog.Application.Common.Mappings;
using TapLog.Application.StageTests;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.Tests.Query
{
    public class TestDto : IMapFrom<Test>
    {
        public int Id { get; set; }
        public string JiraTestNumber { get; set; }

        public IEnumerable<StageTestDto> StageTests { get; set; }


        public class StageTestDto : IMapFrom<StageTest>
        {
            public string StageName { get; set; }
            public bool StageIsCurrent { get; set; }
            public int StageId { get; set; }
            public IEnumerable<TestExecutionDto> TestExecutions { get; set; }
        }

        public class TestExecutionDto : IMapFrom<TestExecution>
        {
            public int Id { get; set; }
            public IEnumerable<TapDto> Taps { get; set; }
        }

        public class TapDto : IMapFrom<Tap>
        {
            public int Id { get; set; }
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
            public DateTime TimeOf { get; set; }
            public decimal? Fare { get; set; }
            public decimal? BalanceBefore { get; set; }
            public decimal? BalanceAfter { get; set; }
            public string Notes { get; set; }
            public TapAction Action { get; set; }

            public void Mapping(Profile profile)
            {
                profile.CreateMap<Tap, TapDto>()
                    .ForMember(d => d.Result, opt => opt.MapFrom(s => (int)s.Result))
                    .ForMember(d => d.WasResultExpected, opt => opt.MapFrom(s => (int)s.WasResultExpected))
                    .ForMember(d => d.Action, opt => opt.MapFrom(s => (int)s.Action))
                    //.ForMember(d => d.Tester, opt => opt.MapFrom(s => s.CreatedBy))
                    .ForMember(d => d.TimeOf, opt => opt.MapFrom(s => s.TimeOf.ToLocalTime().ToString("s", CultureInfo.CreateSpecificCulture("en-AU"))));
            }
        }
    }

}
