using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Models;
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
            if(planningArea == "ALL")
            {
                var result = _dashboardActivityService.GetUploadCount();
                return Ok(result);
            }
            else
            {
                var result = _dashboardActivityService.GetUploadCountByLocation(planningArea);
                return Ok(result);
            }
        }

        [HttpGet("/api/activity/card/download/{planningArea}", Name = nameof(GetCardActivtyDownload))]
        public IActionResult GetCardActivtyDownload(string planningArea)
        {
            if (planningArea == "ALL")
            {
                var result = _dashboardActivityService.GetDownloadCount();
                return Ok(result);
            }
            else
            {
                var result = _dashboardActivityService.GetDownloadCountByLocation(planningArea);
                return Ok(result);
            }
        }

        [HttpGet("/api/activity/card/filesize/{planningArea}", Name = nameof(GetCardActivtyFileSize))]
        public IActionResult GetCardActivtyFileSize(string planningArea)
        {
            if(planningArea == "ALL")
            {
                var result = _fileDetailsService.GetFileSizeAverage();
                return Ok(result);
            }
            else
            {
                var result = _fileDetailsService.GetFileSizeAverageByLocation(planningArea);
                return Ok(result);
            }
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

        [HttpGet("/api/activityreport", Name = nameof(GetActivityReport))]
        public IActionResult GetActivityReport([FromQuery] ActivityReport report)
        {
            if (report.PlanningArea == "ALL")
            {
                var result = _dashboardActivityService.GetActivityReport(report);
                return Ok(result);
            }
            else
            {
                var result = _dashboardActivityService.GetActivityReportByLocation(report);
                return Ok(result);
            }
        }

        [HttpGet("/api/filereport", Name = nameof(GetFileReport))]
        public IActionResult GetFileReport([FromQuery] FileReport report)
        {
            if(report.PlanningArea == "ALL")
            {
                var result = _fileDetailsService.GetFileReport(report);
                return Ok(result);
            }
            else
            {
                var result = _fileDetailsService.GetFileReportByLocation(report);
                return Ok(result);
            }
        }

        [HttpGet("/api/staff", Name = nameof(GetAllStaff))]
        public IActionResult GetAllStaff([FromQuery] StaffQuery staff)
        {
            if(staff.SearchQuery == null)
            {
                var result = _dashboardActivityService.GetAllStaff(staff);
                return Ok(result);
            }
            else
            {
                var result = _dashboardActivityService.GetAllStaffBySearch(staff);
                return Ok(result);
            }
            
        }
    }
}
