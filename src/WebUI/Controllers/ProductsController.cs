using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TapLog.Application.Products.Commands.DeleteProduct;
using TapLog.Application.Products.Commands.UpdateProduct;
using TapLog.Application.Products.Commands.CreateProduct;
using TapLog.Application.Products.Query.GetProducts;
using TapLog.Application.Products.Query.GetProduct;
using TapLog.Application.Products.Query;

namespace TapLog.WebUI.Controllers
{
    //[Authorize]
    public class ProductsController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> Get()
        {
            return await Mediator.Send(new GetProductsQuery());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> Get(int id)
        {
            return await Mediator.Send(new GetProductQuery { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateProductCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UpdateProductCommand command)
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
            await Mediator.Send(new DeleteProductCommand { Id = id });

            return NoContent();
        }

    }
}