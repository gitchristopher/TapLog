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
using TapLog.Application.Suppliers.Query;
using TapLog.Application.Suppliers.Commands.DeleteSupplier;
using TapLog.Application.Suppliers.Commands.UpdateSupplier;
using TapLog.Application.Suppliers.Commands.CreateSupplier;
using TapLog.Application.Suppliers.Query.GetSuppliers;
using TapLog.Application.Suppliers.Query.GetSupplier;

namespace TapLog.WebUI.Controllers
{
    public class SuppliersController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<SupplierDto>>> Get()
        {
            return await Mediator.Send(new GetSuppliersQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierDto>> Get(int id)
        {
            return await Mediator.Send(new GetSupplierQuery { Id = id } );
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateSupplierCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateSupplierCommand command)
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
            await Mediator.Send(new DeleteSupplierCommand { Id = id });

            return NoContent();
        }

    }
}
