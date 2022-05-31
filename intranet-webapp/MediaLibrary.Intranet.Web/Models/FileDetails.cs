using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Spatial;
using NetTopologySuite.Geometries;

namespace MediaLibrary.Intranet.Web.Models
{
    public class FileDetails
    {
        public string Id { get; set; }
        public string FileId { get; set; }
        public decimal FileSize { get; set; }
        public Point AreaPoint { get; set; }
        public string ThumbnailURL { get; set; }
    }
}
