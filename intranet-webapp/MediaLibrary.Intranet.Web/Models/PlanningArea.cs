using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NetTopologySuite.Geometries;

namespace MediaLibrary.Intranet.Web.Models
{
    public class PlanningArea
    {
        public int Id { get; set; }
        public Geometry AreaPolygon { get; set; }
        public string PlanningAreaName { get; set; }
        public int RegionId { get; set; }
    }
}
