﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MediaLibrary.Intranet.Web.Models
{
    public class ReportQuery
    {
        public string SortOption { get; set; }
        public string PlanningArea { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Page { get; set; }
    }
    public class ActivityReport : ReportQuery
    {
        public int ActivityOption { get; set; }
        public string Email { get; set; }
    }

    public class FileReport : ReportQuery { }

    public class StaffQuery
    {
        public int Page { get; set; }
        public string SearchQuery { get; set; }
    }
}