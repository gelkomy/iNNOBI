using Ionic.Zlib;
using System;
using System.IO;
using System.Net.Http;
using System.Text;

namespace InnoTech.Models
{
    public class BIParseResult
    {
        public static string parse(HttpResponseMessage objResponse)
        {
            return DecompressResult.DeflateByte(objResponse.Content.ReadAsByteArrayAsync().Result);
        }
    }
}