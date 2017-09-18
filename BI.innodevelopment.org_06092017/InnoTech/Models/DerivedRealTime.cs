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
            Dictionary<string, float[]> dict = new Dictionary<string, float[]>();
            Dictionary<string, string> dictNames = new Dictionary<string, string>();
            List<JObject> lstDerivedData = new List<JObject>(); // recent transactions from vouchers
            Dictionary<string, float[]> dictCurrentDerivedAccounts = new Dictionary<string, float[]>(); // current accounts from the derived table
            Dictionary<string, string> dictCurrentDerivedAccountsRowID = new Dictionary<string,string>();// current accounts rowIDs to update
            HttpResponseMessage response = new HttpResponseMessage();

            List<JObject> lstUpdate = new List<JObject>(); // update list
            List<JObject> lstInsert = new List<JObject>(); // insert list


            // getting lastRunTimeStamp
            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "controlTable";
            sSchemaVersion = "1";
            sPersonId = "0";
            sFilter = null;

            string lastRunTimeStamp;
            string lastRunTimeStampRowID;

            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
            {
                HttpResponseMessage temp = objRequestInterface.Get();
                var json = JObject.Parse(DecompressResult.DeflateByte(temp.Content.ReadAsByteArrayAsync().Result))["data"];
                lastRunTimeStampRowID = json[0]["_rowID"].ToString();
                lastRunTimeStamp = json[0]["lastRunTimeStamp"].ToString();
            }


            // getting from vouchers
            sBranchId = "";
            sProductID = "innoPack";
            sWebserviceID = "SrvInnoPackAccounts";
            sSchemaID = "VoucherInsert";
            sSchemaVersion = "1";
            sPersonId = "";

            sFilter = null;


            string sStartDate = lastRunTimeStamp; //"20170702000000000";
            string currentTimeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string sEndDate = currentTimeStamp; //"20170708110000000";
            sFilter = "{\"vDate\":{\"gte\":\"" + sStartDate + "\",\"lte\":\"" + sEndDate + "\"}}";
            //sFilter = null;

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
                        { "runDate", sEndDate.Substring(0,8) },
                        { "accNo", entry.Key },
                         {"accType", accType },
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

            // sStartDate = "20170701";
            // sEndDate = "20170702";
            //sFilter = "{\"runDate\":{\"gte\":\"" + sStartDate + "\",\"lte\":\"" + sEndDate + "\"}}";
            sFilter = "{\"runDate\":\"" + currentTimeStamp.Substring(0,8) + "\"}";
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
                        float[] value = { float.Parse(obj["crdAmt"].ToString()), float.Parse(obj["dbtAmt"].ToString()) } ;
                        dictCurrentDerivedAccounts.Add(obj["accNo"].ToString(), value);
                        dictCurrentDerivedAccountsRowID.Add(obj["accNo"].ToString(), obj["_rowID"].ToString());
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

                

                response.Content = new ObjectContent<JObject>(objResult, GlobalConfiguration.Configuration.Formatters.JsonFormatter);


                
            }


            //******************************************************************************
            // comparing the accounts in the derived with the recently changed accounts from vouchers
            // lstDerivedData from vouchers
            // dictCurrentDerivedAccounts from the derived table
            
            foreach (JObject element in lstDerivedData)
            {
                string accNo = element["accNo"].ToString();

                if (dictCurrentDerivedAccounts.ContainsKey(accNo))
                {
                    // found so we need to update
                    
                    element.Add("_rowID", dictCurrentDerivedAccountsRowID[accNo]);
                    element["dbtAmt"] = float.Parse(element["dbtAmt"].ToString()) + dictCurrentDerivedAccounts[accNo][1];
                    element["crdAmt"] = float.Parse(element["crdAmt"].ToString()) + dictCurrentDerivedAccounts[accNo][0];
                    lstUpdate.Add(element);
                }
                else
                {
                    // not found so we need to insert
                    lstInsert.Add(element);

                }

            }


            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "derived";

            sSchemaVersion = "1";
            sPersonId = "0";

            // updating existing accounts
            if (lstUpdate.Count > 0)
            {
                using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, null, null))
                {
                     objRequestInterface.Put(lstUpdate);
                }
            }

            // inserting new accounts 
            if (lstInsert.Count > 0)
            {
                
                using (var objRequestInterface_derived = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, "1", "0", sProductID, "srvBI", "derived", sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID))
                {
                    objRequestInterface_derived.Post(lstInsert);

                }
            }



            // updating the last run date in the control table 
            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "controlTable";

            sSchemaVersion = "1";
            sPersonId = "0";

            
            sFilter = null;
            using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
            {
                

                JObject x = JObject.Parse("{\"_rowID\":\""+lastRunTimeStampRowID+"\",\"lastRunTimeStamp\":\""+ currentTimeStamp + "\"}");
                List<JObject> lstControlTable = new List<JObject>();
                lstControlTable.Add(x);
                

                 objRequestInterface.Put(lstControlTable);
            }




            sBranchId = "1";
            sProductID = "innoPack";
            sWebserviceID = "srvBI";
            sSchemaID = "derived";

            sSchemaVersion = "1";
            sPersonId = "0";
            sFilter = "{\"runDate\":\"" + DateTime.Now.ToString("yyyyMMddHHmmssfff").Substring(0, 8) + "\"}";

            // getting aggregates from the derived
        using (var objRequestInterface = new CommitLog.Controllers.Request(sCompanyID, sCompanyLicense, sBranchId, sPersonId, sProductID, sWebserviceID, sSchemaID, sSchemaVersion, sRequesterUserName, sRequesterPassword, sRequesterControlID, null, sFilter, null))
                {
                var objResponse = objRequestInterface.Get();
                var objResult = JObject.Parse(DecompressResult.DeflateByte(objResponse.Content.ReadAsByteArrayAsync().Result));
                var objResultData = objResult["data"];
                foreach (var obj in objResultData)
                {
                    obj["netAmt"] = (float)obj["dbtAmt"] - (float)obj["crdAmt"];
                    obj["dbtAmt"].Parent.Remove();
                    obj["crdAmt"].Parent.Remove();
                }
                //objResult["data"] = objResultData;
                 response = new HttpResponseMessage();

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
