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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.99375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [0.9975, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [0.9925, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.9841666666666666, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [0.9841666666666666, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [0.9975, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9600, 0, 0.0, 73.53166666666667, 24, 3052, 41.0, 115.0, 133.0, 463.8299999999963, 212.99727097246566, 733.218144705021, 95.47436267222827], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 600, 0, 0.0, 40.331666666666656, 24, 2194, 32.0, 44.0, 57.849999999999795, 162.82000000000016, 13.684570646595963, 14.847224598015737, 4.984711768730756], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 600, 0, 0.0, 52.709999999999994, 25, 2242, 32.0, 46.0, 53.94999999999993, 493.920000000001, 13.706766573765249, 66.15121133549596, 3.0251262164755333], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 600, 0, 0.0, 53.34500000000005, 32, 2194, 43.0, 57.0, 63.0, 302.0400000000018, 13.70113262696383, 12.871571862440629, 4.656244291194739], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 600, 0, 0.0, 49.36333333333331, 31, 1207, 43.0, 59.0, 64.0, 89.94000000000005, 13.665558238054023, 13.47872443401813, 5.2313465130050565], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 600, 0, 0.0, 44.13166666666667, 24, 2191, 32.0, 47.0, 58.94999999999993, 377.9000000000001, 13.602974517094404, 14.758695984855356, 2.9092299016051513], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 600, 0, 0.0, 53.72000000000001, 24, 2607, 32.0, 46.0, 60.94999999999993, 355.0, 13.665246999339512, 65.9508307331405, 3.3362419431981234], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 600, 0, 0.0, 148.7999999999998, 86, 3024, 110.0, 146.0, 211.59999999999945, 1393.94, 13.560241372296426, 92.8955988541596, 10.501241609600651], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 600, 0, 0.0, 58.30166666666666, 30, 2187, 44.0, 59.0, 69.89999999999986, 397.8600000000001, 13.696753869332968, 12.8674582249007, 4.6547561977811265], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 600, 0, 0.0, 46.21999999999998, 24, 2588, 32.0, 45.0, 54.899999999999864, 361.85000000000014, 13.710525113111832, 66.16935069238151, 3.0259557378547597], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 600, 0, 0.0, 37.68833333333332, 25, 362, 32.0, 46.0, 56.94999999999993, 134.83000000000015, 13.677707616203525, 16.06863502177035, 4.60821203866232], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 600, 0, 0.0, 152.2933333333333, 83, 3052, 110.0, 145.0, 171.0, 2315.99, 13.643185228978124, 93.46381287234526, 12.590634806039382], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 600, 0, 0.0, 45.38833333333335, 24, 2243, 32.0, 46.89999999999998, 57.94999999999993, 384.7600000000002, 13.71334537060316, 66.18296173976641, 3.0265781774964005], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 600, 0, 0.0, 54.44999999999997, 30, 2177, 44.0, 59.0, 67.0, 385.99, 13.700506918755995, 12.870984038909441, 4.656031648170982], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 600, 0, 0.0, 146.5333333333334, 87, 3044, 110.0, 139.0, 173.89999999999986, 1671.4100000000005, 13.641944431813014, 93.45531268473466, 12.6161341571552], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 600, 0, 0.0, 140.91499999999976, 87, 2674, 111.0, 143.0, 167.8499999999998, 1385.7600000000048, 13.63264564209761, 95.25544879805507, 13.140059813232755], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 600, 0, 0.0, 52.315000000000005, 24, 2222, 32.0, 46.89999999999998, 58.0, 382.7800000000002, 13.68738023542294, 14.850272892143444, 4.959002018888585], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
