using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediaLibrary.Intranet.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace MediaLibrary.Intranet.Web.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            bool isAdmin = User.IsInRole(UserRole.Admin);

            if (isAdmin)
            {
                return View();
            }
            else
            {
                return Forbid();
            }
        }
    }
}
