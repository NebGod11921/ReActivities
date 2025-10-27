﻿using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    public class BasicApiController : ControllerBase
    {
        private IMediator? _mediator;
        //only derived from this class can access Mediator
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>() 
            ?? throw new Exception("IMediator service not found");
        
        protected ActionResult<T> HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }
            if (!result.IsSuccess && result.Code == 404)
            {
                return NotFound();
            }
            return BadRequest(result.Error);
        }
    }
}
