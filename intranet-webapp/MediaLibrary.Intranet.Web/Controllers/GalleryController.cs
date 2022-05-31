using System;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Common;
using MediaLibrary.Intranet.Web.Models;
using MediaLibrary.Intranet.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;

namespace MediaLibrary.Intranet.Web.Controllers
{
    public class GalleryController : Controller
    {
        private readonly ILogger<GalleryController> _logger;
        private readonly ItemService _itemService;
        private readonly DashboardActivityService _dashboardActivityService;
        private readonly FileDetailsService _fileDetailsService;
        private MediaSearchService _mediaSearchService;

        public GalleryController(ILogger<GalleryController> logger, ItemService itemService, DashboardActivityService dashboardActivityService, MediaSearchService mediaSearchService, FileDetailsService fileDetailsService)
        {
            _logger = logger;
            _itemService = itemService;
            _dashboardActivityService = dashboardActivityService;
            _mediaSearchService = mediaSearchService;
            _fileDetailsService = fileDetailsService;
        }

        public IActionResult Index()
        {
            bool isAdmin = User.IsInRole(UserRole.Admin);
            ViewData["showDashboard"] = isAdmin;
            //await UpdateUploadActivity();
            //await UpdateFileDetails();

            return View();
        }

        public async Task<IActionResult> Item([BindRequired, FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return NotFound();
            }

            bool isAdmin = User.IsInRole(UserRole.Admin);

            // Get item info and check if user is author
            bool isAuthor = (await GetItemAuthorAsync(id)) == User.GetUserGraphEmail();

            ViewData["mediaId"] = id;
            ViewData["showAdminActions"] = isAdmin || isAuthor;
            ViewData["showDashboard"] = isAdmin;
            return View();
        }

        public async Task<IActionResult> Edit([BindRequired, FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return NotFound();
            }

            bool isAdmin = User.IsInRole(UserRole.Admin);

            // Get item info and check if user is author
            bool isAuthor = (await GetItemAuthorAsync(id)) == User.GetUserGraphEmail();

            if (isAdmin || isAuthor)
            {
                ViewData["mediaId"] = id;
                ViewData["showDashboard"] = isAdmin;
                return View();
            }
            else
            {
                return Forbid();
            }
        }

        private async Task<string> GetItemAuthorAsync(string id)
        {
            _logger.LogInformation("Getting item author details for id {id}", id);

            MediaItem item = await _itemService.GetItemAsync(id);

            return item?.Author;
        }

        private async Task UpdateUploadActivity()
        {
            var results = await _mediaSearchService.GetAllMediaItemsAsync();

            foreach(var result in results)
            {
                _dashboardActivityService.AddActivityForUpload(result.Items);
            }
        }

        private async Task UpdateFileDetails()
        {
            var results = await _mediaSearchService.GetAllMediaItemsAsync();

            foreach (var result in results)
            {
                await _fileDetailsService.AddDetailsForUpload(result.Items);
            }
        }
    }
}
