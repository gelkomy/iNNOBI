/*
Fixed Assets --> الخصوم الثابتة
Current Assets --. الاصول المتداولة

Accounts Receivables  --> العملاء

خصوم طويلة الأجل Long-Term Liabilities 
الخصوم المتداولة Current Liabilities 

*/

var startDate = document.getElementById("dat").value.replace('-','').replace('-','');
var endDate = document.getElementById("dat2").value.replace('-','').replace('-','');


var Ratio;
var dictRatios={};


$(document).ready(function(){
    $('#dat').change(function(){
        startDate = this.value.replace('-','').replace('-','');        
    });
    $('#dat2').change(function(){
        endDate = this.value.replace('-','').replace('-','');
    });

});


//$.getJSON("oneday.json", function(result){
 
function calcRatios(){
	
		
	$.ajax({
		url: "http://localhost:2999/FinancialAnalysis",
		headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3', sDate: endDate},
		type: "GET",
		success: function(result) { 	
			$('#Button').removeAttr('disabled');		

			dAccVarsEnd = calcAccVars(result);
			$.ajax({
				url: "http://localhost:2999/FinancialAnalysis",
				headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3', sDate: startDate},
				type: "GET",
				success: function(result) {
					dAccVarsStart = calcAccVars(result);

					
					for (i in dAccVarsEnd){
						dAccVars[i] -= dAccVarsStart[i];
					}
					
					
					dAccVars["salesCost_dbtAmt"] = dAccVarsStart["stocks_dbtAmt"] + dAccVars[""]

					//*******
					dictRatios["نسبة الربح الاجمالى"] = (dAccVars["longTermLoans_dbtAmt"] - dAccVars["longTermLoans_crdAmt"] + dAccVars["shortTermLoans_dbtAmt"] - dAccVars["shortTermLoans_crdAmt"])/(dAccVars["fixedAssets_dbtAmt"] - dAccVars["fixedAssets_crdAmt"] + dAccVars["currentAssets_dbtAmt"] - dAccVars["currentAssets_crdAmt"]);
					GenerateTable(dictRatios);
				}
			});			
		}
		

	});
	
	
}


function calcAccVars(result){
	var dAccVars = {};
	dAccVars["currentAssets_dbtAmt"] = 0;
	dAccVars["currentAssets_crdAmt"]=0;

	dAccVars["currentLiabilities_dbtAmt"]=0;
	dAccVars["currentLiabilities_crdAmt"]=0;

	dAccVars["stocks_dbtAmt"]=0;
	dAccVars["stocks_crdAmt"]=0;

	dAccVars["customers_dbtAmt"]=0;
	dAccVars["customers_crdAmt"]=0;

	dAccVars["otherDebitAccounts_dbtAmt"]=0;
	dAccVars["otherDebitAccounts_crdAmt"]=0;

	dAccVars["receivables_dbtAmt"]=0;
	dAccVars["receivables_crdAmt"]=0;

	dAccVars["suppliers_dbtAmt"]=0;
	dAccVars["suppliers_crdAmt"]=0;

	dAccVars["payables_dbtAmt"]=0;
	dAccVars["payables_crdAmt"]=0;

	dAccVars["crdBalances_dbtAmt"]=0;
	dAccVars["crdBalances_crdAmt"]=0;

	dAccVars["fixedAssets_dbtAmt"]=0;
	dAccVars["fixedAssets_crdAmt"]=0;

	dAccVars["cash_dbtAmt"]=0;
	dAccVars["cash_crdAmt"]=0;

	dAccVars["shortTermInvest_dbtAmt"]=0;
	dAccVars["shortTermInvest_crdAmt"]=0;
	
	dAccVars["shortTermLoans_dbtAmt"]=0;
	dAccVars["shortTermLoans_crdAmt"]=0;

	dAccVars["fixedLiabilities_dbtAmt"]=0;
	dAccVars["fixedLiabilities_crdAmt"]=0;

	dAccVars["projectOwnersRights_dbtAmt"]=0;
	dAccVars["projectOwnersRights_crdAmt"]=0;

	dAccVars["longTermLoans_dbtAmt"]=0;
	dAccVars["longTermLoans_crdAmt"]=0;

	dAccVars["netSales_dbtAmt"] = 0;
	dAccVars["netSales_crdAmt"] = 0; 
	
	// dAccVars["grossProfit_dbtAmt"] = 0;
	// dAccVars["grossProfit_crdAmt"] = 0; 
	
	// dAccVars["salesCost_dbtAmt"] = 0;
	// dAccVars["salesCost_crdAmt"] = 0; 
	
	
	dAccVars["Purchase_dbtAmt"] = 0;
	dAccVars["Purchase_crdAmt"] = 0; 
	
	dAccVars["salesExpenses_dbtAmt"] = 0;
	dAccVars["salesExpenses_crdAmt"] = 0; 
	
	dAccVars["generalAndAdministrativeExpenses_dbtAmt"] = 0;
	dAccVars["generalAndAdministrativeExpenses_crdAmt"] = 0; 
	
	dAccVars["depreciation_dbtAmt"] = 0;
	dAccVars["depreciation_crdAmt"] = 0; 
	
	dAccVars["rent_dbtAmt"] = 0;
	dAccVars["rent_crdAmt"] = 0; 
	
	dAccVars["equityCapital_dbtAmt"] = 0;
	dAccVars["equityCapital_crdAmt"] = 0; 
	
	dAccVars["propertyRights_dbtAmt"] = 0;
	dAccVars["propertyRights_crdAmt"] = 0; 
	
	dAccVars["futureNetPurchase_dbtAmt"] = 0;
	dAccVars["futureNetPurchase_crdAmt"] = 0;
	
	for (var i in result["data"]) {
		if (result["data"][i].accNo.startsWith("101001")){
			dAccVars["fixedAssets_dbtAmt"] += Number(result["data"][i].dbtAmt);	
			dAccVars["fixedAssets_crdAmt"] += Number(result["data"][i].crdAmt);		
		}

		else if (result["data"][i].accNo.startsWith("102")){
			dAccVars["currentAssets_dbtAmt"] += Number(result["data"][i].dbtAmt);	
			dAccVars["currentAssets_crdAmt"] += Number(result["data"][i].crdAmt);	

			if (result["data"][i].accNo.startsWith("102007")){
				dAccVars["stocks_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["stocks_crdAmt"] += Number(result["data"][i].crdAmt);		
			}
			else if (result["data"][i].accNo.startsWith("102001")){
				dAccVars["cash_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["cash_crdAmt"] += Number(result["data"][i].crdAmt);		
			}
			else if (result["data"][i].accNo.startsWith("102003")){
				dAccVars["customers_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["customers_crdAmt"] += Number(result["data"][i].crdAmt);		
			}
			else if (result["data"][i].accNo.startsWith("102004")){
				dAccVars["otherDebitAccounts_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["otherDebitAccounts_crdAmt"] += Number(result["data"][i].crdAmt);		
			}
			else if (result["data"][i].accNo.startsWith("102002")){
				dAccVars["receivables_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["receivables_crdAmt"] += Number(result["data"][i].crdAmt);		
			}
			else if (result["data"][i].accNo.startsWith("102008")){
				dAccVars["shortTermInvest_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["shortTermInvest_crdAmt"] += Number(result["data"][i].crdAmt);		
			}	
		}
		
		else if (result["data"][i].accNo.startsWith("201")){
			dAccVars["fixedLiabilities_dbtAmt"] += Number(result["data"][i].dbtAmt);	
			dAccVars["fixedLiabilities_crdAmt"] += Number(result["data"][i].crdAmt);

			if (result["data"][i].accNo.startsWith("201001")){
				dAccVars["longTermLoans_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["longTermLoans_crdAmt"] += Number(result["data"][i].crdAmt);		
			}					
		}

		else if (result["data"][i].accNo.startsWith("202")){
			dAccVars["currentLiabilities_dbtAmt"] += Number(result["data"][i].dbtAmt);	
			dAccVars["currentLiabilities_crdAmt"] += Number(result["data"][i].crdAmt);

			if (result["data"][i].accNo.startsWith("202001")){
				dAccVars["suppliers_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["suppliers_crdAmt"] += Number(result["data"][i].crdAmt);		
			}
			else if (result["data"][i].accNo.startsWith("202002")){
				dAccVars["payables_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["payables_crdAmt"] += Number(result["data"][i].crdAmt);		
			}
			else if (result["data"][i].accNo.startsWith("202003")){
				dAccVars["crdBalances_dbtAmt"] += Number(result["data"][i].dbtAmt);	
				dAccVars["crdBalances_crdAmt"] += Number(result["data"][i].crdAmt);
				
				if (result["data"][i].accNo.startsWith("2020030008")){
					dAccVars["shortTermLoans_dbtAmt"] += Number(result["data"][i].dbtAmt);	
					dAccVars["shortTermLoans_crdAmt"] += Number(result["data"][i].crdAmt);		
				}
			}

		}
		
		else if(result["data"][i].accNo.startsWith("301")){
			dAccVars["generalAndAdministrativeExpenses_dbtAmt"] += Number(result["data"][i].dbtAmt);
			dAccVars["generalAndAdministrativeExpenses_crdAmt"] += Number(result["data"][i].crdAmt);

			if(result["data"][i].accNo.startsWith("301024")){
				dAccVars["rent_dbtAmt"] += Number(result["data"][i].dbtAmt);
				dAccVars["rent_crdAmt"] += Number(result["data"][i].crdAmt);
			}
		}

		else if(result["data"][i].accNo.startsWith("302")){
			dAccVars["salesExpenses_dbtAmt"] += Number(result["data"][i].dbtAmt);
			dAccVars["salesExpenses_crdAmt"] += Number(result["data"][i].crdAmt);

			if(result["data"][i].accNo.startsWith("302007")){
				dAccVars["rent_dbtAmt"] += Number(result["data"][i].dbtAmt);
				dAccVars["rent_crdAmt"] += Number(result["data"][i].crdAmt);
			}
		}

		else if(result["data"][i].accNo.startsWith("303")){
			dAccVars["depreciation_dbtAmt"] += Number(result["data"][i].dbtAmt);
			dAccVars["depreciation_crdAmt"] += Number(result["data"][i].crdAmt);
		}

		else if(result["data"][i].accNo.startsWith("401001")){
			dAccVars["netSales_dbtAmt"] += Number(result["data"][i].dbtAmt);
			dAccVars["netSales_crdAmt"] += Number(result["data"][i].crdAmt);
		}

		else if(result["data"][i].accNo.startsWith("401002")){
			dAccVars["netSales_dbtAmt"] -= Number(result["data"][i].dbtAmt);
			dAccVars["netSales_crdAmt"] -= Number(result["data"][i].crdAmt);
		}

		else if(result["data"][i].accNo.startsWith("401003")){
			dAccVars["netSales_dbtAmt"] -= Number(result["data"][i].dbtAmt);
			dAccVars["netSales_crdAmt"] -= Number(result["data"][i].crdAmt);
		} 

		else if(result["data"][i].accNo.startsWith("5")){
			dAccVars["propertyRights_dbtAmt"] -= Number(result["data"][i].dbtAmt);
			dAccVars["propertyRights_crdAmt"] -= Number(result["data"][i].crdAmt);
			

			if(result["data"][i].accNo.startsWith("501")){
				dAccVars["equityCapital_dbtAmt"] -= Number(result["data"][i].dbtAmt);
				dAccVars["equityCapital_crdAmt"] -= Number(result["data"][i].crdAmt);
			}							

			else if (result["data"][i].accNo.startsWith("501") || result["data"][i].accNo.startsWith("502") || result["data"][i].accNo.startsWith("503") || result["data"][i].accNo.startsWith("504")){
				dAccVars["projectOwnersRights_dbtAmt"] += Number(result["data"][i].dbtAmt);
				dAccVars["projectOwnersRights_crdAmt"] += Number(result["data"][i].crdAmt);
			}
		}

	}
	return dAccVars;
}

function GenerateTable(dictRatios) {
    // Create table.
    var table = document.createElement('table');
    // Apply CSS for table
    table.setAttribute('class', 'article');
    table.setAttribute('dir', 'rtl');
    // Insert New Row for table at index '0'.
    var row1 = table.insertRow(0);
    // Insert New Column for Row1 at index '0'.
    var row1col1 = row1.insertCell(0);
    row1col1.innerHTML = 'النسبة';
    // Insert New Column for Row1 at index '1'.
    var row1col2 = row1.insertCell(1);
    row1col2.innerHTML = 'القيمة';
    
    var idx = 1;
    for( i in dictRatios){
        var row= table.insertRow(idx);

        row.insertCell(0).innerHTML=i;
        row.insertCell(1).innerHTML=dictRatios[i];
        idx+=1;
    }
 
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}
