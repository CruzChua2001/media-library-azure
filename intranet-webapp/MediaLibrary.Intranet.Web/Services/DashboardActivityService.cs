using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Models;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NPOI.SS.Formula.Functions;

namespace MediaLibrary.Intranet.Web.Services
{
    public class DashboardActivityService
    {
        private MediaLibraryContext _mediaLibraryContext;

        public DashboardActivityService(MediaLibraryContext mlContext)
        {
            _mediaLibraryContext = mlContext;
        }

        public bool GetEmailExist(string email)
        {
            return _mediaLibraryContext.dashboardActivity.Where(e => e.Activity == 2 || e.Activity == 3).Any(e => e.Email == email);
        }

        public bool ActivityExist(string fileId)
        {
            return _mediaLibraryContext.dashboardActivity.Any(e => e.FileId == fileId);
        }

        public bool UploadActivityExist(string fileId)
        {
            return _mediaLibraryContext.dashboardActivity.Where(x => x.Activity == 2).Any(e => e.FileId == fileId);
        }

        public DashboardActivity GetActivityByFileId(string fileId)
        {
            DashboardActivity activity = _mediaLibraryContext.dashboardActivity.Where(e => e.FileId == fileId).FirstOrDefault();
            return activity;
        }

        public bool AddActivity(DashboardActivity activity)
        {
            _mediaLibraryContext.Add(activity);
            _mediaLibraryContext.SaveChanges();
            return true;
        }

        public void AddActivityForUpload(IList<MediaItem> mediaItem)
        {
            foreach (var item in mediaItem)
            {
                if (!UploadActivityExist(item.Id))
                {
                    
                    DashboardActivity dashboardActivity = new DashboardActivity();
                    dashboardActivity.Id = Guid.NewGuid().ToString();
                    dashboardActivity.FileId = item.Id;
                    dashboardActivity.Email = item.Author;
                    dashboardActivity.ActivityDateTime = item.UploadDate;
                    dashboardActivity.Activity = 2;

                    AddActivity(dashboardActivity);
                }
            }
        }

        public string GetUploadCount()
        {
            string uploadCount = "0";
            uploadCount = _mediaLibraryContext.dashboardActivity.Where(e => e.Activity == 2).Count().ToString();

            return uploadCount;
        }

        public IQueryable GetUploadCountByLocation(string planningArea)
        {
            IQueryable result = null;
            var getPolygonResult = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                   where pa.PlanningAreaName == planningArea
                                   select new { pa.AreaPolygon };
            foreach (var polygon in getPolygonResult)
            {

                var areaPolygon = polygon.AreaPolygon;
                result = from da in _mediaLibraryContext.Set<DashboardActivity>()
                             join fd in _mediaLibraryContext.Set<FileDetails>() on da.FileId equals fd.FileId
                             where areaPolygon.Contains(fd.AreaPoint) && da.Activity == 2
                             select new { da.FileId };
            }

            return result;
        }

        public string GetDownloadCount()
        {
            string downloadCount = "0";
            downloadCount = _mediaLibraryContext.dashboardActivity.Where(e => e.Activity == 3).Count().ToString();

            return downloadCount;
        }

        public IQueryable GetDownloadCountByLocation(string planningArea)
        {
            IQueryable result = null;
            var getPolygonResult = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                   where pa.PlanningAreaName == planningArea
                                   select new { pa.AreaPolygon };
            foreach (var polygon in getPolygonResult)
            {
                var areaPolygon = polygon.AreaPolygon;
                result = from da in _mediaLibraryContext.Set<DashboardActivity>()
                         join fd in _mediaLibraryContext.Set<FileDetails>() on da.FileId equals fd.FileId
                         where areaPolygon.Contains(fd.AreaPoint) && da.Activity == 3
                         select new { da.FileId };
            }

            return result;
        }

        public IQueryable GetUploadCountByMonth(string planningArea, int year)
        {
            if (planningArea == "ALL")
            {
                var result = from d in _mediaLibraryContext.Set<DashboardActivity>()
                                 where d.Activity == 2 && d.ActivityDateTime.Year == year
                                 group d by d.ActivityDateTime.Month
                                 into g
                                 select new { g.Key, Count = g.Count() };

                return result;
            }
            else
            {
                IQueryable result = null;
                var getPolygonResult = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                       where pa.PlanningAreaName == planningArea
                                       select new { pa.AreaPolygon };
                foreach (var polygon in getPolygonResult)
                {
                    var areaPolygon = polygon.AreaPolygon;
                    result = from d in _mediaLibraryContext.Set<DashboardActivity>()
                             join fd in _mediaLibraryContext.Set<FileDetails>() on d.FileId equals fd.FileId
                             where d.Activity == 2 && d.ActivityDateTime.Year == year && areaPolygon.Contains(fd.AreaPoint)
                             group d by d.ActivityDateTime.Month
                             into g
                             select new { g.Key, Count = g.Count() };
                }

                return result;
            }
            
        }
        
        public IQueryable GetDownloadCountByMonth(string planningArea, int year)
        {
            if (planningArea == "ALL")
            {
                var result = from d in _mediaLibraryContext.Set<DashboardActivity>()
                             where d.Activity == 3 && d.ActivityDateTime.Year == year
                             group d by d.ActivityDateTime.Month
                             into g
                             select new { g.Key, Count = g.Count() };

                return result;
            }
            else
            {
                IQueryable result = null;
                var getPolygonResult = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                       where pa.PlanningAreaName == planningArea
                                       select new { pa.AreaPolygon };
                foreach (var polygon in getPolygonResult)
                {
                    var areaPolygon = polygon.AreaPolygon;
                    result = from d in _mediaLibraryContext.Set<DashboardActivity>()
                             join fd in _mediaLibraryContext.Set<FileDetails>() on d.FileId equals fd.FileId
                             where d.Activity == 3 && d.ActivityDateTime.Year == year && areaPolygon.Contains(fd.AreaPoint)
                             group d by d.ActivityDateTime.Month
                             into g
                             select new { g.Key, Count = g.Count() };
                }

                return result;
            }
        }

        public IQueryable GetViewCountTop5(string planningArea)
        {
            if(planningArea == "ALL")
            {
                var result = (from da in _mediaLibraryContext.Set<DashboardActivity>()
                              where da.Activity == 1
                              group da by da.FileId
                              into g
                              orderby g.Count() descending
                              select new { g.Key, Count = g.Count() }).Take(5);

                return result;
            }
            else
            {
                IQueryable result = null;
                var getPolygonResult = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                       where pa.PlanningAreaName == planningArea
                                       select new { pa.AreaPolygon };
                foreach (var polygon in getPolygonResult)
                {

                    var areaPolygon = polygon.AreaPolygon;
                    result = (from da in _mediaLibraryContext.Set<DashboardActivity>()
                              join fd in _mediaLibraryContext.Set<FileDetails>() on da.FileId equals fd.FileId
                              where da.Activity == 1 && areaPolygon.Contains(fd.AreaPoint)
                              group da by da.FileId
                              into g
                              orderby g.Count() descending
                              select new { g.Key, Count = g.Count() }).Take(5);
                }

                return result;
            }
        }

        public Tuple<List<ActivityReportResult>, int, int> GetActivityReport(ActivityReport report)
        {
            int activityOption = report.ActivityOption;

            List<int> option = new List<int>();
            if(activityOption == 0)
            {
                option.Add(2);
                option.Add(3);
            }
            else
            {
                option.Add(activityOption);
            }

            var result = (from da in _mediaLibraryContext.Set<DashboardActivity>()
                          join a in _mediaLibraryContext.Set<AllActivity>() on da.Activity equals a.Id
                          join fd in _mediaLibraryContext.Set<FileDetails>() on da.FileId equals fd.FileId
                          where option.Contains(da.Activity)
                          select new ActivityReportResult { FileId = da.FileId, ActivityDateTime = da.ActivityDateTime, ActivityType = a.ActivityType, Location = GetPlanningAreaNameByPoint(_mediaLibraryContext, fd.AreaPoint), ThumbnailURL = fd.ThumbnailURL, Email = da.Email }).ToList();
            return GetActivityReportResult(result, report);
        }

        private static List<string> GetPlanningAreaNameByPoint(MediaLibraryContext mlContext,Point areaPoint)
        {
            var result = (from pa in mlContext.Set<PlanningArea>()
                          where pa.AreaPolygon.Contains(areaPoint)
                         select pa.PlanningAreaName).ToList();
            return result;
        }

        public Tuple<List<ActivityReportResult>, int, int> GetActivityReportByLocation(ActivityReport report)
        {
            var getPolygonResult = from pa in _mediaLibraryContext.Set<PlanningArea>()
                                   where pa.PlanningAreaName == report.PlanningArea
                                   select new { pa.AreaPolygon };

            int activityOption = report.ActivityOption;
            string planningArea = report.PlanningArea;
            List<int> option = new List<int>();
            if (activityOption == 0)
            {
                option.Add(2);
                option.Add(3);
            }
            else
            {
                option.Add(activityOption);
            }
            foreach (var polygon in getPolygonResult)
            {
                var areaPolygon = polygon.AreaPolygon;
                List<string> locationList = new List<string> { planningArea };

                var result = (from da in _mediaLibraryContext.Set<DashboardActivity>()
                              join a in _mediaLibraryContext.Set<AllActivity>() on da.Activity equals a.Id
                              join fd in _mediaLibraryContext.Set<FileDetails>() on da.FileId equals fd.FileId
                              where option.Contains(da.Activity) && areaPolygon.Contains(fd.AreaPoint)
                              select new ActivityReportResult { FileId = da.FileId, ActivityDateTime = da.ActivityDateTime, ActivityType = a.ActivityType, Location = locationList, ThumbnailURL = fd.ThumbnailURL, Email = da.Email }).ToList();
                return GetActivityReportResult(result, report);
            }
            return null;
        }

        private int getTotalPage(int itemPerPage, int? totalItem)
        {
            int totalPage = (((int)totalItem - 1) / itemPerPage) + 1;
            return totalPage;
        }

        public Tuple<List<ActivityReportResult>, int, int> GetActivityReportResult(List<ActivityReportResult> result, ActivityReport report)
        {
            int activityOption = report.ActivityOption;
            string sortOption = report.SortOption;
            List<ActivityReportResult> originalResult = result;
            if (report.StartDate != null)
            {
                DateTime startDate = Convert.ToDateTime(report.StartDate);
                DateTime endDate = Convert.ToDateTime(report.EndDate).AddDays(1);
                result = result.Where(e => e.ActivityDateTime >= startDate && e.ActivityDateTime <= endDate).ToList();
            }

            int pageno = report.Page - 1;
            int itemPerPage = 30;
            int skipItem = pageno * itemPerPage;

            if(sortOption == "dateASC")
            {
                result = result.OrderBy(e => e.ActivityDateTime).ToList();
            }
            else if (sortOption == "dateDSC")
            {
                result = result.OrderByDescending(e => e.ActivityDateTime).ToList();
            }
            System.Diagnostics.Debug.WriteLine(report.Email);
            if (report.Email != null && report.Email != "")
            {
                result = result.Where(e => e.Email == report.Email).ToList();
                return Tuple.Create(result.Skip(skipItem).Take(itemPerPage).ToList(), getTotalPage(itemPerPage, result.Count()), pageno + 1);
            }
            return Tuple.Create(result.Skip(skipItem).Take(itemPerPage).ToList(), getTotalPage(itemPerPage, result.Count()), pageno + 1);
        }

        public Tuple<IEnumerable<StaffResult>, int, int> GetAllStaff(StaffQuery staff)
        {
            List<int> option = new List<int>();
            option.Add(2);
            option.Add(3);

            var result = (from da in _mediaLibraryContext.Set<DashboardActivity>()
                         where option.Contains(da.Activity)
                         group da by da.Email
                         into g
                         select new StaffResult { Email = g.Key, UploadCount = GetUploadCountByEmail(_mediaLibraryContext, g.Key), DownloadCount = GetDownloadCountByEmail(_mediaLibraryContext, g.Key) }).ToList();
            return GetStaffResult(result, staff);
        }

        public Tuple<IEnumerable<StaffResult>, int, int> GetAllStaffBySearch(StaffQuery staff)
        {
            List<int> option = new List<int>();
            option.Add(2);
            option.Add(3);

            var result = (from da in _mediaLibraryContext.Set<DashboardActivity>()
                         where option.Contains(da.Activity) && da.Email.Contains(staff.SearchQuery)
                         group da by da.Email
                         into g
                         select new StaffResult { Email = g.Key, UploadCount = GetUploadCountByEmail(_mediaLibraryContext, g.Key), DownloadCount = GetDownloadCountByEmail(_mediaLibraryContext, g.Key) }).ToList();
            return GetStaffResult(result, staff);
        }

        private static int GetUploadCountByEmail(MediaLibraryContext mlContext, string email)
        {
            var result = (from da in mlContext.Set<DashboardActivity>()
                         where da.Activity == 2 && da.Email == email
                         group da by da.Email
                         into g
                         select g.Count()).FirstOrDefault();
            return result;
        }

        private static int GetDownloadCountByEmail(MediaLibraryContext mlContext, string email)
        {
            var result = (from da in mlContext.Set<DashboardActivity>()
                          where da.Activity == 3 && da.Email == email
                          group da by da.Email
                          into g
                          select g.Count()).FirstOrDefault();
            return result;
        }

        public Tuple<IEnumerable<StaffResult>, int, int> GetStaffResult(List<StaffResult> result, StaffQuery staff)
        {
            int pageno = staff.Page - 1;
            int itemPerPage = 30;
            int skipResult = pageno * itemPerPage;

            return Tuple.Create(result.Skip(skipResult).Take(itemPerPage), getTotalPage(itemPerPage, result.Count()), pageno + 1);
        }
    }
}
