using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Application.Common.Mappings;
using TapLog.Application.Stages.Query;
using TapLog.Application.TestExecutions.Query;
using TapLog.Application.Tests.Query;
using TapLog.Domain.Entities;

namespace TapLog.Application.StageTests
{
    public class StageTestDto : IMapFrom<StageTest>
    {
        public int StageId { get; set; }
        public int TestId { get; set; }
        public string Name { get; set; }
        public bool IsCurrent { get; set; }

        public IEnumerable<TestExecutionDto> TestExecutions { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<StageTest, StageTestDto>()
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Stage.Name))
                .ForMember(d => d.IsCurrent, opt => opt.MapFrom(s => s.Stage.IsCurrent));
        }
    }
}
