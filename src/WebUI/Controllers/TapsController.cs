using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.Taps.Query;
using TapLog.Application.Taps.Query.GetTaps;
using TapLog.Application.Taps.Query.GetTap;
using TapLog.Application.Taps.Commands.CreateTap;
using TapLog.Application.Taps.Commands.UpdateTap;
using TapLog.Application.Taps.Commands.DeleteTap;
using TapLog.Application.Taps.Query.GetTapForm;
using TapLog.Application.Taps.Query.GetTapsData;

namespace TapLog.WebUI.Controllers
{
    [Authorize]
    public class TapsController : ApiController
    {
        [HttpGet("addtapform")]
        public async Task<ActionResult<AddTapVM>> GetTapForm()
        {
            return await Mediator.Send(new GetTapFormQuery());
        }

        [HttpGet]
        public async Task<ActionResult<List<TapDto>>> Get()
        {
            return await Mediator.Send(new GetTapsQuery());
        }

        [HttpGet("data")]
        public async Task<ActionResult<TapDataVM>> Get([FromQuery] int? StageId, [FromQuery] int? TestId, [FromQuery] string StartDate = "", [FromQuery] string EndDate = "")
        {
            return await Mediator.Send(new GetTapsDataQuery { StageId = StageId, TestId = TestId, StartDate = StartDate, EndDate = EndDate });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TapDto>> Get(int id)
        {
            return await Mediator.Send(new GetTapQuery { Id = id} );
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateTapCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateTapCommand command)
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
            await Mediator.Send(new DeleteTapCommand { Id = id });

            return NoContent();
        }

    }
}
