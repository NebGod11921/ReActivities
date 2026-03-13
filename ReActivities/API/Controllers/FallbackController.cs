using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public FallbackController(IWebHostEnvironment env)
        {
            _env = env;
        }

        public IActionResult Index()
        {
            var webRootPath = _env.WebRootPath
                ?? Path.Combine(_env.ContentRootPath, "wwwroot");


            return PhysicalFile(
                Path.Combine(webRootPath, "index.html"),
                "text/HTML");
        }
    }
}
