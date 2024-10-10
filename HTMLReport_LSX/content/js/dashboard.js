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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.99375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AddLSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "AddLSX"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-1"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-0"], "isController": false}, {"data": [1.0, 500, 1500, "WorkOrder-2"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX"], "isController": false}, {"data": [0.9, 500, 1500, "WorkOrder"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-2"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-1"], "isController": false}, {"data": [1.0, 500, 1500, "productDelivery_LSX-0"], "isController": false}, {"data": [1.0, 500, 1500, "Receive_LSX"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 80, 0, 0.0, 119.3125, 30, 578, 69.0, 298.40000000000015, 360.75, 578.0, 43.50190320826537, 149.13421016856987, 18.13995377922784], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AddLSX-1", 5, 0, 0.0, 62.0, 44, 82, 60.0, 82.0, 82.0, 82.0, 8.591065292096221, 8.087682560137457, 2.9363992697594505], "isController": false}, {"data": ["AddLSX-2", 5, 0, 0.0, 54.8, 32, 81, 45.0, 81.0, 81.0, 81.0, 8.27814569536424, 39.9517539321192, 1.8350967508278146], "isController": false}, {"data": ["Receive_LSX-1", 5, 0, 0.0, 57.6, 41, 75, 55.0, 75.0, 75.0, 75.0, 8.431703204047217, 7.9376580944350765, 2.8819298060708265], "isController": false}, {"data": ["AddLSX-0", 5, 0, 0.0, 63.0, 30, 127, 47.0, 127.0, 127.0, 127.0, 8.9126559714795, 9.704698640819963, 3.8992869875222813], "isController": false}, {"data": ["Receive_LSX-0", 5, 0, 0.0, 65.6, 42, 113, 57.0, 113.0, 113.0, 113.0, 7.9113924050632916, 8.614455597310126, 1.6997132120253164], "isController": false}, {"data": ["Receive_LSX-2", 5, 0, 0.0, 53.0, 31, 84, 53.0, 84.0, 84.0, 84.0, 8.305647840531561, 40.08448401162791, 1.8411934177740865], "isController": false}, {"data": ["AddLSX", 5, 0, 0.0, 180.6, 111, 234, 190.0, 234.0, 234.0, 234.0, 7.032348804500703, 48.21691499648383, 7.039216332630099], "isController": false}, {"data": ["WorkOrder-1", 5, 0, 0.0, 59.6, 46, 77, 60.0, 77.0, 77.0, 77.0, 8.169934640522877, 7.691227532679739, 2.7924581290849675], "isController": false}, {"data": ["WorkOrder-0", 5, 0, 0.0, 299.8, 186, 437, 275.0, 437.0, 437.0, 437.0, 5.08130081300813, 5.532861725101626, 1.0916857215447155], "isController": false}, {"data": ["WorkOrder-2", 5, 0, 0.0, 48.2, 36, 64, 50.0, 64.0, 64.0, 64.0, 8.547008547008549, 41.24933226495727, 1.8946981837606838], "isController": false}, {"data": ["productDelivery_LSX", 5, 0, 0.0, 190.6, 137, 315, 151.0, 315.0, 315.0, 315.0, 5.787037037037036, 39.67850296585648, 4.5041684751157405], "isController": false}, {"data": ["WorkOrder", 5, 0, 0.0, 408.2, 301, 578, 361.0, 578.0, 578.0, 578.0, 4.549590536851683, 31.194018710191084, 3.541038728389445], "isController": false}, {"data": ["productDelivery_LSX-2", 5, 0, 0.0, 53.4, 34, 74, 56.0, 74.0, 74.0, 74.0, 6.5359477124183005, 31.54360702614379, 1.4488868464052287], "isController": false}, {"data": ["productDelivery_LSX-1", 5, 0, 0.0, 66.2, 42, 94, 63.0, 94.0, 94.0, 94.0, 6.55307994757536, 6.169110419397117, 2.239822247706422], "isController": false}, {"data": ["productDelivery_LSX-0", 5, 0, 0.0, 69.8, 38, 164, 48.0, 164.0, 164.0, 164.0, 7.012622720897616, 7.635814779102384, 1.5066181626928472], "isController": false}, {"data": ["Receive_LSX", 5, 0, 0.0, 176.6, 124, 242, 143.0, 242.0, 242.0, 242.0, 6.321112515802781, 43.34036227876106, 4.919850268647282], "isController": false}]}, function(index, item){
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
