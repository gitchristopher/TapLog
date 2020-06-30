using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.Cards.Query;
using TapLog.Application.Cards.Commands.DeleteCard;
using TapLog.Application.Cards.Commands.UpdateCard;
using TapLog.Application.Cards.Commands.CreateCard;
using TapLog.Application.Cards.Query.GetCards;
using TapLog.Application.Cards.Query.GetCard;

namespace TapLog.WebUI.Controllers
{
    public class CardsController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<CardDto>>> Get()
        {
            return await Mediator.Send(new GetCardsQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardDto>> Get(int id)
        {
            return await Mediator.Send(new GetCardQuery { Id = id } );
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateCardCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateCardCommand command)
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
            await Mediator.Send(new DeleteCardCommand { Id = id });

            return NoContent();
        }

    }
}
