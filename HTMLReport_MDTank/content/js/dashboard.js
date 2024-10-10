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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Sửa/Xóa Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "XemMD_Bể"], "isController": false}, {"data": [1.0, 500, 1500, "Sửa/Xóa Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "XemMD_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "Thêm Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "XemMD_Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sửa/Xóa Bể"], "isController": false}, {"data": [1.0, 500, 1500, "XemMD_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Thêm Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Thêm Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "Thêm Bể"], "isController": false}, {"data": [1.0, 500, 1500, "Sửa/Xóa Bể-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 0, 0.0, 81.13333333333331, 28, 356, 43.5, 202.99999999999994, 253.6499999999999, 356.0, 47.43083003952569, 162.8813611660079, 21.421072134387355], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Sửa/Xóa Bể-1", 5, 0, 0.0, 44.4, 36, 54, 44.0, 54.0, 54.0, 54.0, 6.97350069735007, 6.592137377963738, 2.4107609832635983], "isController": false}, {"data": ["XemMD_Bể", 5, 0, 0.0, 251.2, 207, 356, 228.0, 356.0, 356.0, 356.0, 4.96524329692155, 34.1021055734856, 3.9033406777557103], "isController": false}, {"data": ["Sửa/Xóa Bể-0", 5, 0, 0.0, 36.0, 28, 43, 35.0, 43.0, 43.0, 43.0, 7.132667617689016, 7.82225169400856, 2.663605563480742], "isController": false}, {"data": ["XemMD_Bể-0", 5, 0, 0.0, 172.2, 136, 278, 141.0, 278.0, 278.0, 278.0, 5.3418803418803416, 5.858331663995727, 1.1581029647435896], "isController": false}, {"data": ["Thêm Bể-0", 5, 0, 0.0, 34.0, 30, 42, 32.0, 42.0, 42.0, 42.0, 7.320644216691069, 8.028401811859442, 3.0126166727672032], "isController": false}, {"data": ["XemMD_Bể-1", 5, 0, 0.0, 45.2, 41, 51, 45.0, 51.0, 51.0, 51.0, 7.142857142857142, 6.752232142857143, 2.469308035714286], "isController": false}, {"data": ["Sửa/Xóa Bể", 5, 0, 0.0, 115.2, 103, 125, 119.0, 125.0, 125.0, 125.0, 6.385696040868455, 43.85800806194125, 6.020264607279693], "isController": false}, {"data": ["XemMD_Bể-2", 5, 0, 0.0, 33.6, 28, 41, 32.0, 41.0, 41.0, 41.0, 7.320644216691069, 35.33068722547584, 1.6371362554904831], "isController": false}, {"data": ["Thêm Bể-2", 5, 0, 0.0, 31.2, 29, 35, 31.0, 35.0, 35.0, 35.0, 7.267441860465116, 35.073923510174424, 1.6252384629360466], "isController": false}, {"data": ["Thêm Bể-1", 5, 0, 0.0, 55.2, 40, 71, 54.0, 71.0, 71.0, 71.0, 7.062146892655367, 6.675935734463277, 2.44140625], "isController": false}, {"data": ["Thêm Bể", 5, 0, 0.0, 120.8, 105, 134, 126.0, 134.0, 134.0, 134.0, 6.369426751592357, 43.74626791401274, 6.247511942675159], "isController": false}, {"data": ["Sửa/Xóa Bể-2", 5, 0, 0.0, 34.6, 30, 39, 34.0, 39.0, 39.0, 39.0, 7.042253521126761, 33.987125880281695, 1.5748789612676057], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
