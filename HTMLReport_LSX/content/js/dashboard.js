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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9947916666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AddLSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Receive_LSX-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "AddLSX-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Receive_LSX-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Receive_LSX-2"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "AddLSX"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "WorkOrder-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "WorkOrder-0"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-2"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "productDelivery_LSX"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "WorkOrder"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "productDelivery_LSX-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "productDelivery_LSX-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "productDelivery_LSX-0"], "isController": false}, {"data": [0.9816666666666667, 500, 1500, "Receive_LSX"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 83.20979166666649, 23, 1327, 47.0, 143.0, 197.94999999999982, 513.9299999999985, 117.70187096932395, 403.50822074005055, 53.26182076211962], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AddLSX-1", 300, 0, 0.0, 54.2666666666667, 28, 402, 46.0, 74.0, 93.94999999999999, 378.32000000000244, 7.61054313909536, 7.164612877038992, 2.6012598619954845], "isController": false}, {"data": ["AddLSX-2", 300, 0, 0.0, 52.94000000000002, 24, 430, 38.0, 70.0, 96.79999999999995, 371.96000000000004, 7.619241123584091, 36.771767219484936, 1.6890309912632702], "isController": false}, {"data": ["Receive_LSX-1", 300, 0, 0.0, 61.909999999999975, 30, 967, 47.0, 79.80000000000007, 103.79999999999995, 372.8600000000001, 7.610157022906573, 7.1642493848456406, 2.60112788868877], "isController": false}, {"data": ["AddLSX-0", 300, 0, 0.0, 49.44999999999999, 25, 972, 38.0, 66.0, 99.34999999999985, 333.99, 7.59955415948931, 8.274905163897051, 3.0724759980747796], "isController": false}, {"data": ["Receive_LSX-0", 300, 0, 0.0, 54.76999999999998, 24, 987, 39.0, 70.90000000000003, 108.74999999999994, 381.95000000000005, 7.601864990877762, 8.277421352371782, 3.103105045104399], "isController": false}, {"data": ["Receive_LSX-2", 300, 0, 0.0, 61.24999999999997, 23, 1072, 39.0, 70.0, 97.59999999999991, 971.9300000000001, 7.616919717666176, 36.760563715533436, 1.688516382724826], "isController": false}, {"data": ["AddLSX", 300, 0, 0.0, 156.76333333333343, 87, 1108, 123.0, 216.90000000000003, 430.9999999999998, 535.9300000000001, 7.571360068646998, 51.91261625192439, 7.327361160184742], "isController": false}, {"data": ["WorkOrder-1", 300, 0, 0.0, 60.209999999999944, 31, 1005, 48.0, 72.0, 92.0, 391.84000000000015, 7.610736211882896, 7.1647946369678825, 2.601325853670912], "isController": false}, {"data": ["WorkOrder-0", 300, 0, 0.0, 56.680000000000035, 24, 882, 38.0, 69.0, 144.84999999999997, 431.7600000000002, 7.550018875047188, 8.220967818044546, 1.6220743676859193], "isController": false}, {"data": ["WorkOrder-2", 300, 0, 0.0, 48.19666666666668, 25, 435, 38.0, 67.90000000000003, 79.94999999999999, 396.7900000000002, 7.618080243778568, 36.76616461401726, 1.6887736477907567], "isController": false}, {"data": ["productDelivery_LSX", 300, 0, 0.0, 165.91999999999996, 86, 1327, 125.0, 203.30000000000024, 467.0499999999998, 1139.3700000000006, 7.567922100855175, 51.88904401377362, 6.828867208193537], "isController": false}, {"data": ["WorkOrder", 300, 0, 0.0, 165.1800000000001, 88, 1184, 127.0, 231.90000000000003, 442.6499999999999, 949.7500000000011, 7.522944982195696, 51.58066085937108, 5.855260889462862], "isController": false}, {"data": ["productDelivery_LSX-2", 300, 0, 0.0, 53.806666666666636, 24, 991, 37.5, 66.90000000000003, 86.94999999999999, 394.94000000000005, 7.611701722781824, 36.73538077537869, 1.6873596592494864], "isController": false}, {"data": ["productDelivery_LSX-1", 300, 0, 0.0, 61.94333333333335, 29, 970, 47.0, 73.90000000000003, 93.0, 417.62000000000035, 7.604369977947327, 7.158801424551976, 2.599149894806215], "isController": false}, {"data": ["productDelivery_LSX-0", 300, 0, 0.0, 50.00999999999996, 24, 971, 37.0, 66.0, 98.69999999999993, 327.96000000000004, 7.59589821496392, 8.270924325864033, 2.574000664641094], "isController": false}, {"data": ["Receive_LSX", 300, 0, 0.0, 178.05999999999997, 87, 1290, 126.0, 260.50000000000017, 484.9, 1182.7100000000003, 7.572315614114796, 51.91916789716795, 7.357865269574435], "isController": false}]}, function(index, item){
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
