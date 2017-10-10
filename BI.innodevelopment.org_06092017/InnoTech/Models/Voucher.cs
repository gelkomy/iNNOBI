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
            // getting the min value from the voucher schema
            // added by Gamal Elkomy 4/10/2017
            // getting from vouchers
            sBranchId = "";
            sProductID = "innoPack";
            sWebserviceID = "SrvInnoPackAccounts";
            sSchemaID = "VoucherInsert";
            sSchemaVersion = "1";
            sPersonId = "";

            sFilter = null;

            DateTime minvDate;


            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
            {


                HttpResponseMessage objResponse = objRequestInterface.Get();
                var objResult = JObject.Parse(BIParseResult.parse(objResponse))["data"];
                //newVouchers = objResult["data"];
                List<DateTime> lstvDate = new List<DateTime>();

                foreach (var objVoucher in objResult)
                {
                    string sVoucherNo = objVoucher["voucherNo"].ToString();
                    DateTime sVoucherDate = DateTime.ParseExact(objVoucher["vDate"].ToString(), "yyyyMMddHHmmssfff", CultureInfo.InvariantCulture);
                    lstvDate.Add(sVoucherDate);



                }
                minvDate = lstvDate.Min();
            }



            HttpResponseMessage response_msg = new HttpResponseMessage();
            Dictionary<string, double[]> dict = new Dictionary<string, double[]>();
            Dictionary<string, string> dictNames = new Dictionary<string, string>();
            // DateTime startDate = new DateTime(2016, 12, 31, 23, 59, 59, 0);
            DateTime startDate = minvDate;
            startDate = new DateTime(minvDate.Year, minvDate.Month, minvDate.Day, 23, 59, 59, 0);
            string sStartDate = startDate.ToString("yyyyMMdd");
           // DateTime endDate = new DateTime(2017, 10, 01, 23, 59, 59, 0);
            DateTime endDate = DateTime.Now;
            //endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 59, 0);
            string sEndDate = endDate.ToString("yyyyMMdd");
            string sDate;
            for (DateTime date = startDate; date.Date <= endDate.Date; date = date.AddDays(1))
            {
                sDate = date.ToString("yyyyMMddHHmmssfff");
                sFilter = "{'vDate':{'gt':" + date.AddDays(-1).ToString("yyyyMMddHHmmssfff") + ", 'lte':" + sDate + "}}";
                // sFilter = "{'vDate':{'gte':" + startDate.ToString("yyyyMMddHHmmssfff") + ", 'lte':" + endDate.ToString("yyyyMMddHHmmssfff") + "}}";
                using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID,null,sFilter,null))
                {
                    HttpResponseMessage objResponse = objRequestInterface.Get();
                    var objResult = JObject.Parse(BIParseResult.parse(objResponse))["data"];

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
                            double[] crd = new double[2];
                            crd[1] = 0; crd[0] = double.Parse(sVoucherDetailNetAmt);

                            if (!dict.ContainsKey(sCrdAccNo))
                                dict.Add(sCrdAccNo, crd);
                            else
                            {
                                dict[sCrdAccNo][0] += double.Parse(sVoucherDetailNetAmt);
                            }

                            // debit account

                            double[] dbt = new double[2];
                            dbt[0] = 0; dbt[1] = double.Parse(sVoucherDetailNetAmt);

                            if (!dict.ContainsKey(sDbtAccNo))
                                dict.Add(sDbtAccNo, dbt);
                            else
                            {
                                dict[sDbtAccNo][1] += double.Parse(sVoucherDetailNetAmt);
                            }



                            string sAmt = objAccounts["voucherDetailNetAmt"].ToString();
                        }
                    }
                    List<JObject> lstDerivedData = new List<JObject>();
                    foreach (KeyValuePair<string, double[]> entry in dict)
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

            // updating the last run date in the control table 
            // updating the controlTable to be an indication of the initial load of data in the derived table
            // added by Gamal 4/10/2017

            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "controlTable";

            sSchemaVersion = "1";
            sPersonId = "0";

            // getting lastRunTimeStamp
            
            sFilter = null;
            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
            {


                JObject x = JObject.Parse("{\"lastRunTimeStamp\":\"" + endDate.ToString("yyyyMMddHHmmssfff") + "\"}");
                List<JObject> lstControlTable = new List<JObject>();
                lstControlTable.Add(x);


                objRequestInterface.Post(lstControlTable);
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
