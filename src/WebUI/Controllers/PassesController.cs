using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.Passes.Query;
using TapLog.Application.Passes.Commands.DeletePass;
using TapLog.Application.Passes.Commands.UpdatePass;
using TapLog.Application.Passes.Commands.CreatePass;
using TapLog.Application.Passes.Query.GetPasses;
using TapLog.Application.Passes.Query.GetPass;

namespace TapLog.WebUI.Controllers
{
    //[Authorize]
    public class PassesController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<PassDto>>> Get()
        {
            return await Mediator.Send(new GetPassesQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PassDto>> Get(int id)
        {
            return await Mediator.Send(new GetPassQuery { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreatePassCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdatePassCommand command)
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
            await Mediator.Send(new DeletePassCommand { Id = id });

            return NoContent();
        }

    }
}