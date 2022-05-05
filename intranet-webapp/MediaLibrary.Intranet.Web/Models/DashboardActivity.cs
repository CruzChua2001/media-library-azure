using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MediaLibrary.Intranet.Web.Models
{
    public class DashboardActivity
    {
        public string Id { get; set; }
        public string FileId { get; set; }
        public string Email { get; set; }
        public DateTime ActivityDateTime { get; set; }
        public string Activity { get; set; }
    }
}
