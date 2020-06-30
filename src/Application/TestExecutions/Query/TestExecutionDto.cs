using AutoMapper;
using System;
using System.Collections.Generic;
using TapLog.Application.Common.Mappings;
using TapLog.Application.Stages.Query;
using TapLog.Application.StageTests;
using TapLog.Application.Taps.Query;
using TapLog.Application.Tests.Query;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;

namespace TapLog.Application.TestExecutions.Query
{
    public class TestExecutionDto : IMapFrom<TestExecution>
    {
        public int Id { get; set; }
        public StageTestDto StageTest { get; set; }
        public IEnumerable<TapDto> Taps { get; set; }
        
        public class StageTestDto : IMapFrom<StageTest>
        {
            public int StageId { get; set; }
            public int TestId { get; set; }
            public string JiraTestNumber { get; set; }
            public string StageName { get; set; }
            public bool IsCurrentStage { get; set; }

            public void Mapping(Profile profile)
            {
                profile.CreateMap<StageTest, StageTestDto>()
                    .ForMember(d => d.StageName, opt => opt.MapFrom(s => s.Stage.Name))
                    .ForMember(d => d.IsCurrentStage, opt => opt.MapFrom(s => s.Stage.IsCurrent))
                    .ForMember(d => d.JiraTestNumber, opt => opt.MapFrom(s => s.Test.JiraTestNumber));
            }
        }
    }
}
