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
using Microsoft.Extensions.Options;

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
                double fileSize = 0.0;
                try
                {
                    BlobDownloadInfo download = await blobClient.DownloadAsync();
                    System.Diagnostics.Debug.WriteLine("Test");
                    System.Diagnostics.Debug.WriteLine(download.Details.ContentLength);
                    fileSize = (double)download.Details.ContentLength / 1048576;
                }
                catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobNotFound)
                {
                    System.Diagnostics.Debug.WriteLine("Error encountered: ", ex);
                }
                if (!FileExist(item.Id))
                {
                    FileDetails fileDetails = new FileDetails();
                    fileDetails.Id = Guid.NewGuid().ToString();
                    fileDetails.FileId = item.Id;
                    fileDetails.FileSize = fileSize;

                    AddDetails(fileDetails);
                }
            }
        }

        private void File(Stream content, string contentType)
        {
            throw new NotImplementedException();
        }
    }
}
