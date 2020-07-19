using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.TestExecutions.Query;
using TapLog.Application.TestExecutions.Query.GetTestExecutions;
using TapLog.Application.TestExecutions.Query.GetTestExecution;
using TapLog.Application.TestExecutions.Commands.CreateTestExecution;
using TapLog.Application.TestExecutions.Commands.UpdateTestExecution;
using TapLog.Application.TestExecutions.Commands.DeleteTestExecution;

namespace TapLog.WebUI.Controllers
{
    [Authorize]
    public class TestExecutionsController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<TestExecutionDto>>> Get([FromQuery] int? testId, [FromQuery] int? stageId)
        {
            return await Mediator.Send(new GetTestExecutionsQuery { TestId = testId, StageId = stageId });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestExecutionDto>> Get(int id)
        {
            return await Mediator.Send(new GetTestExecutionQuery { Id = id} );
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateTestExecutionCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateTestExecutionCommand command)
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
            await Mediator.Send(new DeleteTestExecutionCommand { Id = id });

            return NoContent();
        }

    }
}
