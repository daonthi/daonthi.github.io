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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.98984375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AddLSX-1"], "isController": false}, {"data": [0.9875, 500, 1500, "AddLSX-2"], "isController": false}, {"data": [0.995, 500, 1500, "Receive_LSX-1"], "isController": false}, {"data": [0.995, 500, 1500, "AddLSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-0"], "isController": false}, {"data": [0.9925, 500, 1500, "Receive_LSX-2"], "isController": false}, {"data": [0.965, 500, 1500, "AddLSX"], "isController": false}, {"data": [0.9975, 500, 1500, "WorkOrder-1"], "isController": false}, {"data": [0.9875, 500, 1500, "WorkOrder-0"], "isController": false}, {"data": [0.9925, 500, 1500, "WorkOrder-2"], "isController": false}, {"data": [0.9775, 500, 1500, "productDelivery_LSX"], "isController": false}, {"data": [0.9775, 500, 1500, "WorkOrder"], "isController": false}, {"data": [0.995, 500, 1500, "productDelivery_LSX-2"], "isController": false}, {"data": [0.9975, 500, 1500, "productDelivery_LSX-1"], "isController": false}, {"data": [0.995, 500, 1500, "productDelivery_LSX-0"], "isController": false}, {"data": [0.9825, 500, 1500, "Receive_LSX"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3200, 0, 0.0, 96.37562499999973, 24, 1595, 53.0, 159.0, 225.84999999999945, 985.9799999999996, 86.35578583765113, 296.0468615069085, 39.077258068868744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AddLSX-1", 200, 0, 0.0, 68.51000000000002, 36, 392, 55.5, 86.9, 118.5499999999999, 381.6500000000003, 5.632216277105041, 5.302203604618418, 1.925073922838637], "isController": false}, {"data": ["AddLSX-2", 200, 0, 0.0, 70.79499999999994, 25, 1316, 40.0, 79.9, 152.74999999999972, 1008.850000000001, 5.669737774627924, 27.363128986534374, 1.2568656980864636], "isController": false}, {"data": ["Receive_LSX-1", 200, 0, 0.0, 65.18000000000004, 34, 988, 53.0, 78.0, 98.79999999999995, 533.6600000000021, 5.793407102717108, 5.453949655292278, 1.9801684433115117], "isController": false}, {"data": ["AddLSX-0", 200, 0, 0.0, 62.02000000000001, 26, 984, 41.0, 82.60000000000002, 110.89999999999998, 974.7100000000048, 5.625404325935927, 6.125318186932186, 2.274333389587377], "isController": false}, {"data": ["Receive_LSX-0", 200, 0, 0.0, 48.444999999999965, 25, 397, 41.0, 70.9, 89.89999999999998, 291.63000000000125, 5.794246313410783, 6.309164686965842, 2.365229452154011], "isController": false}, {"data": ["Receive_LSX-2", 200, 0, 0.0, 62.059999999999995, 25, 1289, 39.5, 74.80000000000001, 103.49999999999989, 653.3300000000006, 5.876303804906714, 28.36005215219627, 1.3026571911267815], "isController": false}, {"data": ["AddLSX", 200, 0, 0.0, 201.415, 98, 1595, 136.5, 235.60000000000002, 777.2999999999998, 1563.5700000000013, 5.603182607721186, 38.417915125791446, 5.422611293214546], "isController": false}, {"data": ["WorkOrder-1", 200, 0, 0.0, 63.56999999999999, 35, 991, 54.0, 84.70000000000002, 96.74999999999994, 141.96000000000004, 5.631899076368551, 5.301904989862582, 1.9249655046181573], "isController": false}, {"data": ["WorkOrder-0", 200, 0, 0.0, 72.39999999999995, 26, 1178, 42.0, 93.9, 156.84999999999997, 980.6600000000012, 5.5443129210212625, 6.037020416932331, 1.1911609791256619], "isController": false}, {"data": ["WorkOrder-2", 200, 0, 0.0, 65.27000000000001, 26, 1311, 39.0, 71.60000000000002, 91.79999999999995, 1304.6400000000003, 5.638090942406901, 27.210395934936432, 1.2498502382093424], "isController": false}, {"data": ["productDelivery_LSX", 200, 0, 0.0, 192.64499999999992, 96, 1591, 138.0, 239.9, 447.7499999999997, 1417.8000000000002, 5.890495685211911, 40.387861529172675, 5.3152519659529345], "isController": false}, {"data": ["WorkOrder", 200, 0, 0.0, 201.36000000000007, 96, 1416, 140.5, 263.5, 489.84999999999997, 1411.8300000000002, 5.522268547919485, 37.86313229974874, 4.2980937819256155], "isController": false}, {"data": ["productDelivery_LSX-2", 200, 0, 0.0, 59.50499999999999, 25, 1285, 40.0, 71.9, 86.84999999999997, 980.9300000000046, 5.916109566349169, 28.552161598532805, 1.3114813198840443], "isController": false}, {"data": ["productDelivery_LSX-1", 200, 0, 0.0, 70.47000000000003, 34, 984, 57.0, 90.0, 108.94999999999999, 369.5700000000004, 5.912436810831585, 5.566004966446921, 2.0208524255772016], "isController": false}, {"data": ["productDelivery_LSX-0", 200, 0, 0.0, 62.535, 24, 1030, 41.0, 73.0, 145.64999999999992, 959.2200000000053, 5.917860101787194, 6.4437636850514854, 2.0053686087110902], "isController": false}, {"data": ["Receive_LSX", 200, 0, 0.0, 175.82999999999993, 100, 1407, 134.0, 232.60000000000002, 371.5499999999992, 1175.1200000000017, 5.770506939034594, 39.56516525289247, 5.607084379237716], "isController": false}]}, function(index, item){
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
