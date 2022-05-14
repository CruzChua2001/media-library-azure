using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Microsoft.SqlServer.Types;
using NetTopologySuite.Geometries;
using Newtonsoft.Json;

namespace MediaLibrary.Intranet.Web.Models
{
    public class PlanningArea
    {
        public int Id { get; set; }
        [JsonIgnore]
        public Polygon AreaPolygon { get; set; }
        public string PlanningAreaName { get; set; }
        public int RegionId { get; set; }
    }
}
