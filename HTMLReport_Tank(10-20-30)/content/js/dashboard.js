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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9981944444444445, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ViewMD_Bể-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Add_Bể"], "isController": false}, {"data": [0.99, 500, 1500, "Update_Bể"], "isController": false}, {"data": [0.995, 500, 1500, "ViewMD_Bể"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Add_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "ViewMD_Bể-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Update_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "ViewMD_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 0, 0.0, 75.74638888888872, 24, 803, 48.0, 149.0, 172.94999999999982, 346.97999999999956, 100.63455678863947, 345.5873231906745, 44.322446398121485], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ViewMD_Bể-0", 300, 0, 0.0, 52.05666666666667, 24, 390, 43.0, 71.0, 132.79999999999995, 243.95000000000005, 8.556759840273816, 9.384024707644038, 1.8550787934968624], "isController": false}, {"data": ["Add_Bể", 300, 0, 0.0, 147.79333333333344, 89, 803, 135.5, 188.0, 233.44999999999987, 498.1200000000008, 8.582708702866624, 58.94745147193454, 7.970855445728672], "isController": false}, {"data": ["Update_Bể", 300, 0, 0.0, 155.11333333333323, 85, 740, 133.0, 210.80000000000007, 285.95, 546.8800000000001, 8.577310155535224, 58.910373363163316, 7.957465476326624], "isController": false}, {"data": ["ViewMD_Bể", 300, 0, 0.0, 151.83000000000018, 87, 755, 132.5, 215.70000000000044, 280.84999999999997, 527.5400000000004, 8.522485156671685, 58.53382627624215, 6.699805225703815], "isController": false}, {"data": ["Add_Bể-2", 300, 0, 0.0, 46.49333333333333, 25, 662, 41.0, 61.0, 71.94999999999999, 214.17000000000075, 8.636573007830494, 41.68158574677568, 1.9314211121027178], "isController": false}, {"data": ["Update_Bể-2", 300, 0, 0.0, 48.670000000000016, 25, 453, 41.0, 63.900000000000034, 85.94999999999999, 326.6900000000003, 8.634087376964255, 41.66958966499741, 1.9308652434812639], "isController": false}, {"data": ["ViewMD_Bể-1", 300, 0, 0.0, 54.15666666666667, 31, 376, 47.0, 71.0, 91.0, 298.2600000000007, 8.63036161215155, 8.15838871148701, 2.9835429792008283], "isController": false}, {"data": ["Update_Bể-0", 300, 0, 0.0, 50.11333333333336, 24, 621, 43.0, 69.90000000000003, 89.69999999999993, 158.9000000000001, 8.61178091629349, 9.444365204099208, 3.0864488244919053], "isController": false}, {"data": ["ViewMD_Bể-2", 300, 0, 0.0, 45.43333333333331, 25, 435, 41.0, 59.0, 71.94999999999999, 134.8800000000001, 8.640552995391706, 41.700793850806456, 1.9323111679147467], "isController": false}, {"data": ["Update_Bể-1", 300, 0, 0.0, 56.17333333333332, 31, 408, 47.0, 73.90000000000003, 94.0, 304.18000000000075, 8.62217623728229, 8.150650974305915, 2.9807132695292293], "isController": false}, {"data": ["Add_Bể-0", 300, 0, 0.0, 47.166666666666664, 24, 203, 43.0, 68.0, 81.94999999999999, 135.0, 8.617718028266115, 9.450876314202, 3.0969924164081353], "isController": false}, {"data": ["Add_Bể-1", 300, 0, 0.0, 53.95666666666665, 30, 452, 47.0, 70.90000000000003, 91.89999999999998, 282.19000000000165, 8.625646923519264, 8.153931857389304, 2.9819130966072454], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
