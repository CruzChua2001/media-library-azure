﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MediaLibrary.Intranet.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Spatial;
using NetTopologySuite.Geometries;

namespace MediaLibrary.Intranet.Web.Services
{
    public class FileDetailsService
    {
        private readonly MediaLibraryContext _mediaLibraryContext;
        private static BlobContainerClient _blobContainerClient = null;
        private readonly AppSettings _appSettings;

        public FileDetailsService(MediaLibraryContext mediaLibraryContext, IOptions<AppSettings> appSettings)
        {
            _mediaLibraryContext = mediaLibraryContext;
            _appSettings = appSettings.Value;

            InitStorage();
        }

        private void InitStorage()
        {
            if (_blobContainerClient == null)
            {
                if (!string.IsNullOrEmpty(_appSettings.MediaStorageConnectionString))
                {
                    _blobContainerClient = new BlobContainerClient(_appSettings.MediaStorageConnectionString, _appSettings.MediaStorageImageContainer);
                }
                else
                {
                    string containerEndpoint = string.Format("https://{0}.blob.core.windows.net/{1}",
                        _appSettings.MediaStorageAccountName, _appSettings.MediaStorageImageContainer);
                    _blobContainerClient = new BlobContainerClient(new Uri(containerEndpoint), new DefaultAzureCredential());
                }
            }
        }

        public bool FileExist(string fileId)
        {
            return _mediaLibraryContext.fileDetails.Any(e => e.FileId == fileId);
        }

        public bool AddDetails(FileDetails details)
        {
            _mediaLibraryContext.Add(details);
            _mediaLibraryContext.SaveChanges();
            return true;
        }

        public async Task AddDetailsForUpload(IList<MediaItem> mediaItem)
        {
            foreach (var item in mediaItem)
            {
                string fileName = item.FileURL.Remove(0, 12);
                BlobClient blobClient = _blobContainerClient.GetBlobClient(fileName);
                decimal fileSize = 0.0M;
                try
                {
                    BlobDownloadInfo download = await blobClient.DownloadAsync();
                    fileSize = (decimal)download.Details.ContentLength / 1048576;
                }
                catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobNotFound)
                {
                    System.Diagnostics.Debug.WriteLine("Error encountered: ", ex);
                }
                if (!FileExist(item.Id))
                {
                    Point areaPoint = null;
                    if(item.Location != null)
                    {
                        areaPoint = new Point(item.Location.Longitude, item.Location.Latitude) { SRID = 4326 };
                    }
                    FileDetails fileDetails = new FileDetails();
                    fileDetails.Id = Guid.NewGuid().ToString();
                    fileDetails.FileId = item.Id;
                    fileDetails.FileSize = fileSize;
                    fileDetails.AreaPoint = areaPoint;
                    fileDetails.ThumbnailURL = item.ThumbnailURL;
                    
                    AddDetails(fileDetails);
                }
            }
        }

        public string GetFileSizeAverage()
        {
            string result = "0";
            result = Math.Round(_mediaLibraryContext.fileDetails.Average(e => e.FileSize), 2).ToString();
            
            return result;
        }

        public IQueryable GetFileSizeAverageByLocation(string planningArea)
        {
            IQueryable result = null;
            var getPlanningArea = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                  where pa.PlanningAreaName == planningArea
                                  select new { pa.AreaPolygon };
            foreach(var polygon in getPlanningArea)
            {
                var areaPolygon = polygon.AreaPolygon;
                result = from fd in _mediaLibraryContext.Set<FileDetails>()
                         where areaPolygon.Contains(fd.AreaPoint)
                         select new { fd.FileSize };
            }
            return result;
        }


        public IQueryable GetAllFileSizeByGroup(string planningArea, int year)
        {
            if(planningArea == "ALL")
            {
                var result = from p in _mediaLibraryContext.Set<FileDetails>()
                             join da in _mediaLibraryContext.Set<DashboardActivity>() on p.FileId equals da.FileId
                             where da.ActivityDateTime.Year == year
                             group p by Math.Round(p.FileSize, 1)
                         into g
                             select new { g.Key, Count = g.Count() };

                return result;
            }
            else
            {
                IQueryable result = null;
                var getPlanningArea = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                      where pa.PlanningAreaName == planningArea
                                      select new { pa.AreaPolygon };
                foreach(var polygon in getPlanningArea)
                {
                    var areaPolygon = polygon.AreaPolygon;
                    result = from p in _mediaLibraryContext.Set<FileDetails>()
                                join da in _mediaLibraryContext.Set<DashboardActivity>() on p.FileId equals da.FileId
                                where da.ActivityDateTime.Year == year && areaPolygon.Contains(p.AreaPoint)
                                group p by Math.Round(p.FileSize, 1)
                                into g
                                select new { g.Key, Count = g.Count() };
                }
                return result;
            }
        }

        public Tuple<List<FileReportResult>, int, int> GetFileReport(FileReport report)
        {
            string sortOption = report.SortOption;

            var result = (from fd in _mediaLibraryContext.Set<FileDetails>()
                          group fd by new { FileId = fd.FileId, FileSize = fd.FileSize, ThumbnailURL = fd.ThumbnailURL }
                         into g
                          select new FileReportResult
                          {
                              FileId = g.Key.FileId,
                              FileSize = g.Key.FileSize,
                              ViewCount = GetViewCountByFileId(_mediaLibraryContext, g.Key.FileId),
                              Location = GetPlanningAreaNameByFileId(_mediaLibraryContext, g.Key.FileId),
                              ThumbnailURL = g.Key.ThumbnailURL,
                              Email = GetEmailByFileId(_mediaLibraryContext, g.Key.FileId),
                              UploadDateTime = GetDateTimeByFileId(_mediaLibraryContext, g.Key.FileId),
                              DownloadCount = GetDownloadCountByFileId(_mediaLibraryContext, g.Key.FileId)
                          }).ToList();

            return GetFileReportResult(result, report);
        }

        public Tuple<List<FileReportResult>, int, int> GetFileReportByLocation(FileReport report)
        {
            string sortOption = report.SortOption;
            string planningArea = report.PlanningArea;

            var getPolygonResult = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                   where pa.PlanningAreaName == report.PlanningArea
                                   select new { pa.AreaPolygon };

            foreach (var polygon in getPolygonResult)
            {
                var areaPolygon = polygon.AreaPolygon;
                List<string> locationList = new List<string> { planningArea };

                var result = (from fd in _mediaLibraryContext.Set<FileDetails>()
                              where areaPolygon.Contains(fd.AreaPoint)
                              group fd by new { FileId = fd.FileId, FileSize = fd.FileSize, ThumbnailURL = fd.ThumbnailURL }
                              into g
                              select new FileReportResult
                              {
                                  FileId = g.Key.FileId,
                                  FileSize = g.Key.FileSize,
                                  ViewCount = GetViewCountByFileId(_mediaLibraryContext, g.Key.FileId),
                                  Location = locationList,
                                  ThumbnailURL = g.Key.ThumbnailURL,
                                  Email = GetEmailByFileId(_mediaLibraryContext, g.Key.FileId),
                                  UploadDateTime = GetDateTimeByFileId(_mediaLibraryContext, g.Key.FileId),
                                  DownloadCount = GetDownloadCountByFileId(_mediaLibraryContext, g.Key.FileId)
                              }).ToList();

                return GetFileReportResult(result, report);
            }

            return null;
        }

        private static int GetViewCountByFileId(MediaLibraryContext mlContext, string fileId)
        {
            var result = (from da in mlContext.Set<DashboardActivity>()
                          where da.Activity == 1 && da.FileId == fileId
                          group da by da.FileId
                          into g
                          select new { Count = g.Count() }).Select(e => e.Count).FirstOrDefault().ToString();
            return int.Parse(result);
        }

        private static List<string> GetPlanningAreaNameByFileId(MediaLibraryContext mlContext, string fileId)
        {
            var areaPoint = (from fd in mlContext.Set<FileDetails>()
                            where fd.FileId == fileId
                            select fd.AreaPoint).FirstOrDefault();
            var result = (from pa in mlContext.Set<PlanningArea>()
                         where pa.AreaPolygon.Contains(areaPoint)
                         select pa.PlanningAreaName).ToList();
            return result;
        }

        private static string GetEmailByFileId(MediaLibraryContext mlContext, string fileId)
        {
            var result = (from da in mlContext.Set<DashboardActivity>()
                          where da.Activity == 2 && da.FileId == fileId
                          select da.Email).FirstOrDefault() ?? "";
            return result;
        }

        private static DateTime GetDateTimeByFileId(MediaLibraryContext mlContext, string fileId)
        {
            var result = (from da in mlContext.Set<DashboardActivity>()
                          where da.Activity == 2 && da.FileId == fileId
                          select da.ActivityDateTime).FirstOrDefault();
            return result;
        }

        private static int GetDownloadCountByFileId(MediaLibraryContext mlContext, string fileId)
        {
            var result = (from da in mlContext.Set<DashboardActivity>()
                          where da.Activity == 3 && da.FileId == fileId
                          group da by da.FileId
                          into g
                          select new { Count = g.Count() }).Select(e => e.Count).FirstOrDefault().ToString();
            return int.Parse(result);
        }

        public Tuple<List<FileReportResult>, int, int> GetFileReportResult(List<FileReportResult> result, FileReport report)
        {
            string sortOption = report.SortOption;
            string planningArea = report.PlanningArea;

            List<FileReportResult> originalResult = result;

            if (report.StartDate != null && report.EndDate != null)
            {
                DateTime startDate = Convert.ToDateTime(report.StartDate);
                DateTime endDate = Convert.ToDateTime(report.EndDate).AddDays(1);
                result = result.Where(e => e.UploadDateTime >= startDate && e.UploadDateTime <= endDate).ToList();
            }

            int itemPerPage = 30;
            int pageno = report.Page - 1;
            int skipItem = itemPerPage * pageno;

            if (sortOption == "dateDSC")
            {
                result = result.OrderByDescending(e => e.UploadDateTime).ToList();
            }
            else if (sortOption == "dateASC")
            {
                result = result.OrderBy(e => e.UploadDateTime).ToList();
            }
            else if (sortOption == "fileSizeDSC")
            {
                result = result.OrderByDescending(e => e.FileSize).ToList();
            }
            else if (sortOption == "fileSizeASC")
            {
                result = result.OrderBy(e => e.FileSize).ToList();
            }
            else if (sortOption == "viewStatsDSC")
            {
                result = result.OrderByDescending(e => e.ViewCount).ToList();
            }
            else if (sortOption == "viewStatsASC")
            {
                result = result.OrderBy(e => e.ViewCount).ToList();
            }
            else if (sortOption == "downloadStatsDSC")
            {
                result = result.OrderByDescending(e => e.DownloadCount).ToList();
            }
            else if (sortOption == "downloadStatsASC")
            {
                result = result.OrderBy(e => e.DownloadCount).ToList();
            }
            return Tuple.Create(result.Skip(skipItem).Take(itemPerPage).ToList(), getTotalPage(itemPerPage, result.Count()), pageno + 1); ;
        }

        public int getTotalPage(int itemPerPage, int? totalItem)
        {
            int totalPage = (((int)totalItem - 1) / itemPerPage) + 1;
            return totalPage;
        }
    }
}
