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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999358974358974, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Sản phẩm_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-2"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "Sản phẩm_View"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7800, 0, 0.0, 67.32012820512794, 26, 579, 45.0, 125.0, 139.0, 207.97999999999956, 205.96778452601004, 712.4702931080011, 79.24932334301559], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Sản phẩm_Add", 600, 0, 0.0, 122.65166666666661, 95, 328, 116.0, 146.89999999999998, 173.94999999999993, 254.80000000000018, 16.35322976287817, 78.92349754701554, 3.162050286181521], "isController": false}, {"data": ["Sản phẩm_Xóa", 600, 0, 0.0, 124.47999999999993, 93, 306, 117.0, 151.0, 180.94999999999993, 227.99, 16.34921932477724, 109.00011751001391, 12.30981259707349], "isController": false}, {"data": ["Sản phẩm_Xóa-2", 600, 0, 0.0, 36.67499999999997, 27, 95, 34.0, 48.0, 53.0, 79.97000000000003, 16.417665407978987, 79.23447504514859, 3.591364307995403], "isController": false}, {"data": ["Sản phẩm_View", 600, 0, 0.0, 127.64999999999996, 94, 579, 115.0, 166.5999999999999, 208.0, 299.93000000000006, 16.240357287860334, 111.82691331709297, 12.957394437677628], "isController": false}, {"data": ["Sản phẩm_Xóa-0", 600, 0, 0.0, 38.45833333333334, 27, 155, 35.0, 51.0, 57.0, 93.88000000000011, 16.416766991353835, 14.86166308689942, 4.601183717303273], "isController": false}, {"data": ["Sản phẩm_Update", 600, 0, 0.0, 124.32500000000002, 95, 305, 118.0, 152.0, 176.0, 231.94000000000005, 16.361256544502616, 106.6517455415576, 13.964588105366493], "isController": false}, {"data": ["Sản phẩm_Xóa-1", 600, 0, 0.0, 49.208333333333336, 33, 131, 45.5, 62.0, 71.0, 113.90000000000009, 16.405993656349118, 15.34857609646724, 4.1655843268073935], "isController": false}, {"data": ["Sản phẩm_View-0", 600, 0, 0.0, 42.91333333333331, 26, 424, 34.0, 52.0, 76.0, 207.75000000000023, 16.30700657715932, 18.074660610425614, 3.5830824998641084], "isController": false}, {"data": ["Sản phẩm_View-1", 600, 0, 0.0, 48.04166666666665, 33, 141, 45.0, 61.0, 68.0, 100.97000000000003, 16.454134101192924, 15.650709584533113, 5.784656519950637], "isController": false}, {"data": ["Sản phẩm_View-2", 600, 0, 0.0, 36.550000000000075, 27, 102, 33.0, 49.0, 54.0, 81.99000000000001, 16.473107651758504, 79.50204884276418, 3.732188452351536], "isController": false}, {"data": ["Sản phẩm_Update-0", 600, 0, 0.0, 38.339999999999975, 27, 147, 35.0, 51.0, 56.0, 80.98000000000002, 16.428903918293585, 13.268265176199995, 7.44434708797678], "isController": false}, {"data": ["Sản phẩm_Update-1", 600, 0, 0.0, 48.796666666666674, 33, 128, 46.0, 61.0, 68.94999999999993, 104.92000000000007, 16.451427161306245, 14.555657234515095, 3.4059595294891833], "isController": false}, {"data": ["Sản phẩm_Update-2", 600, 0, 0.0, 37.07166666666668, 27, 100, 34.0, 50.0, 56.0, 78.0, 16.462260268334845, 79.44969750596756, 3.1831323565725573], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
