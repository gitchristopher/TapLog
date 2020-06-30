using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.Stages.Query;
using TapLog.Application.Stages.Commands.DeleteStage;
using TapLog.Application.Stages.Commands.UpdateStage;
using TapLog.Application.Stages.Commands.CreateStage;
using TapLog.Application.Stages.Query.GetStages;
using TapLog.Application.Stages.Query.GetStage;

namespace TapLog.WebUI.Controllers
{
    public class StagesController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<StageDto>>> Get()
        {
            return await Mediator.Send(new GetStagesQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StageDto>> Get(int id)
        {
            return await Mediator.Send(new GetStageQuery { Id = id } );
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateStageCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateStageCommand command)
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
            await Mediator.Send(new DeleteStageCommand { Id = id });

            return NoContent();
        }

    }
}
