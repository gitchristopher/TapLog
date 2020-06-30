using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.Devices.Query;
using TapLog.Application.Devices.Commands.DeleteDevice;
using TapLog.Application.Devices.Commands.UpdateDevice;
using TapLog.Application.Devices.Commands.CreateDevice;
using TapLog.Application.Devices.Query.GetDevices;
using TapLog.Application.Devices.Query.GetDevice;

namespace TapLog.WebUI.Controllers
{
    public class DevicesController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<DeviceDto>>> Get()
        {
            return await Mediator.Send(new GetDevicesQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DeviceDetailDto>> Get(int id)
        {
            return await Mediator.Send(new GetDeviceQuery { Id = id } );
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateDeviceCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateDeviceCommand command)
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
            await Mediator.Send(new DeleteDeviceCommand { Id = id });

            return NoContent();
        }

    }
}
