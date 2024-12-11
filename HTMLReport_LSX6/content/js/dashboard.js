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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9997916666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AddLSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-1"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-0"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-2"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "WorkOrder"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2400, 0, 0.0, 83.66291666666662, 26, 565, 57.0, 169.0, 191.94999999999982, 284.0, 77.96257796257797, 267.27307611096677, 35.27920855801715], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AddLSX-1", 150, 0, 0.0, 59.52666666666668, 36, 134, 54.0, 78.0, 93.34999999999997, 131.96000000000004, 5.098919029165817, 4.800154242300632, 1.7427945900469102], "isController": false}, {"data": ["AddLSX-2", 150, 0, 0.0, 48.82000000000001, 27, 99, 47.5, 70.70000000000002, 75.44999999999999, 96.45000000000005, 5.111777535441657, 24.67031697280534, 1.1331772466262269], "isController": false}, {"data": ["Receive_LSX-1", 150, 0, 0.0, 58.33333333333334, 38, 141, 53.5, 76.9, 89.44999999999999, 120.60000000000036, 5.107600108962136, 4.808326665077636, 1.7457617559929175], "isController": false}, {"data": ["AddLSX-0", 150, 0, 0.0, 55.78666666666666, 26, 159, 49.0, 79.9, 94.79999999999995, 156.45000000000005, 5.092514004413513, 5.5450714012901035, 2.058887497878119], "isController": false}, {"data": ["Receive_LSX-0", 150, 0, 0.0, 54.86666666666666, 26, 168, 48.5, 77.0, 88.44999999999999, 161.37000000000012, 5.095974180397485, 5.5488390733820285, 2.0801925853575676], "isController": false}, {"data": ["Receive_LSX-2", 150, 0, 0.0, 50.16000000000001, 28, 106, 49.0, 69.9, 77.0, 98.86000000000013, 5.1229508196721305, 24.724241162909834, 1.1356541367827868], "isController": false}, {"data": ["AddLSX", 150, 0, 0.0, 164.44666666666666, 102, 363, 158.0, 209.70000000000002, 237.69999999999993, 352.8000000000002, 5.063291139240507, 34.71617879746835, 4.9001186708860756], "isController": false}, {"data": ["WorkOrder-1", 150, 0, 0.0, 59.05333333333332, 36, 105, 54.0, 88.70000000000002, 93.44999999999999, 104.49000000000001, 5.1020408163265305, 4.803093112244898, 1.7438616071428572], "isController": false}, {"data": ["WorkOrder-0", 150, 0, 0.0, 67.8933333333333, 27, 404, 50.0, 103.80000000000001, 188.14999999999992, 367.79000000000065, 5.050675106905956, 5.49951439863295, 1.0851059799993266], "isController": false}, {"data": ["WorkOrder-2", 150, 0, 0.0, 46.68, 26, 79, 48.0, 64.9, 71.0, 77.47000000000003, 5.1102101999795595, 24.662752742479473, 1.132829800190781], "isController": false}, {"data": ["productDelivery_LSX", 150, 0, 0.0, 167.8533333333333, 107, 368, 162.0, 218.40000000000003, 246.89999999999998, 340.9700000000005, 5.085262908092348, 34.8668270290199, 4.588655202223955], "isController": false}, {"data": ["WorkOrder", 150, 0, 0.0, 173.96, 105, 565, 158.5, 236.9, 299.69999999999993, 509.920000000001, 5.023274505207461, 34.441806934630456, 3.909716582666354], "isController": false}, {"data": ["productDelivery_LSX-2", 150, 0, 0.0, 50.77333333333334, 27, 99, 48.5, 74.0, 78.0, 95.43000000000006, 5.135930973087722, 24.786885614257343, 1.1385315731356571], "isController": false}, {"data": ["productDelivery_LSX-1", 150, 0, 0.0, 60.85333333333333, 36, 163, 54.0, 83.9, 91.44999999999999, 150.25000000000023, 5.1203277009728625, 4.820308499743983, 1.7501120071684586], "isController": false}, {"data": ["productDelivery_LSX-0", 150, 0, 0.0, 55.92000000000005, 26, 152, 48.0, 80.60000000000002, 99.24999999999994, 148.43000000000006, 5.109687968388064, 5.563771567141299, 1.731505590850252], "isController": false}, {"data": ["Receive_LSX", 150, 0, 0.0, 163.67999999999995, 103, 375, 161.0, 207.40000000000003, 221.94999999999987, 341.8500000000006, 5.069280162216965, 34.757242205981754, 4.92571656387293], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
