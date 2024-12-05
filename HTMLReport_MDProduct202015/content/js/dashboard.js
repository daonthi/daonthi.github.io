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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.997948717948718, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "Sản phẩm_Add"], "isController": false}, {"data": [0.995, 500, 1500, "Sản phẩm_Xóa"], "isController": false}, {"data": [0.995, 500, 1500, "Sản phẩm_Xóa-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Sản phẩm_View"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Sản phẩm_Update"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Sản phẩm_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Sản phẩm_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Sản phẩm_Update-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3900, 0, 0.0, 76.52743589743595, 27, 1176, 49.0, 136.0, 159.0, 263.91999999999825, 130.8637004227904, 452.67515602979665, 50.35185348298772], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Sản phẩm_Add", 300, 0, 0.0, 142.7499999999999, 90, 1162, 122.0, 176.0, 198.95, 1099.1800000000062, 10.460251046025103, 50.48296940376569, 2.0225876046025104], "isController": false}, {"data": ["Sản phẩm_Xóa", 300, 0, 0.0, 144.20000000000005, 97, 1171, 125.0, 174.90000000000003, 204.79999999999995, 1141.1100000000063, 10.451140916216687, 69.67767483887825, 7.8689742640654945], "isController": false}, {"data": ["Sản phẩm_Xóa-2", 300, 0, 0.0, 50.34999999999999, 27, 1091, 37.0, 53.0, 60.94999999999999, 1040.7800000000084, 10.509721492380452, 50.72172228060956, 2.299001576458224], "isController": false}, {"data": ["Sản phẩm_View", 300, 0, 0.0, 144.4166666666666, 93, 681, 127.0, 194.5000000000005, 247.74999999999994, 441.98, 10.375955452564591, 71.44615419534465, 8.278472270259053], "isController": false}, {"data": ["Sản phẩm_Xóa-0", 300, 0, 0.0, 41.92, 28, 141, 38.0, 53.900000000000034, 70.0, 99.90000000000009, 10.511194422059493, 9.515505106688623, 2.94600859290144], "isController": false}, {"data": ["Sản phẩm_Update", 300, 0, 0.0, 137.5966666666667, 94, 1176, 124.0, 165.60000000000014, 195.89999999999998, 296.93000000000006, 10.456605088881142, 68.16195211746253, 8.924875827814569], "isController": false}, {"data": ["Sản phẩm_Xóa-1", 300, 0, 0.0, 51.81333333333335, 34, 305, 49.0, 67.0, 75.94999999999999, 108.98000000000002, 10.499422531760754, 9.82270193889336, 2.6658690022048788], "isController": false}, {"data": ["Sản phẩm_View-0", 300, 0, 0.0, 53.26000000000001, 27, 588, 39.0, 64.0, 159.95, 305.8000000000002, 10.44022968505307, 11.57193427005394, 2.293995780407169], "isController": false}, {"data": ["Sản phẩm_View-1", 300, 0, 0.0, 51.16666666666668, 35, 300, 47.5, 66.7000000000001, 76.94999999999999, 105.95000000000005, 10.55260473460199, 10.037340831545254, 3.7099001020085125], "isController": false}, {"data": ["Sản phẩm_View-2", 300, 0, 0.0, 39.90666666666668, 27, 85, 37.0, 53.0, 60.849999999999966, 78.99000000000001, 10.56338028169014, 50.980688820422536, 2.3932658450704225], "isController": false}, {"data": ["Sản phẩm_Update-0", 300, 0, 0.0, 43.88666666666667, 27, 997, 37.5, 51.0, 61.94999999999999, 143.91000000000008, 10.509353324458768, 8.487534374343166, 4.76205072514538], "isController": false}, {"data": ["Sản phẩm_Update-1", 300, 0, 0.0, 50.05333333333332, 32, 118, 47.0, 68.90000000000003, 76.0, 97.99000000000001, 10.525577152480528, 9.312668847800154, 2.1791233948494844], "isController": false}, {"data": ["Sản phẩm_Update-2", 300, 0, 0.0, 43.536666666666655, 27, 1077, 36.0, 53.0, 65.94999999999999, 84.0, 10.524838619141175, 50.79468013261297, 2.035076217373], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
