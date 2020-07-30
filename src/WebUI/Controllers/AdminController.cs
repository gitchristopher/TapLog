using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TapLog.Application.Admin.Cards;
using TapLog.Application.Admin.Cards.Query;

namespace TapLog.WebUI.Controllers
{
    [Authorize]
    public class AdminController : ApiController
    {
        [HttpGet("cards")]
        public async Task<ActionResult<AdminCardVM>> GetCardVM()
        {
            return await Mediator.Send(new GetAdminCardsVMQuery());
        }
    }
}
