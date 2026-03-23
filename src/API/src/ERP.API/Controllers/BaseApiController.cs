using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        // You can put common methods here, e.g., 
        // standardized response handling, logging, etc.
    }
}
