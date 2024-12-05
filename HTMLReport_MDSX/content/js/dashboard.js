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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9941666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MD Sản xuất_Delete-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "MD Sản xuất_Add"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-1"], "isController": false}, {"data": [0.9566666666666667, 500, 1500, "MD Sản xuất_View"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-1"], "isController": false}, {"data": [0.9566666666666667, 500, 1500, "MD Sản xuất_View-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 105.6654166666664, 25, 15332, 39.0, 114.0, 126.0, 203.98999999999978, 180.37653601893956, 619.7360818834317, 78.91473450828605], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MD Sản xuất_Delete-2", 300, 0, 0.0, 34.29666666666667, 25, 98, 31.0, 46.900000000000034, 51.94999999999999, 81.86000000000013, 22.153300841825434, 106.91563746123173, 5.148911719096145], "isController": false}, {"data": ["MD Sản xuất_Update-1", 300, 0, 0.0, 44.64333333333333, 30, 107, 43.0, 55.0, 67.0, 84.97000000000003, 22.256843979523705, 20.952732027598486, 7.607319719563766], "isController": false}, {"data": ["MD Sản xuất_Update-0", 300, 0, 0.0, 34.83333333333333, 25, 98, 32.0, 45.0, 56.799999999999955, 73.99000000000001, 22.286605749944286, 24.26715372186316, 7.693667121684867], "isController": false}, {"data": ["MD Sản xuất_Update-2", 300, 0, 0.0, 33.490000000000016, 25, 87, 31.0, 43.0, 48.94999999999999, 66.91000000000008, 22.25519287833828, 107.4073859421365, 4.933524202522255], "isController": false}, {"data": ["MD Sản xuất_Update", 300, 0, 0.0, 113.12333333333332, 84, 254, 109.0, 134.0, 143.95, 202.86000000000013, 22.119000221190003, 151.65771538376464, 20.099345415837202], "isController": false}, {"data": ["MD Sản xuất_Add-1", 300, 0, 0.0, 49.72999999999999, 31, 500, 43.0, 56.0, 65.0, 452.7600000000002, 21.63721601153985, 20.369410385863684, 7.395532816444284], "isController": false}, {"data": ["MD Sản xuất_Add-0", 300, 0, 0.0, 34.50333333333333, 25, 77, 32.0, 46.0, 51.89999999999998, 71.98000000000002, 21.690405610584918, 23.61797095293182, 7.509032020461283], "isController": false}, {"data": ["MD Sản xuất_Delete", 300, 0, 0.0, 113.43666666666665, 85, 245, 109.0, 137.0, 148.0, 228.6600000000003, 22.02481462447691, 152.34547068864254, 19.89546242933705], "isController": false}, {"data": ["MD Sản xuất_Delete-0", 300, 0, 0.0, 34.55999999999999, 25, 109, 32.0, 45.900000000000034, 50.94999999999999, 78.91000000000008, 22.18770800976259, 25.026174561792764, 6.9119910694475255], "isController": false}, {"data": ["MD Sản xuất_Add", 300, 0, 0.0, 118.4066666666667, 86, 584, 109.0, 133.90000000000003, 154.0, 568.7800000000002, 21.48997134670487, 147.3448133058739, 19.54873858345272], "isController": false}, {"data": ["MD Sản xuất_Add-2", 300, 0, 0.0, 33.949999999999996, 25, 98, 31.0, 44.900000000000034, 50.94999999999999, 71.93000000000006, 22.323089515588958, 107.7350667832428, 4.948575507850286], "isController": false}, {"data": ["MD Sản xuất_Delete-1", 300, 0, 0.0, 44.440000000000026, 29, 102, 42.0, 58.900000000000034, 66.94999999999999, 75.99000000000001, 22.168033695411218, 21.345391819995566, 7.966637109288406], "isController": false}, {"data": ["MD Sản xuất_View", 300, 0, 0.0, 500.71666666666715, 86, 15332, 109.0, 155.0, 245.4999999999999, 15273.97, 11.497777096428024, 78.83387987697378, 8.948953462747202], "isController": false}, {"data": ["MD Sản xuất_View-2", 300, 0, 0.0, 33.67333333333333, 25, 82, 31.5, 44.0, 47.0, 73.98000000000002, 21.679433444139327, 104.6286719540396, 4.805890031073855], "isController": false}, {"data": ["MD Sản xuất_View-1", 300, 0, 0.0, 44.50666666666666, 31, 128, 42.5, 55.900000000000034, 63.849999999999966, 127.94000000000005, 21.553272505208707, 20.290385444356634, 7.3668411883037574], "isController": false}, {"data": ["MD Sản xuất_View-0", 300, 0, 0.0, 422.3366666666667, 25, 15261, 32.0, 63.50000000000017, 166.84999999999974, 15186.95, 11.544233655289183, 12.570137232077577, 2.4802064493785356], "isController": false}]}, function(index, item){
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
