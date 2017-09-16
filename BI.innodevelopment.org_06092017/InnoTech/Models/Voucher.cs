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
        public string sCompanyLicense;
        public string sRequesterUserName;public string sRequesterPassword;public string sRequesterControlID;
        private string sBranchId;
        private string sProductID;
        private string sWebserviceID;
        private string sSchemaID;
        private string sSchemaVersion;
        private string sPersonId;
        private string sFilter;
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
            HttpResponseMessage response_msg = new HttpResponseMessage();
            Dictionary<string, float[]> dict = new Dictionary<string, float[]>();
            Dictionary<string, string> dictNames = new Dictionary<string, string>();
            DateTime startDate = new DateTime(2016, 8, 25, 23, 59, 59, 0);
            string sStartDate = startDate.ToString("yyyyMMdd");
            DateTime endDate = new DateTime(2017, 7, 1, 23, 59, 59, 0);
            string sEndDate = endDate.ToString("yyyyMMdd");
            sFilter = "{'vDate':{'gte':" + sStartDate + ",'lte':"+ sEndDate +"}}";
            for (DateTime date = startDate; date.Date <= endDate.Date; date = date.AddDays(1))
            {
                                
                using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID,sFilter))
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
                            dictNames[sCrdAccNo] = sCrdAccAName;
                            dictNames[sDbtAccNo] = sDbtAccAName;

                            // credit account
                            float[] crd = new float[2];
                            crd[1] = 0; crd[0] = float.Parse(sVoucherDetailNetAmt);

                            if (!dict.ContainsKey(sCrdAccNo))
                                dict.Add(sCrdAccNo, crd);
                            else
                            {
                                dict[sCrdAccNo][0] += float.Parse(sVoucherDetailNetAmt);
                            }

                            // debit account

                            float[] dbt = new float[2];
                            dbt[0] = 0; dbt[1] = float.Parse(sVoucherDetailNetAmt);

                            if (!dict.ContainsKey(sDbtAccNo))
                                dict.Add(sDbtAccNo, dbt);
                            else
                            {
                                dict[sDbtAccNo][1] += float.Parse(sVoucherDetailNetAmt);
                            }



                            string sAmt = objAccounts["voucherDetailNetAmt"].ToString();
                        }
                    }
                    List<JObject> lstDerivedData = new List<JObject>();
                    foreach (KeyValuePair<string, float[]> entry in dict)
                    {
                        // do something with entry.Value or entry.Key

                        string accType = "0";
                        if (entry.Key.StartsWith("102003"))
                        {
                            accType = "1"; // customer
                        }
                        else if (entry.Key.StartsWith("202001"))
                        {
                            accType = "2"; // supplier
                        }


                        JObject objDerived = new JObject
                    {
                        { "runDate", date.ToString("yyyyMMdd") },
                        { "accNo", entry.Key },
                        {"accType", accType },
                        { "accName", dictNames[entry.Key] },
                        { "dbtAmt", entry.Value[1] },
                        { "crdAmt", entry.Value[0] }
                    };
                        lstDerivedData.Add(objDerived);

                    }
                    using (var objRequestInterface_derived = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, "1", "0", sProductID, "srvBI", "derived", sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID))
                    {
                        response_msg = objRequestInterface_derived.Post(lstDerivedData);
                    }
                    
                }
            }
            return response_msg;
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
