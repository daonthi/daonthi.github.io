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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9600, 0, 0.0, 81.30812500000006, 27, 617, 56.0, 164.0, 186.0, 235.0, 78.77310882997317, 271.1671959234916, 35.30943061812274], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 600, 0, 0.0, 55.263333333333335, 27, 209, 51.0, 79.0, 115.94999999999993, 131.99, 4.975990844176847, 5.398755691289528, 1.8125435399198866], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 600, 0, 0.0, 46.933333333333366, 27, 111, 44.5, 65.0, 76.0, 95.98000000000002, 4.979914345473258, 24.03392255403207, 1.0990826582782776], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 600, 0, 0.0, 58.058333333333344, 33, 108, 54.0, 77.89999999999998, 81.0, 99.96000000000004, 4.978715989146399, 4.67727029449105, 1.6919855119364715], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 600, 0, 0.0, 58.383333333333304, 35, 116, 54.0, 78.0, 84.94999999999993, 99.98000000000002, 4.98024502805538, 4.912155740562436, 1.9065000498024502], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 600, 0, 0.0, 62.111666666666686, 27, 444, 51.0, 103.89999999999998, 127.0, 241.98000000000002, 4.954132985443105, 5.375040768386026, 1.0595264880976956], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 600, 0, 0.0, 47.54000000000007, 27, 139, 46.0, 63.0, 76.0, 94.96000000000004, 4.9811959851560355, 24.040107967422976, 1.2161123010634853], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 600, 0, 0.0, 167.3283333333334, 102, 617, 157.0, 220.0, 240.89999999999986, 378.8600000000001, 4.949555777368981, 33.907357205315826, 3.8330055971226584], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 600, 0, 0.0, 58.36666666666666, 35, 134, 54.0, 77.0, 83.94999999999993, 111.96000000000004, 4.97005541611789, 4.669134092095127, 1.6890422703213142], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 600, 0, 0.0, 46.71500000000001, 28, 149, 45.0, 61.89999999999998, 72.94999999999993, 90.98000000000002, 4.972114723260381, 23.99628023667266, 1.0973612572820763], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 600, 0, 0.0, 55.44333333333328, 27, 184, 51.0, 81.0, 111.94999999999993, 130.98000000000002, 4.980906524987548, 5.8515923335547075, 1.6781374522663126], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 600, 0, 0.0, 161.51500000000013, 98, 336, 156.0, 210.89999999999998, 226.94999999999993, 281.97, 4.965407659968883, 34.015951889337614, 4.582334217451753], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 600, 0, 0.0, 47.206666666666635, 28, 103, 46.0, 63.0, 77.0, 86.99000000000001, 4.975784515358588, 24.013991284084124, 1.098171191866251], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 600, 0, 0.0, 58.311666666666625, 32, 168, 54.0, 79.0, 84.94999999999993, 102.0, 4.975289395999868, 4.674051170851437, 1.6908210056718298], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 600, 0, 0.0, 160.40166666666673, 97, 362, 155.0, 207.0, 220.89999999999986, 252.99, 4.9699319119328065, 34.04694566621937, 4.5962163287112965], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 600, 0, 0.0, 161.50333333333325, 101, 290, 157.0, 209.0, 219.0, 252.99, 4.974216975344464, 34.75636958846645, 4.7944845260400255], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 600, 0, 0.0, 55.848333333333265, 27, 222, 50.5, 81.89999999999998, 120.0, 149.99, 4.971579139253931, 5.393969163780389, 1.8012264264289146], "isController": false}]}, function(index, item){
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
