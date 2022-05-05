using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Models;

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
    }
}
