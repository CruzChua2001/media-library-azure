using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Graph;

namespace MediaLibrary.Intranet.Web.Models
{
    public class GraphClient
    {
        public GraphServiceClient client { get; set; }
    }
}
