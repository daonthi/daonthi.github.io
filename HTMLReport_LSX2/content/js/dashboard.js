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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9840625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "AddLSX-1"], "isController": false}, {"data": [0.98, 500, 1500, "AddLSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-1"], "isController": false}, {"data": [0.995, 500, 1500, "AddLSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-0"], "isController": false}, {"data": [0.995, 500, 1500, "Receive_LSX-2"], "isController": false}, {"data": [0.945, 500, 1500, "AddLSX"], "isController": false}, {"data": [0.995, 500, 1500, "WorkOrder-1"], "isController": false}, {"data": [0.985, 500, 1500, "WorkOrder-0"], "isController": false}, {"data": [0.98, 500, 1500, "WorkOrder-2"], "isController": false}, {"data": [0.98, 500, 1500, "productDelivery_LSX"], "isController": false}, {"data": [0.93, 500, 1500, "WorkOrder"], "isController": false}, {"data": [0.995, 500, 1500, "productDelivery_LSX-2"], "isController": false}, {"data": [0.985, 500, 1500, "productDelivery_LSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-0"], "isController": false}, {"data": [0.985, 500, 1500, "Receive_LSX"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 0, 0.0, 116.34375000000004, 25, 1842, 65.0, 196.0, 297.9499999999998, 1024.990000000001, 50.30971920887966, 172.4729192214571, 22.765884900795523], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AddLSX-1", 100, 0, 0.0, 74.82000000000002, 39, 532, 54.0, 93.80000000000001, 122.24999999999983, 531.3299999999997, 3.2801941874958995, 3.087995309322312, 1.1211601226792627], "isController": false}, {"data": ["AddLSX-2", 100, 0, 0.0, 94.27, 25, 1335, 49.0, 85.0, 403.59999999999627, 1332.4899999999986, 3.283640901031063, 15.847415364155776, 0.7279164888027845], "isController": false}, {"data": ["Receive_LSX-1", 100, 0, 0.0, 69.00999999999999, 38, 488, 56.5, 89.0, 94.89999999999998, 486.14999999999907, 3.277184243298158, 3.0851617290424067, 1.1201313331585503], "isController": false}, {"data": ["AddLSX-0", 100, 0, 0.0, 80.72000000000001, 27, 617, 54.0, 135.9, 345.39999999999895, 614.7899999999988, 3.3233632436025258, 3.6187011881023596, 1.343625373878365], "isController": false}, {"data": ["Receive_LSX-0", 100, 0, 0.0, 70.27000000000001, 30, 408, 53.5, 94.50000000000003, 146.5999999999999, 407.81999999999994, 3.272893892779996, 3.563746768017281, 1.3360055148262093], "isController": false}, {"data": ["Receive_LSX-2", 100, 0, 0.0, 62.379999999999995, 27, 652, 50.0, 73.9, 94.59999999999991, 649.4799999999987, 3.2815935418239097, 15.83753445673219, 0.7274626308535425], "isController": false}, {"data": ["AddLSX", 100, 0, 0.0, 250.01999999999995, 113, 1808, 166.5, 289.1, 840.1499999999992, 1807.78, 3.2590275061921523, 22.345343868139746, 3.154000252574632], "isController": false}, {"data": ["WorkOrder-1", 100, 0, 0.0, 78.47000000000001, 40, 617, 56.5, 92.0, 288.7999999999995, 615.049999999999, 3.3280085197018106, 3.1330080205005326, 1.137502912007455], "isController": false}, {"data": ["WorkOrder-0", 100, 0, 0.0, 101.07999999999997, 30, 742, 57.5, 236.80000000000007, 390.1499999999996, 740.2999999999992, 3.2933737320511134, 3.586046593004874, 0.7075607627453563], "isController": false}, {"data": ["WorkOrder-2", 100, 0, 0.0, 99.41000000000001, 26, 1350, 51.5, 86.70000000000002, 118.74999999999972, 1348.089999999999, 3.332888948140248, 16.0850949040128, 0.7388337804959338], "isController": false}, {"data": ["productDelivery_LSX", 100, 0, 0.0, 200.13000000000002, 107, 1042, 165.0, 248.80000000000007, 373.84999999999883, 1039.6299999999987, 3.257328990228013, 22.33369808631922, 2.9392304560260585], "isController": false}, {"data": ["WorkOrder", 100, 0, 0.0, 279.13000000000005, 121, 1842, 169.0, 524.1000000000005, 1066.4499999999962, 1841.3699999999997, 3.2782585890375033, 22.477200735969053, 2.5515352494754784], "isController": false}, {"data": ["productDelivery_LSX-2", 100, 0, 0.0, 63.57000000000001, 26, 660, 48.0, 82.70000000000002, 96.89999999999998, 657.0799999999986, 3.278796026099216, 15.824033165021804, 0.7268424784419162], "isController": false}, {"data": ["productDelivery_LSX-1", 100, 0, 0.0, 77.48000000000002, 35, 632, 57.0, 90.80000000000001, 116.94999999999999, 631.8299999999999, 3.274287024000524, 3.0824342686879933, 1.119141072656429], "isController": false}, {"data": ["productDelivery_LSX-0", 100, 0, 0.0, 58.940000000000005, 28, 137, 54.0, 85.9, 112.04999999999978, 136.98, 3.2719301115728165, 3.5626973382848544, 1.1087497546052416], "isController": false}, {"data": ["Receive_LSX", 100, 0, 0.0, 201.79999999999998, 122, 925, 166.5, 256.8, 404.74999999999994, 924.5099999999998, 3.25743509560572, 22.334425592038826, 3.1651835157496984], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
