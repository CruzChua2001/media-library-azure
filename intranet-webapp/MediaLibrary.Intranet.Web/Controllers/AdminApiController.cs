﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Common;
using MediaLibrary.Intranet.Web.Models;
using MediaLibrary.Intranet.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NPOI.OpenXmlFormats.Spreadsheet;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;

namespace MediaLibrary.Intranet.Web.Controllers
{
    [Authorize(Roles = UserRole.Admin)]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminApiController : ControllerBase
    {
        private readonly ILogger<AdminApiController> _logger;
        private readonly PlanningAreaService _planningAreaService;
        private readonly DashboardActivityService _dashboardActivityService;
        private readonly FileDetailsService _fileDetailsService;
        private readonly MediaSearchService _mediaSearchService;
        public AdminApiController(PlanningAreaService planningAreaService,
            DashboardActivityService dashboardActivityService,
            FileDetailsService fileDetailsService,
            ILogger<AdminApiController> logger,
            MediaSearchService mediaSearchService)
        {
            _planningAreaService = planningAreaService;
            _dashboardActivityService = dashboardActivityService;
            _fileDetailsService = fileDetailsService;
            _logger = logger;
            _mediaSearchService = mediaSearchService;
        }

        [HttpGet("/api/planningarea", Name = nameof(GetPlanningArea))]
        public IActionResult GetPlanningArea()
        {
            _logger.LogInformation("Retrieving all planning area");

            var result = _planningAreaService.GetAllPlanningAreaNames();
            return Ok(result);
        }

        [HttpGet("/api/region/{id}", Name = nameof(GetRegion))]
        public IActionResult GetRegion(int id)
        {
            _logger.LogInformation("Retrieving region for id {id}", id);

            var result = _planningAreaService.GetRegionById(id);
            return Ok(result);
        }

        [HttpGet("/api/activity/card/{planningArea}", Name = nameof(GetCardActivity))]
        public async Task<IActionResult> GetCardActivity(string planningArea)
        {
            _logger.LogInformation("Retrieving card activity (upload count, download count and file size average) for {planningArea} planning area", planningArea);

            var countResult = await _dashboardActivityService.GetActivityCountAsync(planningArea);
            var fileSizeResult = await _fileDetailsService.GetFileSizeAverageAsync(planningArea);
            var firstYearResult = await _dashboardActivityService.GetFirstYearAsync(planningArea);

            return Ok(new { uploadCount = countResult.Item1, downloadCount = countResult.Item2, fileSizeAvg = fileSizeResult, firstYear = firstYearResult });
           
        }

        [HttpGet("/api/filedetails/filesize/{planningArea}/{year}", Name = nameof(GetFileSize))]
        public async Task<IActionResult> GetFileSize(string planningArea, int year)
        {
            _logger.LogInformation("Retrieving file size for {planningArea} planning area in year {year}", planningArea, year);

            var fileSizeResult = await _fileDetailsService.GetAllFileSizeByGroupAsync(planningArea, year);

            return Ok(fileSizeResult);
        }

        [HttpGet("/api/activity/graph/upload/{planningArea}/{year}", Name = nameof(GetUploadCount))]
        public async Task<IActionResult> GetUploadCount(string planningArea, int year)
        {
                _logger.LogInformation("Retrieving monthly upload count for {planningArea} planning area in year {year}", planningArea, year);

                var result = await _dashboardActivityService.GetActivityCountByMonthAsync(planningArea, year, (int)DBActivity.Upload);
                return Ok(result);
        }

        [HttpGet("/api/activity/graph/download/{planningArea}/{year}", Name = nameof(GetDownloadCount))]
        public async Task<IActionResult> GetDownloadCount(string planningArea, int year)
        {
            _logger.LogInformation("Retrieving monthly download count for {planningArea} planning area in year {year}", planningArea, year);

            var result = await _dashboardActivityService.GetActivityCountByMonthAsync(planningArea, year, (int)DBActivity.Download);
            return Ok(result);
        }

        [HttpGet("/api/dashboardActivity/viewcount/{planningArea}", Name = nameof(GetViewCount))]
        public async Task<IActionResult> GetViewCount(string planningArea)
        {
            _logger.LogInformation("Retrieving top 5 most viewed image for {planningArea} planning area", planningArea);

            var result = await _dashboardActivityService.GetViewCountTop5Async(planningArea);
            return Ok(result);
        }

        [HttpGet("/api/activityreport", Name = nameof(GetActivityReport))]
        public async Task<IActionResult> GetActivityReport([FromQuery] ActivityReport report)
        {
            _logger.LogInformation("Getting activity report");

            var result = await _dashboardActivityService.GetActivityReport(report);
            return Ok(new { Result = result.Item1, TotalPage = result.Item2, CurrentPage = result.Item3 });
        }

        [HttpGet("/api/filereport", Name = nameof(GetFileReport))]
        public async Task<IActionResult> GetFileReport([FromQuery] FileReport report)
        {
            _logger.LogInformation("Getting file report");

            var result = await _fileDetailsService.GetFileReport(report);
            return Ok(new { Result = result.Item1, TotalPage = result.Item2, CurrentPage = result.Item3 });
        }

        [HttpGet("/api/staff", Name = nameof(GetAllStaff))]
        public IActionResult GetAllStaff([FromQuery] StaffQuery staff)
        {
            _logger.LogInformation("Getting staff");

            var result = _dashboardActivityService.GetAllStaff(staff);
            return Ok(result);
        }

        [HttpGet("/api/generatereport", Name = nameof(GenerateReport))]
        public IActionResult GenerateReport()
        {
            XSSFWorkbook workbook = new XSSFWorkbook();
            var sheet = workbook.CreateSheet($"ML Activity Report") as XSSFSheet;

            //Default styling for worksheet
            ICellStyle defaultStyle = workbook.CreateCellStyle();
            IFont defaultFont = workbook.CreateFont();
            defaultFont.FontHeightInPoints = 14;
            defaultStyle.SetFont(defaultFont);

            //Style for title
            ICellStyle tableTitleStyle = workbook.CreateCellStyle();
            IFont tableFont = workbook.CreateFont();
            tableFont.FontHeightInPoints = 12;
            tableFont.Color = IndexedColors.Black.Index;
            tableTitleStyle.SetFont(tableFont);

            //Title
            var titleRow = sheet.CreateRow(0);
            ICellStyle titleStyle = workbook.CreateCellStyle();
            IFont titleFont = workbook.CreateFont();
            titleFont.IsBold = true;
            titleFont.FontHeightInPoints = 20;
            titleStyle.SetFont(titleFont);
            CreateCell(titleRow, 0, "Media Library Activity Report", titleStyle);

            //Date time
            var dateTimeRow = sheet.CreateRow(1);
            DateTime today = DateTime.Now;
            CreateCell(dateTimeRow, 0, "Created On: " + today.Date.ToString("dd/MM/yyyy") + " " + today.ToString("h:mm tt"), defaultStyle);

            //Downloaded User
            var userRow = sheet.CreateRow(2);
            CreateCell(userRow, 0, "Created By: " + User.GetUserGraphDisplayName(), defaultStyle);

            List<GenerateReportResult> result = getReportResult();
            int rowCount = result.Count + 6;

            //Inserting items into the table rows
            insertTableTitle(sheet, tableTitleStyle, workbook);
            insertTableResult(sheet, defaultStyle, result, workbook);

            // Format Cell Range As Table
            XSSFTable xssfTable = sheet.CreateTable();
            CT_Table ctTable = xssfTable.GetCTTable();
            AreaReference myDataRange = new AreaReference(new CellReference(7, 0), new CellReference(rowCount, 9));
            ctTable.@ref = myDataRange.FormatAsString();
            ctTable.autoFilter = new CT_AutoFilter();
            ctTable.@ref = "A7:J" + (rowCount + 1).ToString();
            ctTable.id = 1;
            ctTable.name = "Table1";
            ctTable.displayName = "Table1";
            ctTable.tableStyleInfo = new CT_TableStyleInfo();
            ctTable.tableStyleInfo.name = "TableStyleLight1"; // TableStyleLight1 is one of XSSFBuiltinTableStyle
            ctTable.tableStyleInfo.showRowStripes = true;
            ctTable.tableColumns = new CT_TableColumns();
            ctTable.tableColumns.tableColumn = new List<CT_TableColumn>();
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 1, name = "Image Name" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 2, name = "Image Location" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 3, name = "Image Planning" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 4, name = "Image URL" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 5, name = "Staff Name" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 6, name = "Email" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 7, name = "Department" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 8, name = "Group" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 9, name = "Date & Time" });
            ctTable.tableColumns.tableColumn.Add(new CT_TableColumn() { id = 10, name = "Activity" });

            using (var exportData = new MemoryStream())
            {
                workbook.Write(exportData);
                string saveAsFileName = string.Format("ML_Report-{0:d}.xlsx", DateTime.Now).Replace("/", "-");

                byte[] bytes = exportData.ToArray();
                return File(bytes, "application/vnd.ms-excel", saveAsFileName);
            }
        }

        private void CreateCell(IRow CurrentRow, int CellIndex, string Value, ICellStyle Style)
        {
            ICell Cell = CurrentRow.CreateCell(CellIndex);
            Cell.SetCellValue(Value);
            Cell.CellStyle = Style;
        }

        private void insertTableTitle(XSSFSheet sheet, ICellStyle defaultStyle, XSSFWorkbook workbook)
        {
            //Title row or heading of the table
            sheet.CreateRow(6);
            var tableTitleRow = sheet.GetRow(6);
            CreateCell(tableTitleRow, 0, "Image Name", defaultStyle);
            CreateCell(tableTitleRow, 1, "Image Location", defaultStyle);
            CreateCell(tableTitleRow, 2, "Image Planning Area", defaultStyle);
            CreateCell(tableTitleRow, 3, "Image URL", defaultStyle);
            CreateCell(tableTitleRow, 4, "Staff Name", defaultStyle);
            CreateCell(tableTitleRow, 5, "Email", defaultStyle);
            CreateCell(tableTitleRow, 6, "Department", defaultStyle);
            CreateCell(tableTitleRow, 7, "Group", defaultStyle);
            CreateCell(tableTitleRow, 8, "Date & Time", defaultStyle);
            CreateCell(tableTitleRow, 9, "Activity", defaultStyle);
        }

        private void insertTableResult(XSSFSheet sheet, ICellStyle defaultStyle, List<GenerateReportResult> results, XSSFWorkbook workbook)
        {
            int rowIndex = 7;
            foreach (GenerateReportResult result in results)
            {
                sheet.CreateRow(rowIndex); //Create row for each result
                var tableResultRow = sheet.GetRow(rowIndex);

                CreateCell(tableResultRow, 0, result.ImageName ?? "", defaultStyle);
                CreateCell(tableResultRow, 1, result.ImageLocation ?? "", defaultStyle);
                CreateCell(tableResultRow, 2, result.PlanningArea ?? "", defaultStyle);
                CreateCell(tableResultRow, 3, result.ImageURL ?? "", defaultStyle);
                CreateCell(tableResultRow, 4, result.StaffName ?? "", defaultStyle);
                CreateCell(tableResultRow, 5, result.Email ?? "", defaultStyle);
                CreateCell(tableResultRow, 6, result.Department ?? "", defaultStyle);
                CreateCell(tableResultRow, 7, result.Group ?? "", defaultStyle);
                if (result.ActivityDateTime != null)
                {
                    DateTime activityDateTime = (DateTime)result.ActivityDateTime;
                    ICell Cell = tableResultRow.CreateCell(8);
                    Cell.SetCellValue(activityDateTime);
                    //Styling for date time column
                    ICellStyle dateTimeStyle = workbook.CreateCellStyle();
                    IFont dateTimeFont = workbook.CreateFont();
                    dateTimeFont.FontHeightInPoints = 14;
                    dateTimeStyle.SetFont(dateTimeFont);
                    dateTimeStyle.DataFormat = workbook.CreateDataFormat().GetFormat("d/M/yyyy h:mm AM/PM");
                    Cell.CellStyle = dateTimeStyle;
                }
                else
                {
                    CreateCell(tableResultRow, 8, "", defaultStyle);
                }
                CreateCell(tableResultRow, 9, result.Activity != null ? result.Activity : "", defaultStyle);
                rowIndex++;
            }
        }

        private List<GenerateReportResult> getReportResult()
        {
            List<GenerateReportResult> result = new List<GenerateReportResult>();
            result = Task.Run(() => _dashboardActivityService.GenerateReport()).Result;

            if (result.Count == 0)
            {
                GenerateReportResult report = new GenerateReportResult()
                {
                    ActivityDateTime = null
                };
                result.Add(report);
            }
            return result;
        }

        [HttpGet("/api/database/add", Name = nameof(GetDatabaseData))]
        public async Task<IActionResult> GetDatabaseData()
        {
            var results = await _mediaSearchService.GetAllMediaItemsAsync();

            _logger.LogInformation("Adding all items into database");

            foreach (var result in results)
            {
                await _dashboardActivityService.AddActivityForUpload(result.Items);
                await _fileDetailsService.AddDetailsForUpload(result.Items);
            }

            return Ok("Added Successfully");
        }
    }
}