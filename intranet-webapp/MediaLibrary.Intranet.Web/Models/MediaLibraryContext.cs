using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MediaLibrary.Intranet.Web.Models
{
    public class MediaLibraryContext : DbContext
    {
        private readonly IConfiguration _config;
        public MediaLibraryContext(IConfiguration configuration)
        {
            _config = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = _config.GetConnectionString("MyConn");
            optionsBuilder.UseSqlServer(connectionString);
        }

        public DbSet<DashboardActivity> dashboardActivity { get; set; }
    }
}
