using System;
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
                    
                    AddDetails(fileDetails);
                }
            }
        }

        public string GetFileSizeAverage(string planningArea)
        {
            string result = "0";
            if(planningArea == "ALL")
            {
                result = Math.Round(_mediaLibraryContext.fileDetails.Average(e => e.FileSize), 2).ToString();
            }
            
            return result;
        }


        public IQueryable GetAllFileSizeByGroup(string planningArea, int year)
        {
            var result = from p in _mediaLibraryContext.Set<FileDetails>()
                         group p by Math.Round(p.FileSize,1)
                         into g
                         select new { g.Key, Count = g.Count() };

            return result;
        }

        private void File(Stream content, string contentType)
        {
            throw new NotImplementedException();
        }
    }
}
