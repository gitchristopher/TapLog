using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TapLog.Application.Admin.Cards;
using TapLog.Application.Admin.Cards.Query;
using TapLog.Application.Cards.Query;
using TapLog.Application.Cards.Query.GetCardToDelete;
using TapLog.Application.Devices.Query;
using TapLog.Application.Devices.Query.GetDeviceToDelete;
using TapLog.Application.Stages.Query;
using TapLog.Application.Stages.Query.GetStageToDelete;
using TapLog.Application.Suppliers.Query;
using TapLog.Application.Suppliers.Query.GetSupplierToDelete;

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

        [HttpGet("card/delete/{id}")]
        public async Task<ActionResult<CardToDeleteDto>> GetCardDelete([FromRoute] int id)
        {
            return await Mediator.Send(new GetCardToDeleteQuery { Id = id});
        }

        [HttpGet("device/delete/{id}")]
        public async Task<ActionResult<DeviceToDeleteDto>> GetDeviceDelete([FromRoute] int id)
        {
            return await Mediator.Send(new GetDeviceToDeleteQuery { Id = id });
        }

        [HttpGet("stage/delete/{id}")]
        public async Task<ActionResult<StageToDeleteDto>> GetStageDelete([FromRoute] int id)
        {
            return await Mediator.Send(new GetStageToDeleteQuery { Id = id });
        }

        [HttpGet("supplier/delete/{id}")]
        public async Task<ActionResult<SupplierToDeleteDto>> GetSupplierDelete([FromRoute] int id)
        {
            return await Mediator.Send(new GetSupplierToDeleteQuery { Id = id });
        }
    }
}
