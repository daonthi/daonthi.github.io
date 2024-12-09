/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9979166666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.985, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 107.87187499999986, 26, 1072, 73.0, 216.0, 248.0, 417.90999999999804, 20.201850152776494, 69.5425017466183, 9.055321504027743], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 300, 0, 0.0, 73.33666666666669, 27, 389, 67.0, 101.90000000000003, 112.0, 323.63000000000034, 1.2700294223482844, 1.377932312723578, 0.4626181391952247], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 300, 0, 0.0, 60.3833333333333, 28, 187, 52.0, 82.0, 102.94999999999999, 121.95000000000005, 1.270454314462852, 6.131430880933022, 0.28039323737168415], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 300, 0, 0.0, 71.64666666666669, 39, 273, 69.0, 99.7000000000001, 122.89999999999998, 219.38000000000056, 1.2703305823618833, 1.1934160353829413, 0.4317139088495463], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 300, 0, 0.0, 76.72333333333329, 39, 313, 72.0, 108.0, 133.95, 289.3500000000006, 1.2698788958826293, 1.252517270352984, 0.48612551483006905], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 300, 0, 0.0, 91.14333333333339, 27, 557, 66.0, 213.0, 302.24999999999983, 427.8100000000002, 1.281810257900224, 1.3907140591085436, 0.27413715476577055], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 300, 0, 0.0, 60.56666666666665, 28, 198, 52.0, 86.0, 103.0, 121.92000000000007, 1.2700563058295584, 6.129510022861013, 0.3100723402904195], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 300, 0, 0.0, 233.22666666666666, 119, 1072, 200.5, 368.90000000000003, 477.5999999999999, 655.4800000000005, 1.2813667912439937, 8.778113320875601, 0.9923084623598505], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 300, 0, 0.0, 77.61333333333337, 39, 571, 71.0, 107.90000000000003, 137.89999999999998, 333.96000000000004, 1.2838179032686003, 1.2060867411566343, 0.4362974905639384], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 300, 0, 0.0, 64.24333333333328, 28, 159, 53.0, 97.90000000000003, 108.89999999999998, 120.99000000000001, 1.2841256388525053, 6.197411042196368, 0.2834105413873693], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 300, 0, 0.0, 79.13000000000005, 26, 380, 66.0, 103.90000000000003, 207.84999999999997, 368.7000000000003, 1.2700778134340365, 1.4920933687120566, 0.4279070758151783], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 300, 0, 0.0, 207.98666666666674, 119, 668, 194.0, 264.7000000000001, 316.95, 511.0900000000008, 1.2754505529078146, 8.737583621726875, 1.1770515356424656], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 300, 0, 0.0, 65.20999999999998, 26, 461, 54.0, 98.60000000000014, 110.94999999999999, 120.96000000000004, 1.2767696026692998, 6.161909547257499, 0.2817870412141228], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 300, 0, 0.0, 72.02333333333335, 41, 370, 70.0, 101.0, 131.95, 170.92000000000007, 1.2764871074802144, 1.1991998021444983, 0.4338061654327291], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 300, 0, 0.0, 205.55333333333346, 105, 514, 191.0, 274.0, 304.9, 465.6700000000003, 1.2692878871856925, 8.695365750593393, 1.1738433878562997], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 300, 0, 0.0, 216.61333333333337, 111, 679, 196.0, 296.0, 381.94999999999976, 535.8900000000001, 1.2693308510863357, 8.869201405783917, 1.2234663574435676], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 300, 0, 0.0, 70.55000000000005, 27, 313, 65.0, 97.0, 103.94999999999999, 252.94000000000005, 1.2759821872886654, 1.384390830154011, 0.4622943276211864], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
