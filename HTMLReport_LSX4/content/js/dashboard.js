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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9997916666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AddLSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "WorkOrder-0"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-2"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "WorkOrder"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 66.78875, 26, 894, 47.0, 130.0, 145.0, 207.0, 161.22531237404272, 552.7162686416767, 72.95681554816606], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AddLSX-1", 300, 0, 0.0, 51.739999999999995, 33, 108, 49.0, 67.90000000000003, 74.0, 96.98000000000002, 10.683760683760683, 10.057759081196583, 3.6516760149572653], "isController": false}, {"data": ["AddLSX-2", 300, 0, 0.0, 38.99666666666665, 26, 98, 36.0, 50.0, 56.89999999999998, 79.99000000000001, 10.700146235331884, 51.64074481934587, 2.3720050736526734], "isController": false}, {"data": ["Receive_LSX-1", 300, 0, 0.0, 50.776666666666635, 31, 108, 49.0, 63.0, 72.94999999999999, 96.93000000000006, 10.677676537585421, 10.052031427961275, 3.649596472807517], "isController": false}, {"data": ["AddLSX-0", 300, 0, 0.0, 41.29666666666671, 26, 148, 39.0, 53.0, 66.94999999999999, 129.47000000000048, 10.671599317017643, 11.619954334447923, 4.3144942551223675], "isController": false}, {"data": ["Receive_LSX-0", 300, 0, 0.0, 40.68666666666667, 26, 150, 39.0, 51.0, 60.0, 109.91000000000008, 10.673117973530667, 11.621607949694036, 4.356800110288885], "isController": false}, {"data": ["Receive_LSX-2", 300, 0, 0.0, 39.02999999999997, 26, 81, 36.0, 51.0, 59.0, 79.99000000000001, 10.67995728017088, 51.54330945176219, 2.3675295923816306], "isController": false}, {"data": ["AddLSX", 300, 0, 0.0, 132.2566666666666, 98, 316, 125.0, 167.80000000000007, 185.95, 295.51000000000045, 10.610079575596817, 72.74743037135279, 10.268153183023873], "isController": false}, {"data": ["WorkOrder-1", 300, 0, 0.0, 50.84999999999997, 33, 102, 48.0, 66.0, 75.94999999999999, 94.98000000000002, 10.68452168957903, 10.058475496830258, 3.6519361243678325], "isController": false}, {"data": ["WorkOrder-0", 300, 0, 0.0, 51.069999999999965, 26, 727, 39.0, 71.0, 148.95, 246.99, 10.451505016722408, 11.38030087270067, 2.2454405309364547], "isController": false}, {"data": ["WorkOrder-2", 300, 0, 0.0, 38.510000000000005, 26, 80, 36.0, 49.900000000000034, 59.0, 75.99000000000001, 10.701673028216746, 51.64811338422573, 2.3723435326222666], "isController": false}, {"data": ["productDelivery_LSX", 300, 0, 0.0, 131.10000000000002, 95, 302, 125.0, 165.7000000000001, 189.95, 228.97000000000003, 10.592098294672175, 72.62414270204427, 9.557713695583095], "isController": false}, {"data": ["WorkOrder", 300, 0, 0.0, 140.68666666666675, 94, 894, 123.0, 195.80000000000007, 237.89999999999998, 420.1400000000008, 10.395010395010395, 71.27282029625779, 8.09064773908524], "isController": false}, {"data": ["productDelivery_LSX-2", 300, 0, 0.0, 39.029999999999966, 26, 86, 36.0, 51.900000000000034, 60.0, 78.96000000000004, 10.645470352365068, 51.37686961073063, 2.359884541002803], "isController": false}, {"data": ["productDelivery_LSX-1", 300, 0, 0.0, 50.78333333333332, 34, 105, 49.0, 66.0, 72.0, 92.97000000000003, 10.635280771412365, 10.012119788712422, 3.635105732416336], "isController": false}, {"data": ["productDelivery_LSX-0", 300, 0, 0.0, 41.06999999999999, 26, 153, 38.0, 55.0, 66.94999999999999, 90.93000000000006, 10.650005325002663, 11.596441345095672, 3.6089373513436755], "isController": false}, {"data": ["Receive_LSX", 300, 0, 0.0, 130.73666666666668, 95, 308, 124.0, 161.80000000000007, 180.0, 235.98000000000002, 10.613833362816203, 72.77316800813728, 10.313246285158323], "isController": false}]}, function(index, item){
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
