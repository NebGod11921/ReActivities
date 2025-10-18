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
    }
}
