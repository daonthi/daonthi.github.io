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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.996875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.95, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 320, 0, 0.0, 133.85312500000015, 39, 626, 77.0, 286.7000000000001, 403.9, 485.48000000000025, 29.50940612320177, 101.58267244559204, 13.227360752489856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 20, 0, 0.0, 82.49999999999999, 50, 155, 76.0, 107.90000000000002, 152.69999999999996, 155.0, 2.105706464518846, 2.284609259844178, 0.7670200305327438], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 20, 0, 0.0, 54.550000000000004, 49, 94, 52.0, 62.500000000000014, 92.44999999999997, 94.0, 2.114835571534313, 10.206559955588451, 0.46675081949878394], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 20, 0, 0.0, 71.6, 51, 105, 73.0, 101.9, 104.85, 105.0, 2.103491796381994, 1.9761319415229281, 0.7148585401766934], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 20, 0, 0.0, 66.69999999999999, 49, 128, 52.0, 102.00000000000003, 126.74999999999999, 128.0, 2.0896458050360462, 2.061076428795319, 0.7999425347403615], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 20, 0, 0.0, 296.3, 237, 423, 283.5, 346.6, 419.19999999999993, 423.0, 2.032520325203252, 2.205205157520325, 0.4346894054878049], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 20, 0, 0.0, 70.3, 51, 92, 75.0, 80.80000000000001, 91.44999999999999, 92.0, 2.088118605136772, 10.077619283775318, 0.5097945813322197], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 20, 0, 0.0, 435.85, 356, 626, 417.5, 501.50000000000006, 619.8499999999999, 626.0, 2.0064205457463884, 13.745156375401285, 1.5538002859149278], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 20, 0, 0.0, 64.8, 50, 122, 52.5, 107.30000000000001, 121.29999999999998, 122.0, 2.112155454641462, 1.984271042348717, 0.7178028302883093], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 20, 0, 0.0, 74.7, 51, 95, 76.0, 90.7, 94.8, 95.0, 2.1193175797393238, 10.228190897530995, 0.4677400127159055], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 20, 0, 0.0, 76.40000000000002, 46, 150, 75.5, 115.10000000000007, 148.39999999999998, 150.0, 2.1021652301870923, 2.469633566323313, 0.7082490277485811], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 20, 0, 0.0, 212.80000000000004, 177, 272, 202.0, 256.0, 271.2, 272.0, 2.083767451552407, 14.275028000625129, 1.9230080485517815], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 20, 0, 0.0, 68.05, 50, 85, 74.0, 80.50000000000001, 84.8, 85.0, 2.1240441801189465, 10.251002283347493, 0.46878318819031434], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 20, 0, 0.0, 65.5, 39, 115, 54.0, 106.60000000000001, 114.6, 115.0, 2.122015915119363, 1.9935344827586206, 0.7211538461538461], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 20, 0, 0.0, 208.85000000000002, 177, 307, 194.5, 283.70000000000005, 306.0, 307.0, 2.0725388601036268, 14.198105569948186, 1.916693652849741], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 20, 0, 0.0, 213.5, 173, 310, 203.0, 266.20000000000005, 307.84999999999997, 310.0, 2.067397146991937, 14.44553377610089, 1.9926962735166427], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 20, 0, 0.0, 79.24999999999999, 50, 111, 76.0, 101.50000000000001, 110.55, 111.0, 2.1177467174925875, 2.2976724639983055, 0.7672695626853028], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 320, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
