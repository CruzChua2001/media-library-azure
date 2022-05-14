using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MediaLibrary.Intranet.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardWebApiController : ControllerBase
    {
        private readonly PlanningAreaService _planningAreaService;
        private readonly DashboardActivityService _dashboardActivityService;
        private readonly FileDetailsService _fileDetailsService;
        public DashboardWebApiController(PlanningAreaService planningAreaService, DashboardActivityService dashboardActivityService, FileDetailsService fileDetailsService)
        {
            _planningAreaService = planningAreaService;
            _dashboardActivityService = dashboardActivityService;
            _fileDetailsService = fileDetailsService;
        }

        [HttpGet("/api/planningarea", Name = nameof(GetPlanningArea))]
        public IActionResult GetPlanningArea()
        {
            var result = _planningAreaService.GetAllPlanningAreaNames();
            return Ok(result);
        }

        [HttpGet("/api/region/{id}", Name = nameof(GetRegion))]
        public IActionResult GetRegion(int id)
        {
            var result = _planningAreaService.GetRegionById(id);
            return Ok(result);
        }

        [HttpGet("/api/activity/card/upload/{planningArea}", Name = nameof(GetCardActivtyUpload))]
        public IActionResult GetCardActivtyUpload(string planningArea)
        {
            var result = _dashboardActivityService.GetUploadCount(planningArea);
            return Ok(result);
        }

        [HttpGet("/api/activity/card/download/{planningArea}", Name = nameof(GetCardActivtyDownload))]
        public IActionResult GetCardActivtyDownload(string planningArea)
        {
            var result = _dashboardActivityService.GetDownloadCount(planningArea);
            return Ok(result);
        }

        [HttpGet("/api/activity/card/filesize/{planningArea}", Name = nameof(GetCardActivtyFileSize))]
        public IActionResult GetCardActivtyFileSize(string planningArea)
        {
            var result = _fileDetailsService.GetFileSizeAverage(planningArea);
            return Ok(result);
        }

        [HttpGet("/api/filedetails/filesize/{planningArea}/{year}", Name = nameof(GetFileSize))]
        public IActionResult GetFileSize(string planningArea, int year)
        {
            var result = _fileDetailsService.GetAllFileSizeByGroup(planningArea, year);

            return Ok(result);
        }

        [HttpGet("/api/activity/graph/upload/{planningArea}/{year}", Name = nameof(GetUploadCount))]
        public IActionResult GetUploadCount(string planningArea, int year)
        {
            var result = _dashboardActivityService.GetUploadCountByMonth(planningArea, year);
            return Ok(result);
        }

        [HttpGet("/api/activity/graph/download/{planningArea}/{year}", Name = nameof(GetDownloadCount))]
        public IActionResult GetDownloadCount(string planningArea, int year)
        {
            var result = _dashboardActivityService.GetDownloadCountByMonth(planningArea, year);
            return Ok(result);
        }

        [HttpGet("/api/dashboardActivity/viewcount/{planningArea}", Name = nameof(GetViewCount))]
        public IActionResult GetViewCount(string planningArea)
        {
            var result = _dashboardActivityService.GetViewCountTop5(planningArea);
            return Ok(result);
        }
    }
}
