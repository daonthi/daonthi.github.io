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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.99546875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MD Sản xuất_Delete-2"], "isController": false}, {"data": [0.9975, 500, 1500, "MD Sản xuất_Update-1"], "isController": false}, {"data": [0.99, 500, 1500, "MD Sản xuất_Update-0"], "isController": false}, {"data": [0.9925, 500, 1500, "MD Sản xuất_Update-2"], "isController": false}, {"data": [0.98, 500, 1500, "MD Sản xuất_Update"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-0"], "isController": false}, {"data": [0.9975, 500, 1500, "MD Sản xuất_Delete"], "isController": false}, {"data": [0.9975, 500, 1500, "MD Sản xuất_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-1"], "isController": false}, {"data": [0.9825, 500, 1500, "MD Sản xuất_View"], "isController": false}, {"data": [0.9975, 500, 1500, "MD Sản xuất_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-1"], "isController": false}, {"data": [0.9925, 500, 1500, "MD Sản xuất_View-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3200, 0, 0.0, 74.00999999999976, 24, 1549, 43.0, 129.0, 153.0, 448.9499999999989, 202.39074062361647, 695.3722882803112, 88.5444666687749], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MD Sản xuất_Delete-2", 200, 0, 0.0, 38.484999999999985, 26, 182, 34.0, 52.0, 63.0, 126.64000000000033, 14.028196675317389, 67.70248825138529, 3.2604597741460335], "isController": false}, {"data": ["MD Sản xuất_Update-1", 200, 0, 0.0, 52.78499999999999, 32, 1040, 44.0, 63.0, 81.89999999999998, 117.99000000000001, 14.141271300289896, 13.312681185038535, 4.833442338966273], "isController": false}, {"data": ["MD Sản xuất_Update-0", 200, 0, 0.0, 58.97499999999997, 24, 1002, 34.0, 52.900000000000006, 68.94999999999999, 1001.97, 14.197487044793071, 15.45917778803152, 4.900767329807624], "isController": false}, {"data": ["MD Sản xuất_Update-2", 200, 0, 0.0, 53.76, 26, 1076, 34.0, 56.0, 68.94999999999999, 1051.6000000000004, 14.132278123233466, 68.20480320802714, 3.132838998021481], "isController": false}, {"data": ["MD Sản xuất_Update", 200, 0, 0.0, 165.71, 86, 1196, 116.5, 164.9, 295.49999999999943, 1190.89, 14.047903350424948, 96.31868107747418, 12.764797490693264], "isController": false}, {"data": ["MD Sản xuất_Add-1", 200, 0, 0.0, 49.635, 32, 356, 43.5, 65.0, 71.94999999999999, 274.29000000000156, 14.071624569056498, 13.247115316963344, 4.809637303876733], "isController": false}, {"data": ["MD Sản xuất_Add-0", 200, 0, 0.0, 43.165, 26, 362, 34.0, 56.900000000000006, 67.94999999999999, 344.8900000000001, 14.098406880022557, 15.351292647680813, 4.880334264415621], "isController": false}, {"data": ["MD Sản xuất_Delete", 200, 0, 0.0, 129.33999999999995, 88, 1180, 117.0, 158.8, 176.95, 308.96000000000004, 13.900472616068946, 96.1494604879066, 12.556579267445093], "isController": false}, {"data": ["MD Sản xuất_Delete-0", 200, 0, 0.0, 43.394999999999996, 25, 1002, 34.0, 54.900000000000006, 65.69999999999993, 129.65000000000032, 14.071624569056498, 15.87180310279322, 4.383640856961937], "isController": false}, {"data": ["MD Sản xuất_Add", 200, 0, 0.0, 138.12499999999997, 92, 473, 119.0, 166.70000000000002, 255.04999999999956, 454.94000000000005, 13.942140118508192, 95.59352126176367, 12.682309820494945], "isController": false}, {"data": ["MD Sản xuất_Add-2", 200, 0, 0.0, 45.12999999999998, 25, 393, 36.0, 56.0, 65.94999999999999, 367.95000000000005, 14.289797084881394, 68.96501679051157, 3.1677577522149183], "isController": false}, {"data": ["MD Sản xuất_Delete-1", 200, 0, 0.0, 47.31999999999999, 32, 165, 42.0, 62.900000000000006, 75.84999999999997, 149.61000000000035, 14.008545212579673, 13.488696855081601, 5.03432093577082], "isController": false}, {"data": ["MD Sản xuất_View", 200, 0, 0.0, 159.25499999999994, 88, 1549, 117.5, 221.60000000000002, 319.7999999999997, 1241.1700000000035, 13.40662287169862, 91.92177654511329, 10.434646903070117], "isController": false}, {"data": ["MD Sản xuất_View-2", 200, 0, 0.0, 44.96999999999997, 25, 1026, 34.0, 52.900000000000006, 65.74999999999994, 319.06000000000176, 14.168319637291017, 68.3787457495041, 3.1408286695947862], "isController": false}, {"data": ["MD Sản xuất_View-1", 200, 0, 0.0, 47.685, 33, 172, 44.0, 63.0, 72.0, 154.52000000000044, 14.125291334133765, 13.297637545024365, 4.827980436471502], "isController": false}, {"data": ["MD Sản xuất_View-0", 200, 0, 0.0, 66.42500000000003, 26, 1146, 35.0, 131.8, 213.04999999999978, 769.3600000000006, 13.540961408259987, 14.744308564658091, 2.9091909275558567], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
