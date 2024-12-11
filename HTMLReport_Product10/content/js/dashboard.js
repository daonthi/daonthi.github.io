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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9996153846153846, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Sản phẩm_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-2"], "isController": false}, {"data": [0.995, 500, 1500, "Sản phẩm_View"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Xóa-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sản phẩm_Update-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3900, 0, 0.0, 91.43923076923066, 26, 579, 61.0, 179.0, 202.0, 281.0, 43.347782594198065, 149.94581527175725, 16.67873666222074], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Sản phẩm_Add", 300, 0, 0.0, 166.35333333333358, 106, 292, 159.5, 212.7000000000001, 240.89999999999998, 291.0, 3.3776556817797996, 16.30114685483962, 0.6531013915941408], "isController": false}, {"data": ["Sản phẩm_Xóa", 300, 0, 0.0, 165.91000000000008, 106, 302, 159.0, 211.90000000000003, 235.84999999999997, 292.0, 3.3772754393272466, 22.516268969030385, 2.5428509411340894], "isController": false}, {"data": ["Sản phẩm_Xóa-2", 300, 0, 0.0, 50.08333333333334, 26, 122, 49.0, 72.0, 77.94999999999999, 99.0, 3.3857370185199813, 16.34014877492749, 0.740629972801246], "isController": false}, {"data": ["Sản phẩm_View", 300, 0, 0.0, 179.85333333333335, 104, 579, 161.0, 262.2000000000003, 303.69999999999993, 542.4300000000005, 3.366927790621984, 23.18379673015196, 2.6863085985724227], "isController": false}, {"data": ["Sản phẩm_Xóa-0", 300, 0, 0.0, 56.549999999999976, 27, 138, 51.0, 79.90000000000003, 96.0, 135.99, 3.383255142547817, 3.0627710128338146, 0.9482365487414292], "isController": false}, {"data": ["Sản phẩm_Update", 300, 0, 0.0, 165.76666666666662, 104, 329, 160.5, 211.90000000000003, 229.95, 280.99, 3.3776556817797996, 22.01743327722672, 2.8828819002690866], "isController": false}, {"data": ["Sản phẩm_Xóa-1", 300, 0, 0.0, 59.05000000000001, 36, 108, 54.0, 85.90000000000003, 91.94999999999999, 104.0, 3.3839420669118145, 3.1658364258803893, 0.859204040426828], "isController": false}, {"data": ["Sản phẩm_View-0", 300, 0, 0.0, 68.50666666666675, 27, 432, 50.0, 107.80000000000007, 195.5499999999999, 399.3500000000006, 3.3724158863271017, 3.7379804990051375, 0.7410093500230449], "isController": false}, {"data": ["Sản phẩm_View-1", 300, 0, 0.0, 59.63999999999998, 36, 153, 54.0, 81.90000000000003, 93.0, 135.94000000000005, 3.3853549544669757, 3.220054419580893, 1.190163851179796], "isController": false}, {"data": ["Sản phẩm_View-2", 300, 0, 0.0, 51.463333333333345, 27, 109, 49.0, 74.0, 80.94999999999999, 98.98000000000002, 3.386921965317919, 16.34586753183707, 0.7673495077673411], "isController": false}, {"data": ["Sản phẩm_Update-0", 300, 0, 0.0, 55.066666666666656, 27, 138, 49.0, 76.90000000000003, 92.94999999999999, 134.0, 3.383255142547817, 2.732375002819379, 1.5330374864669796], "isController": false}, {"data": ["Sản phẩm_Update-1", 300, 0, 0.0, 59.296666666666646, 35, 119, 54.0, 80.90000000000003, 91.94999999999999, 112.8900000000001, 3.3847820200379095, 2.9947387794476032, 0.7007556525859734], "isController": false}, {"data": ["Sản phẩm_Update-2", 300, 0, 0.0, 51.169999999999995, 26, 101, 49.0, 74.0, 83.94999999999999, 95.0, 3.3862720530967456, 16.34273094375402, 0.6547674477667536], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
