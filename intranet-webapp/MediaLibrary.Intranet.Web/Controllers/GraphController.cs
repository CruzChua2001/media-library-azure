using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Models;
using MediaLibrary.Intranet.Web.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Newtonsoft.Json;

namespace MediaLibrary.Intranet.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraphController : ControllerBase
    {
        private readonly GraphService _graphService;
        public GraphController(GraphService graphService)
        {
            _graphService = graphService;
        }

        //Batching
        [HttpGet("/api/Account/{email}", Name = nameof(GetDisplayName))]
        public async Task<IActionResult> GetDisplayName(string email)
        {
            List<UserInfo> userInfo = await _graphService.GetUserInfo(email);

            return Ok(userInfo);
        }
    }
}
