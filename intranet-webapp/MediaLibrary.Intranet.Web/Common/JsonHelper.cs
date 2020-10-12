﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MediaLibrary.Intranet.Web.Common
{
    public static class JsonHelper
    {
        public static T ReadJsonFromFile<T>(string jsonPath)
        {
            using (FileStream fs = File.OpenRead(jsonPath))
            {
                return ReadJsonFromStream<T>(fs);
            }
        }

        public static T ReadJsonFromStream<T>(Stream jsonStream)
        {
            using (var sr = new StreamReader(jsonStream))
            using (var jr = new JsonTextReader(sr))
            { 
                return JsonSerializer.CreateDefault().Deserialize<T>(jr);
            }
        }
    }
}