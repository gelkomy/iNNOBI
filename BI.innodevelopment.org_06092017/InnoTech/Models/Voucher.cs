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
    public class Voucher : IDisposable
    {
        #region Properties
        public string sRowIDs { get; set; }//for delete
        public bool bErrorOccurred { get;private set; }
        #endregion

        #region Attributes
        public string sCompanyID;
        public string sCompanyLicense;public string sRequesterUserName;public string sRequesterPassword;public string sRequesterControlID;
        private string sBranchId;
        private string sProductID;
        private string sWebserviceID;
        private string sSchemaID;
        private string sSchemaVersion;
        private string sPersonId;
        #endregion

        #region Constructor
        public Voucher()
        {
            sBranchId = "";
            sProductID = "innoPack";
            sWebserviceID = "SrvInnoPackAccounts";
            sSchemaID = "VoucherInsert";
            sSchemaVersion = "1";
            sPersonId = "";
        }
        #endregion

        #region CRUD Operations
        public HttpResponseMessage Select()
        {
            Dictionary<string, int []> dict = new Dictionary<string, int[]>();
            Dictionary<string, string> dictNames = new Dictionary<string, string>();
            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID))
            {
                HttpResponseMessage objResponse = objRequestInterface.Get();
                var objResult = JObject.Parse(DecompressResult.DeflateByte(objResponse.Content.ReadAsByteArrayAsync().Result))["data"];

                foreach (var objVoucher in objResult)
                {
                    string sVoucherNo = objVoucher["voucherNo"].ToString();
                    DateTime sVoucherDate = DateTime.ParseExact(objVoucher["vDate"].ToString(), "yyyyMMddHHmmssfff", CultureInfo.InvariantCulture);

                    foreach (var objAccounts in objVoucher["Level1_1"])
                    {
                        string sDbtAccId = objAccounts["dbtAccId"].ToString();
                        string sDbtAccAName = objAccounts["dbtAccAName"].ToString();
                        string sDbtAccNo = objAccounts["dbtAccNo"].ToString();

                        string sCrdAccId = objAccounts["crdAccId"].ToString();
                        string sCrdAccAName = objAccounts["crdAccAName"].ToString();
                        string sCrdAccNo = objAccounts["crdAccNo"].ToString();

                        string sVoucherDetailNetAmt = objAccounts["voucherDetailNetAmt"].ToString();

                        // loging names
                        dictNames[sCrdAccId] = sCrdAccAName;
                        dictNames[sDbtAccId] = sDbtAccAName;

                        // credit account
                        int[] crd = new int[2];
                        crd[1] = 0; crd[0] = Int32.Parse(sVoucherDetailNetAmt);

                        if (!dict.ContainsKey(sCrdAccId))
                            dict.Add(sCrdAccId, crd);
                        else
                        {
                            dict[sCrdAccId][0]+= Int32.Parse(sVoucherDetailNetAmt);
                        }

                        // debit account
                        
                        int[] dbt = new int[2];
                        dbt[0] = 0; dbt[1] = Int32.Parse(sVoucherDetailNetAmt);

                        if (!dict.ContainsKey(sDbtAccId))
                            dict.Add(sDbtAccId, dbt);
                        else
                        {
                            dict[sDbtAccId][1] += Int32.Parse(sVoucherDetailNetAmt);
                        }


                        
                        string sAmt = objAccounts["voucherDetailNetAmt"].ToString();
                    }
                }
                List<JObject> lstDerivedData = new List<JObject>();
                foreach (KeyValuePair<string, int[]> entry in dict)
                {
                    // do something with entry.Value or entry.Key

                    
                    JObject objDerived = new JObject();
                    objDerived.Add("runDate", DateTime.Now.ToString("yyyyMMdd"));
                    objDerived.Add("accNo", entry.Key);
                    objDerived.Add("accName", dictNames[entry.Key]);
                    objDerived.Add("dbtAmt", entry.Value[1]);
                    objDerived.Add("crdAmt", entry.Value[0]);
                    lstDerivedData.Add(objDerived);
                    
                }
                using (var objRequestInterface_derived = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, "1", "0", sProductID, "srvBI", "derived", sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID))
                {
                    return objRequestInterface_derived.Post(lstDerivedData);
                }
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
