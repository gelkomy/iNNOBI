using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;

namespace InnoTech.Models
{
    public class FinancialAnalysis : IDisposable
    {
        #region Properties
        public string sRowIDs { get; set; }//for delete
        public bool bErrorOccurred { get; private set; }
        #endregion

        #region Attributes
        public string sCompanyID;
        public string sDate;
        public string sCompanyLicense; public string sRequesterUserName; public string sRequesterPassword; public string sRequesterControlID;
        private string sBranchId;
        private string sProductID;
        private string sWebserviceID;
        private string sSchemaID;
        private string sSchemaVersion;
        private string sPersonId;
        private string sFilter;
        #endregion

        #region Constructor
        public FinancialAnalysis()
        {
            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "derived";
            sSchemaVersion = "1";
            sPersonId = "0";
        }
        #endregion

        #region CRUD Operations
        public HttpResponseMessage Select()
        {
            sFilter = "{'runDate':'" + sDate + "'}";
            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
            {
                return objRequestInterface.Get();
            }
        }
        #endregion

        #region Dispose
        bool disposed = false;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;
            if (disposing)
            {
            }
            disposed = true;
        }
        #endregion
    }
}
