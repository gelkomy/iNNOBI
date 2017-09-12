using Ionic.Zlib;
using System;
using System.IO;
using System.Text;

namespace InnoTech.Models
{
    public class DecompressResult
    {
        public static string DeflateByte(byte[] str)
        {
            if (str == null)
            {
                return null;
            }

            using (var output = new MemoryStream())
            {
                using (var compressor = new Ionic.Zlib.DeflateStream(output, Ionic.Zlib.CompressionMode.Decompress, Ionic.Zlib.CompressionLevel.BestSpeed))
                {
                    compressor.Write(str, 0, str.Length);
                }

                return Encoding.UTF8.GetString(output.ToArray());
            }
        }
    }
}