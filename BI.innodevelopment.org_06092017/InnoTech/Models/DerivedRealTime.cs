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
    public class DerivedRealTime : IDisposable
    {



        // DerivedRealTime.cs

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
        public string sFilter;
        #endregion

        #region Constructor
        public DerivedRealTime()
        {/*
            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "derived";
            
            sSchemaVersion = "1";
            sPersonId = "0";*/

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
            // Getting the new data from the vouchers 
            HttpResponseMessage response_msg = new HttpResponseMessage();
            Dictionary<string, int[]> dict = new Dictionary<string, int[]>();
            Dictionary<string, string> dictNames = new Dictionary<string, string>();

            string sStartDate = "20170702000000000";
            string sEndDate = "20170708110000000";
            sFilter = "{\"vDate\":{\"gte\":\"" + sStartDate + "\",\"lte\":\"" + sEndDate + "\"}}";
            sFilter = null;
            
            
            Dictionary<string, int[]> dictCurrentDerivedAccounts = new Dictionary<string, int[]>();
            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
            {
                             
               
                HttpResponseMessage objResponse = objRequestInterface.Get();
                var objResult = JObject.Parse(DecompressResult.DeflateByte(objResponse.Content.ReadAsByteArrayAsync().Result))["data"];
                //newVouchers = objResult["data"];

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
                            dict[sCrdAccId][0] += Int32.Parse(sVoucherDetailNetAmt);
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


                    JObject objDerived = new JObject
                    {
                        { "runDate", sEndDate.Substring(0,7) },
                        { "accNo", entry.Key },
                        { "accName", dictNames[entry.Key] },
                        { "dbtAmt", entry.Value[1] },
                        { "crdAmt", entry.Value[0] }
                    };
                    lstDerivedData.Add(objDerived);

                }
            

                /*
                foreach (var obj in objResultData)
                {
                    obj["netAmt"] = (float)obj["dbtAmt"] - (float)obj["crdAmt"];
                    obj["dbtAmt"].Parent.Remove();
                    obj["crdAmt"].Parent.Remove();
                }
                */
                //objResult["data"] = objResultData;

                //HttpResponseMessage response = new HttpResponseMessage();

               // response.Content = new ObjectContent<JObject>(objResult, GlobalConfiguration.Configuration.Formatters.JsonFormatter);

             //   return response;
            }



            //getting from the derived table
            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "derived";

            sSchemaVersion = "1";
            sPersonId = "0";

             sStartDate = "20170701";
             sEndDate = "20170702";
            sFilter = "{\"runDate\":{\"gte\":\"" + sStartDate + "\",\"lte\":\"" + sEndDate + "\"}}";
            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
            {
                var objResponse = objRequestInterface.Get();
                var objResult = JObject.Parse(DecompressResult.DeflateByte(objResponse.Content.ReadAsByteArrayAsync().Result));
                var currentDerivedAccounts = objResult["data"];
                var lstCurrentDerivedAccounts = currentDerivedAccounts.Children();
                
                
                foreach ( var obj in currentDerivedAccounts)
                {
                    if (!dictCurrentDerivedAccounts.ContainsKey(obj["accNo"].ToString()))
                    {
                        int[] value = { Int32.Parse(obj["crdAmt"].ToString()), Int32.Parse(obj["dbtAmt"].ToString()) } ;
                        dictCurrentDerivedAccounts.Add(obj["accNo"].ToString(), value);
                    }
                    else
                    {
                        dictCurrentDerivedAccounts[obj["accNo"].ToString()][0] += Int32.Parse(obj["crdAmt"].ToString());
                        dictCurrentDerivedAccounts[obj["accNo"].ToString()][1] += Int32.Parse(obj["dbtAmt"].ToString());
                    }
                }


                /*
                foreach (var obj in objResultData)
                {
                    obj["netAmt"] = (float)obj["dbtAmt"] - (float)obj["crdAmt"];
                    obj["dbtAmt"].Parent.Remove();
                    obj["crdAmt"].Parent.Remove();
                }
                */
                //objResult["data"] = objResultData;

                HttpResponseMessage response = new HttpResponseMessage();

                response.Content = new ObjectContent<JObject>(objResult, GlobalConfiguration.Configuration.Formatters.JsonFormatter);

                return response;
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
