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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9998958333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 81.78479166666658, 27, 557, 56.0, 167.0, 186.0, 251.0, 78.88120162363806, 271.53929269855877, 35.35788236840808], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 300, 0, 0.0, 53.93333333333332, 28, 301, 50.0, 74.0, 81.0, 108.98000000000002, 5.020248334950969, 5.446773339971217, 1.828664676696007], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 300, 0, 0.0, 47.30333333333334, 28, 116, 45.0, 62.900000000000034, 73.89999999999998, 87.93000000000006, 5.019324398935903, 24.224122245645738, 1.1077805802339005], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 300, 0, 0.0, 61.12999999999998, 37, 342, 55.0, 80.0, 94.0, 126.99000000000001, 5.022769890168765, 4.718656869474953, 1.7069569548620411], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 300, 0, 0.0, 58.1733333333333, 35, 359, 52.0, 77.0, 85.94999999999999, 105.98000000000002, 5.020584396023697, 4.951943593734311, 1.9219424641028215], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 300, 0, 0.0, 67.67333333333333, 29, 408, 53.0, 93.0, 220.34999999999985, 284.95000000000005, 5.020332346001306, 5.446864488679151, 1.0736843591545762], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 300, 0, 0.0, 47.67000000000003, 28, 121, 47.0, 66.0, 76.94999999999999, 98.94000000000005, 5.020332346001306, 24.228986771424267, 1.225667076660475], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 300, 0, 0.0, 176.0433333333332, 108, 557, 162.0, 233.7000000000001, 316.95, 422.9000000000001, 5.010856856522465, 34.32730551611826, 3.8804780148655422], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 300, 0, 0.0, 60.97333333333332, 36, 127, 56.0, 79.90000000000003, 89.94999999999999, 123.88000000000011, 5.049739938393173, 4.743993965560774, 1.7161225571883048], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 300, 0, 0.0, 47.236666666666665, 29, 102, 46.0, 62.0, 71.94999999999999, 100.96000000000004, 5.0533124463085555, 24.3881544039618, 1.1152818485016929], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 300, 0, 0.0, 53.44333333333335, 28, 272, 51.0, 74.0, 79.94999999999999, 113.99000000000001, 5.019324398935903, 5.896725831953019, 1.691080974250866], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 300, 0, 0.0, 156.55333333333334, 103, 311, 152.0, 189.90000000000003, 209.74999999999994, 250.97000000000003, 5.031530927143432, 34.46893501358513, 4.643356177881389], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 300, 0, 0.0, 46.96, 28, 98, 45.0, 62.900000000000034, 75.94999999999999, 82.98000000000002, 5.042271038875909, 24.334866673949946, 1.1128449753769099], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 300, 0, 0.0, 57.4533333333333, 36, 128, 52.0, 77.0, 86.94999999999999, 119.98000000000002, 5.04142369805233, 4.736181247584318, 1.7132963348849717], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 300, 0, 0.0, 162.53999999999994, 108, 500, 157.5, 202.7000000000001, 228.79999999999995, 270.99, 5.008681714972619, 34.312404522004805, 4.632052328202217], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 300, 0, 0.0, 159.4466666666667, 106, 487, 153.0, 195.90000000000003, 219.0, 261.99, 5.007511266900351, 34.98900694792189, 4.826575801201803], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 300, 0, 0.0, 52.023333333333326, 27, 125, 49.5, 71.0, 78.0, 117.98000000000002, 5.040915430242132, 5.46919633105372, 1.8263472896678037], "isController": false}]}, function(index, item){
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
