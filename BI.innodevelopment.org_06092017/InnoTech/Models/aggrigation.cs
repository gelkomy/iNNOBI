using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace InnoTech.Models
{
    public class aggregation : IDisposable
    {
        #region Properties
        public string sRowIDs { get; set; }//for delete
        public bool bErrorOccurred { get; private set; }
        #endregion

        #region Attributes
        public string sCompanyID;
        public string sCompanyLicense; public string sRequesterUserName; public string sRequesterPassword; public string sRequesterControlID;
        private string sBranchId;
        private string sProductID;
        private string sWebserviceID;
        private string sSchemaID;
        private string sSchemaVersion;
        private string sPersonId;
        #endregion

        #region Constructor
        public aggregation()
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
            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID))
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