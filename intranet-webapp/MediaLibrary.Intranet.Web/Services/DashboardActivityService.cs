using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace MediaLibrary.Intranet.Web.Services
{
    public class DashboardActivityService
    {
        private MediaLibraryContext _mediaLibraryContext;

        public DashboardActivityService(MediaLibraryContext mlContext)
        {
            _mediaLibraryContext = mlContext;
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

        public string GetUploadCount(string planningArea)
        {
            string uploadCount = "0";
            if (planningArea == "ALL")
            {
                uploadCount = _mediaLibraryContext.dashboardActivity.Where(e => e.Activity == 2).Count().ToString();
            }

            return uploadCount;
        }

        public string GetDownloadCount(string planningArea)
        {
            string downloadCount = "0";
            if (planningArea == "ALL")
            {
                downloadCount = _mediaLibraryContext.dashboardActivity.Where(e => e.Activity == 3).Count().ToString();
            }

            return downloadCount;
        }
    }
}
