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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9996875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MD Sản xuất_Delete-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "MD Sản xuất_Update"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "MD Sản xuất_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "MD Sản xuất_View"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 70.1958333333334, 25, 608, 48.0, 135.0, 166.0, 242.98999999999978, 156.03666861712503, 536.1093841427736, 68.3041374097913], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MD Sản xuất_Delete-2", 300, 0, 0.0, 40.12000000000005, 26, 91, 36.0, 54.0, 67.74999999999994, 82.99000000000001, 10.165356465166711, 49.059757471537004, 2.3626512096774195], "isController": false}, {"data": ["MD Sản xuất_Update-1", 300, 0, 0.0, 52.30000000000001, 33, 315, 48.0, 71.80000000000007, 85.0, 101.98000000000002, 10.211027910142954, 9.612725493533016, 3.4900974302246426], "isController": false}, {"data": ["MD Sản xuất_Update-0", 300, 0, 0.0, 45.03333333333333, 26, 388, 38.0, 59.0, 74.94999999999999, 238.09000000000083, 10.19610508785644, 11.10220427046868, 3.5298039586378005], "isController": false}, {"data": ["MD Sản xuất_Update-2", 300, 0, 0.0, 41.950000000000024, 25, 331, 35.5, 57.0, 67.94999999999999, 116.84000000000015, 10.218679746576743, 49.3171047925608, 2.2652737328837116], "isController": false}, {"data": ["MD Sản xuất_Update", 300, 0, 0.0, 139.42666666666665, 88, 517, 124.0, 189.0, 210.69999999999993, 491.39000000000055, 10.14576076296121, 69.5638538249518, 9.229273584666373], "isController": false}, {"data": ["MD Sản xuất_Add-1", 300, 0, 0.0, 52.50333333333334, 34, 114, 49.0, 72.0, 89.0, 99.99000000000001, 10.217983651226158, 9.619273671662125, 3.4924748807901906], "isController": false}, {"data": ["MD Sản xuất_Add-0", 300, 0, 0.0, 42.843333333333334, 26, 146, 38.0, 60.0, 75.89999999999998, 112.0, 10.205470131990747, 11.112401559736018, 3.543012335862022], "isController": false}, {"data": ["MD Sản xuất_Delete", 300, 0, 0.0, 139.21333333333334, 97, 507, 126.0, 184.90000000000003, 196.95, 434.83000000000015, 10.126582278481013, 70.04549050632912, 9.14754746835443], "isController": false}, {"data": ["MD Sản xuất_Delete-0", 300, 0, 0.0, 43.800000000000026, 27, 317, 40.0, 60.0, 70.89999999999998, 102.98000000000002, 10.178462373617426, 11.48058988430481, 3.1708295870937095], "isController": false}, {"data": ["MD Sản xuất_Add", 300, 0, 0.0, 136.29999999999995, 94, 436, 124.5, 191.0, 204.0, 269.7800000000002, 10.154346060113728, 69.62271844536961, 9.246999708062551], "isController": false}, {"data": ["MD Sản xuất_Add-2", 300, 0, 0.0, 40.839999999999975, 26, 317, 37.0, 55.0, 61.0, 82.93000000000006, 10.22948136529478, 49.36923526102226, 2.26766823234562], "isController": false}, {"data": ["MD Sản xuất_Delete-1", 300, 0, 0.0, 55.14000000000004, 33, 356, 49.0, 74.0, 90.79999999999995, 263.51000000000136, 10.167078998203817, 9.789785051004845, 3.6537940149794963], "isController": false}, {"data": ["MD Sản xuất_View", 300, 0, 0.0, 146.92999999999998, 93, 608, 127.5, 207.60000000000014, 246.74999999999994, 445.6600000000003, 10.047894966004622, 68.89284234015474, 7.820480749907895], "isController": false}, {"data": ["MD Sản xuất_View-2", 300, 0, 0.0, 41.49999999999998, 26, 143, 36.0, 59.900000000000034, 71.94999999999999, 110.8900000000001, 10.23471615720524, 49.39449926651201, 2.2688286793804586], "isController": false}, {"data": ["MD Sản xuất_View-1", 300, 0, 0.0, 52.40333333333335, 31, 271, 49.0, 71.90000000000003, 76.0, 95.0, 10.217635639113109, 9.618946050883824, 3.4923559313374883], "isController": false}, {"data": ["MD Sản xuất_View-0", 300, 0, 0.0, 52.82999999999998, 26, 443, 40.0, 75.90000000000003, 153.0, 271.99, 10.097950116126427, 10.99532654246188, 2.169481470261537], "isController": false}]}, function(index, item){
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
