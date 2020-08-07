﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MediaLibrary.Internet.Web.Models
{
    public class CoordinateObj
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
    }

    public class ImageObj
    {
        public string Name { get; set; }
        public DateTime DateTaken { get; set; }
        public CoordinateObj Location { get; set; }
        public List<string> Tag { get; set; }
        public DateTime UploadDate { get; set; }
        public string FileURL { get; set; }
    }
}