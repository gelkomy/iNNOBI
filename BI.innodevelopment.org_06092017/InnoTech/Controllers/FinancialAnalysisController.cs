using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using InnoTech.Models;
namespace HR.Controllers
{
    public class FinancialAnalysisController : ApiController
    {
        [HttpGet]
        [DeflateCompression]
        public HttpResponseMessage Get()
        {
            DateTime dtStart = DateTime.Now;
            try
            {
                var sCompanyID = HttpContext.Current.Request.Headers["sCompanyID"];
                var sCompanyLicense = HttpContext.Current.Request.Headers["sCompanyLicense"];
                string sRequesterUserName = HttpContext.Current.Request.Headers["sRequesterUserName"];
                string sRequesterPassword = HttpContext.Current.Request.Headers["sRequesterPassword"];
                string sDate = HttpContext.Current.Request.Headers["sDate"];
                string sRequesterControlID = "ModInnoPackAccounts";

                if (string.IsNullOrEmpty(sCompanyID) || string.IsNullOrEmpty(sCompanyLicense) || string.IsNullOrEmpty(sDate))
                {
                    Response _Response = new Response() { success = "false", errorCode = "err-21", message = "Incomplete header parameters", servermls = (DateTime.Now - dtStart).TotalMilliseconds.ToString(), data = "" };
                    return Request.CreateResponse(HttpStatusCode.Unauthorized, _Response, "application/json");
                }
                using (var objModel = new FinancialAnalysis() { sCompanyID = sCompanyID, sDate = sDate, sCompanyLicense = sCompanyLicense, sRequesterUserName = sRequesterUserName, sRequesterPassword = sRequesterPassword, sRequesterControlID = sRequesterControlID })
                {
                    return objModel.Select();
                }
            }
            catch (Exception ex)
            {
                Response _Response = new Response() { success = "false", errorCode = "err-61", message = ex.Message, servermls = (DateTime.Now - dtStart).TotalMilliseconds.ToString(), data = "" };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, _Response, "application/json");
            }
        }
    }
}
