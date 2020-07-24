using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.Tests.Query;
using TapLog.Application.Tests.Commands.DeleteTest;
using TapLog.Application.Tests.Commands.UpdateTest;
using TapLog.Application.Tests.Commands.CreateTest;
using TapLog.Application.Tests.Query.GetTests;
using TapLog.Application.Tests.Query.GetTest;
using TapLog.Application.Tests.Query.GetTestsForStage;

namespace TapLog.WebUI.Controllers
{
    [Authorize]
    public class TestsController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<TestDto>>> GetAll()
        {
            return await Mediator.Send(new GetTestsQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestDto>> GetDetailedTest([FromRoute] int id)
        {
            return await Mediator.Send(new GetTestQuery { Id = id } );
        }

        [HttpGet("stage/{stageId}")]
        public async Task<ActionResult<List<TestDto>>> GetTestsForStage([FromRoute] int stageId)
        {
            return await Mediator.Send(new GetTestsForStageQuery { StageId = stageId});
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateTestCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateTestCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await Mediator.Send(new DeleteTestCommand { Id = id });

            return NoContent();
        }

    }
}
