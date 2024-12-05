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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9886458333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9983333333333333, 500, 1500, "AddLSX-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "AddLSX-2"], "isController": false}, {"data": [0.995, 500, 1500, "Receive_LSX-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "AddLSX-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Receive_LSX-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Receive_LSX-2"], "isController": false}, {"data": [0.9633333333333334, 500, 1500, "AddLSX"], "isController": false}, {"data": [0.995, 500, 1500, "WorkOrder-1"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "WorkOrder-0"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "productDelivery_LSX"], "isController": false}, {"data": [0.9616666666666667, 500, 1500, "WorkOrder"], "isController": false}, {"data": [0.995, 500, 1500, "productDelivery_LSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "productDelivery_LSX-0"], "isController": false}, {"data": [0.9683333333333334, 500, 1500, "Receive_LSX"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 103.3772916666667, 25, 1897, 55.0, 182.0, 340.9499999999998, 675.9199999999983, 83.74624886593621, 287.1007877381534, 37.896404363528504], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AddLSX-1", 300, 0, 0.0, 75.30333333333337, 34, 962, 54.0, 105.0, 200.89999999999975, 390.83000000000015, 5.48706880784285, 5.165560869883309, 1.8754629714306617], "isController": false}, {"data": ["AddLSX-2", 300, 0, 0.0, 64.6266666666667, 25, 592, 45.0, 95.4000000000002, 166.84999999999997, 375.95000000000005, 5.490784633124074, 26.499470368065598, 1.2171954216007468], "isController": false}, {"data": ["Receive_LSX-1", 300, 0, 0.0, 72.83, 36, 962, 53.0, 94.80000000000007, 171.24999999999983, 551.2000000000016, 5.4864667154352595, 5.164994056327725, 1.875257178127286], "isController": false}, {"data": ["AddLSX-0", 300, 0, 0.0, 65.53333333333335, 26, 600, 45.0, 108.80000000000007, 156.84999999999997, 450.19000000000074, 5.481153965614895, 5.968248702793562, 2.216013419691959], "isController": false}, {"data": ["Receive_LSX-0", 300, 0, 0.0, 67.83, 25, 626, 45.0, 101.60000000000014, 150.5499999999999, 575.5400000000004, 5.486165718779145, 5.973705836365964, 2.2394699906735185], "isController": false}, {"data": ["Receive_LSX-2", 300, 0, 0.0, 61.479999999999976, 25, 599, 44.0, 102.90000000000003, 154.69999999999993, 425.4400000000005, 5.489378053466543, 26.492681972882473, 1.2168836114618213], "isController": false}, {"data": ["AddLSX", 300, 0, 0.0, 205.61333333333332, 105, 1239, 142.0, 459.9000000000007, 527.6999999999999, 851.9100000000001, 5.466771142737395, 37.482617376132076, 5.290595900832772], "isController": false}, {"data": ["WorkOrder-1", 300, 0, 0.0, 74.71666666666664, 35, 668, 52.0, 102.0, 193.74999999999972, 551.7300000000012, 5.476851175697386, 5.155941927121367, 1.8719706166934422], "isController": false}, {"data": ["WorkOrder-0", 300, 0, 0.0, 73.81666666666668, 25, 1668, 45.0, 109.20000000000027, 156.89999999999998, 597.0600000000009, 5.323868677905945, 5.79698591393079, 1.1437999112688553], "isController": false}, {"data": ["WorkOrder-2", 300, 0, 0.0, 61.146666666666675, 25, 424, 45.0, 108.90000000000003, 138.64999999999992, 398.97, 5.486065393899495, 26.476694508448542, 1.2161492621242045], "isController": false}, {"data": ["productDelivery_LSX", 300, 0, 0.0, 209.59333333333342, 102, 1156, 141.0, 445.50000000000017, 547.8, 977.5000000000014, 5.470659032058062, 37.509274476640286, 4.936414985958642], "isController": false}, {"data": ["WorkOrder", 300, 0, 0.0, 209.8399999999999, 96, 1897, 141.5, 435.90000000000003, 578.1499999999999, 990.5100000000014, 5.310298438772259, 36.40977083849612, 4.133113140333487], "isController": false}, {"data": ["productDelivery_LSX-2", 300, 0, 0.0, 64.85333333333334, 25, 731, 44.0, 102.0, 167.64999999999992, 511.2400000000007, 5.489679402722881, 26.494136336187964, 1.2169504144707948], "isController": false}, {"data": ["productDelivery_LSX-1", 300, 0, 0.0, 73.93333333333335, 36, 416, 53.0, 114.90000000000003, 225.7999999999995, 382.96000000000004, 5.481354259925818, 5.160181158758291, 1.8735097568105825], "isController": false}, {"data": ["productDelivery_LSX-0", 300, 0, 0.0, 70.65333333333331, 25, 1014, 46.0, 106.90000000000003, 151.74999999999994, 476.73000000000025, 5.484661230757981, 5.97206764872573, 1.8585717256572452], "isController": false}, {"data": ["Receive_LSX", 300, 0, 0.0, 202.26666666666677, 101, 1160, 144.0, 387.5000000000005, 564.1499999999999, 875.7400000000002, 5.472155846998523, 37.519537306422485, 5.317182683362822], "isController": false}]}, function(index, item){
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
