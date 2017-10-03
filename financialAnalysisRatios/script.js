/*
Fixed Assets --> الخصوم الثابتة
Current Assets --. الاصول المتداولة

Accounts Receivables  --> العملاء

خصوم طويلة الأجل Long-Term Liabilities 
الخصوم المتداولة Current Liabilities 

*/

var startDate = document.getElementById("dat").value.replace('-','').replace('-','');
var reqDate;

var Ratio;
var dictRatios={};


$(document).ready(function(){
    $('#dat').change(function(){
        startDate = this.value.replace('-','').replace('-','');        
    });
});


//$.getJSON("oneday.json", function(result){
 
function checkDates(){
	
	var currentAssets_dbtAmt = 0;
	var currentAssets_crdAmt=0;

	var currentLiabilities_dbtAmt=0;
	var currentLiabilities_crdAmt=0;

	var stocks_dbtAmt=0;
	var stocks_crdAmt=0;

	var customers_dbtAmt=0;
	var customers_crdAmt=0;

	var otherDebitAccounts_dbtAmt=0;
	var otherDebitAccounts_crdAmt=0;

	var receivables_dbtAmt=0;
	var receivables_crdAmt=0;

	var suppliers_dbtAmt=0;
	var suppliers_crdAmt=0;

	var payables_dbtAmt=0;
	var payables_crdAmt=0;

	var crdBalances_dbtAmt=0;
	var crdBalances_crdAmt=0;

	var fixedAssets_dbtAmt=0;
	var fixedAssets_crdAmt=0;

	var cash_dbtAmt=0;
	var cash_crdAmt=0;

	var shortTermInvest_dbtAmt=0;
	var shortTermInvest_crdAmt=0;
	
	var shortTermLoans_dbtAmt=0;
	var shortTermLoans_crdAmt=0;

	var fixedLiabilities_dbtAmt=0;
	var fixedLiabilities_crdAmt=0;

	var projectOwnersRights_dbtAmt=0;
	var projectOwnersRights_crdAmt=0;

	var	longTermLoans_dbtAmt=0;
	var longTermLoans_crdAmt=0;

	var prePaidExpenses_dbtAmt = 0;
	var prePaidExpenses_crdAmt=0;
	
	$.ajax({
		url: "http://localhost:2999/FinancialAnalysis",
		headers: { sCompanyID:'BI', sCompanyLicense:'97.74.205.13', sRequesterUserName:'admin', sRequesterPassword:'12#3', sDate: startDate},
		type: "GET",
		success: function(result) { 	
			$('#Button').removeAttr('disabled');

			reqDate = result["data"][0].runDate;		
			//1020040002
			for (var i in result["data"]) {
				if (result["data"][i].accNo.startsWith("102")){
					currentAssets_dbtAmt += Number(result["data"][i].dbtAmt);	
					currentAssets_crdAmt += Number(result["data"][i].crdAmt);	

					if (result["data"][i].accNo.startsWith("102007")){
						stocks_dbtAmt += Number(result["data"][i].dbtAmt);	
						stocks_crdAmt += Number(result["data"][i].crdAmt);		
					}
					else if (result["data"][i].accNo.startsWith("102001")){
						cash_dbtAmt += Number(result["data"][i].dbtAmt);	
						cash_crdAmt += Number(result["data"][i].crdAmt);		
					}
					else if (result["data"][i].accNo.startsWith("102003")){
						customers_dbtAmt += Number(result["data"][i].dbtAmt);	
						customers_crdAmt += Number(result["data"][i].crdAmt);		
					}
					else if (result["data"][i].accNo.startsWith("102004")){
						otherDebitAccounts_dbtAmt += Number(result["data"][i].dbtAmt);	
						otherDebitAccounts_crdAmt += Number(result["data"][i].crdAmt);

						if (result["data"][i].accNo.startsWith("1020040002")){
							prePaidExpenses_dbtAmt += Number(result["data"][i].dbtAmt);	
							prePaidExpenses_crdAmt += Number(result["data"][i].crdAmt);
						}		
					}
					else if (result["data"][i].accNo.startsWith("102002")){
						receivables_dbtAmt += Number(result["data"][i].dbtAmt);	
						receivables_crdAmt += Number(result["data"][i].crdAmt);		
					}
					else if (result["data"][i].accNo.startsWith("102008")){
						shortTermInvest_dbtAmt += Number(result["data"][i].dbtAmt);	
						shortTermInvest_crdAmt += Number(result["data"][i].crdAmt);		
					}	
				}
				
				else if (result["data"][i].accNo.startsWith("201")){
					fixedLiabilities_dbtAmt += Number(result["data"][i].dbtAmt);	
					fixedLiabilities_crdAmt += Number(result["data"][i].crdAmt);

					if (result["data"][i].accNo.startsWith("201001")){
						longTermLoans_dbtAmt += Number(result["data"][i].dbtAmt);	
						longTermLoans_crdAmt += Number(result["data"][i].crdAmt);		
					}					
				}

				else if (result["data"][i].accNo.startsWith("202")){
					currentLiabilities_dbtAmt += Number(result["data"][i].dbtAmt);	
					currentLiabilities_crdAmt += Number(result["data"][i].crdAmt);

					if (result["data"][i].accNo.startsWith("202001")){
						suppliers_dbtAmt += Number(result["data"][i].dbtAmt);	
						suppliers_crdAmt += Number(result["data"][i].crdAmt);		
					}
					else if (result["data"][i].accNo.startsWith("202002")){
						payables_dbtAmt += Number(result["data"][i].dbtAmt);	
						payables_crdAmt += Number(result["data"][i].crdAmt);		
					}
					else if (result["data"][i].accNo.startsWith("202003")){
						crdBalances_dbtAmt += Number(result["data"][i].dbtAmt);	
						crdBalances_crdAmt += Number(result["data"][i].crdAmt);
						
						if (result["data"][i].accNo.startsWith("2020030008")){
							shortTermLoans_dbtAmt += Number(result["data"][i].dbtAmt);	
							shortTermLoans_crdAmt += Number(result["data"][i].crdAmt);		
						}
					}

				}
				
				
				else if (result["data"][i].accNo.startsWith("101001")){
					fixedAssets_dbtAmt += Number(result["data"][i].dbtAmt);	
					fixedAssets_crdAmt += Number(result["data"][i].crdAmt);		
				}

				else if (result["data"][i].accNo.startsWith("501") || result["data"][i].accNo.startsWith("502") || result["data"][i].accNo.startsWith("503") || result["data"][i].accNo.startsWith("504")){
					projectOwnersRights_dbtAmt += Number(result["data"][i].dbtAmt);
					projectOwnersRights_crdAmt += Number(result["data"][i].crdAmt);
				}
			}

			dictRatios["نسبة التداول"] = (currentAssets_dbtAmt - currentAssets_crdAmt)-(currentLiabilities_dbtAmt - currentLiabilities_crdAmt);

			dictRatios["نسبة السيولة السريعة"] = ((currentAssets_dbtAmt - currentAssets_crdAmt) - (stocks_dbtAmt - stocks_crdAmt))/(currentLiabilities_dbtAmt - currentLiabilities_crdAmt);

			dictRatios["نسبة المخزون الى صافى  راس المال العامل"]=(stocks_dbtAmt - stocks_crdAmt)/dictRatios["نسبة التداول"];

			dictRatios["نسبة السيولة النقدية"] = currentAssets_dbtAmt - currentAssets_crdAmt - stocks_dbtAmt - stocks_crdAmt - prePaidExpenses_dbtAmt - prePaidExpenses_crdAmt;
			
			dictRatios["نسبة المدينون واوراق القبض الى صافى راس المال العامل "]=(customers_dbtAmt - customers_crdAmt + otherDebitAccounts_dbtAmt - otherDebitAccounts_crdAmt + receivables_dbtAmt - receivables_crdAmt) / dictRatios["نسبة التداول"];

			dictRatios["نسبة المدينون واوراق القبض الى الدائنون واوراق الدفع"]= (customers_dbtAmt - customers_crdAmt + otherDebitAccounts_dbtAmt - otherDebitAccounts_crdAmt + receivables_dbtAmt - receivables_crdAmt)/(suppliers_dbtAmt - suppliers_crdAmt + payables_dbtAmt - payables_crdAmt + crdBalances_dbtAmt - crdBalances_crdAmt);

			dictRatios["نسبة الاصول الثابتة الى المتداولة"] = (fixedAssets_dbtAmt- fixedAssets_crdAmt)/(currentAssets_dbtAmt - currentAssets_crdAmt);
			
			dictRatios["نسبة الاصول الثابتة الى حقوق اصحاب المشروع"] = (fixedAssets_dbtAmt - fixedAssets_crdAmt)/(projectOwnersRights_dbtAmt - projectOwnersRights_crdAmt);

			dictRatios["نسبة حقوق اصحاب المشروع الى الخصوم الثابتة"] = (projectOwnersRights_dbtAmt - projectOwnersRights_crdAmt)/(fixedLiabilities_dbtAmt - fixedLiabilities_crdAmt);

			dictRatios["نسبة المديونية قصيرة الاجل الى مجموع الاصول"] = (shortTermLoans_dbtAmt - shortTermLoans_crdAmt)/(fixedAssets_dbtAmt - fixedAssets_crdAmt + currentAssets_dbtAmt - currentAssets_crdAmt);
			
			dictRatios["نسبة المديونية طويلة الاجل الى مجموع الاصول"] = (longTermLoans_dbtAmt - longTermLoans_crdAmt)/ (fixedAssets_dbtAmt - fixedAssets_crdAmt + currentAssets_dbtAmt - currentAssets_crdAmt);

			dictRatios["نسبة المديونية طويلة و قصيرة الاجل الى مجموع الاصول "] = (longTermLoans_dbtAmt - longTermLoans_crdAmt + shortTermLoans_dbtAmt - shortTermLoans_crdAmt)/(fixedAssets_dbtAmt - fixedAssets_crdAmt + currentAssets_dbtAmt - currentAssets_crdAmt);
			
			GenerateTable(dictRatios);
		}
		

	});	
	
	
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
