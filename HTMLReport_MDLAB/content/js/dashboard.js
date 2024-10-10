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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.8, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 80, 0, 0.0, 153.97500000000008, 37, 675, 107.5, 357.5000000000001, 431.6000000000001, 675.0, 40.4244567963618, 139.12092597271348, 18.232456417382515], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 5, 0, 0.0, 84.8, 47, 130, 79.0, 130.0, 130.0, 130.0, 4.409171075837742, 4.7837783840388015, 1.6680789792768962], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 5, 0, 0.0, 68.2, 39, 99, 79.0, 99.0, 99.0, 99.0, 4.672897196261682, 22.552205023364486, 1.0313230140186915], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 5, 0, 0.0, 82.0, 56, 108, 83.0, 108.0, 108.0, 108.0, 4.488330341113106, 4.216575964991023, 1.525331014362657], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 5, 0, 0.0, 84.4, 56, 126, 73.0, 126.0, 126.0, 126.0, 5.015045135406218, 4.934726053159478, 1.9080679538615848], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 5, 0, 0.0, 301.4, 175, 433, 295.0, 433.0, 433.0, 433.0, 4.0551500405515, 4.3996793896999185, 0.8672635340632603], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 5, 0, 0.0, 87.6, 41, 162, 58.0, 162.0, 162.0, 162.0, 5.376344086021506, 25.947160618279568, 1.3062836021505375], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 5, 0, 0.0, 475.8, 316, 675, 459.0, 675.0, 675.0, 675.0, 3.389830508474576, 23.222325211864405, 2.625132415254237], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 5, 0, 0.0, 93.6, 58, 140, 85.0, 140.0, 140.0, 140.0, 4.528985507246377, 4.254769587862318, 1.5391474184782608], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 5, 0, 0.0, 80.6, 51, 109, 86.0, 109.0, 109.0, 109.0, 4.355400696864112, 21.01991234756098, 0.9612505444250872], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 5, 0, 0.0, 75.2, 48, 117, 55.0, 117.0, 117.0, 117.0, 4.798464491362764, 5.614765774952015, 1.6054237643953935], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 5, 0, 0.0, 273.8, 207, 367, 218.0, 367.0, 367.0, 367.0, 3.834355828220859, 26.26758411618098, 3.592461896088957], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 5, 0, 0.0, 84.6, 37, 129, 83.0, 129.0, 129.0, 129.0, 4.370629370629371, 21.09340854458042, 0.9646115603146854], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 5, 0, 0.0, 96.8, 69, 142, 82.0, 142.0, 142.0, 142.0, 4.248088360237893, 3.9908798853016143, 1.4436862786745963], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 5, 0, 0.0, 235.2, 142, 308, 240.0, 308.0, 308.0, 308.0, 4.068348250610253, 27.87056931448332, 3.8196386798209923], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 5, 0, 0.0, 247.6, 152, 405, 174.0, 405.0, 405.0, 405.0, 4.378283712784588, 30.561617502189144, 4.194430002189142], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 5, 0, 0.0, 92.0, 52, 110, 99.0, 110.0, 110.0, 110.0, 4.180602006688963, 4.535789872491639, 1.5734414193143813], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 80, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
