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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9916666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.98, 500, 1500, "ViewMD_Bể-0"], "isController": false}, {"data": [0.97, 500, 1500, "Add_Bể"], "isController": false}, {"data": [0.99, 500, 1500, "Update_Bể"], "isController": false}, {"data": [0.96, 500, 1500, "ViewMD_Bể"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "ViewMD_Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "ViewMD_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 0, 0.0, 109.20750000000021, 24, 936, 67.0, 207.0, 310.8000000000002, 560.99, 46.23564768436464, 158.77700691608229, 20.36355186098482], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ViewMD_Bể-0", 100, 0, 0.0, 103.24000000000004, 29, 736, 63.0, 259.9000000000003, 389.39999999999964, 734.2799999999991, 4.064875411568636, 4.457866296085525, 0.881252286492419], "isController": false}, {"data": ["Add_Bể", 100, 0, 0.0, 217.87999999999994, 132, 752, 174.0, 429.00000000000017, 510.79999999999995, 750.2399999999991, 4.007534164228749, 27.524402125996875, 3.7218408107241614], "isController": false}, {"data": ["Update_Bể", 100, 0, 0.0, 197.85999999999996, 109, 601, 171.0, 317.9000000000002, 427.0999999999998, 600.5899999999998, 3.977566524800127, 27.318579461835252, 3.6901251939063684], "isController": false}, {"data": ["ViewMD_Bể", 100, 0, 0.0, 239.76999999999998, 117, 936, 180.5, 445.80000000000007, 607.8499999999997, 935.8799999999999, 4.042363974452259, 27.76361897687768, 3.1778349603848333], "isController": false}, {"data": ["Add_Bể-2", 100, 0, 0.0, 71.71, 30, 472, 52.5, 83.30000000000004, 283.44999999999806, 471.0899999999995, 4.044325810887325, 19.518611481840978, 0.9044439557550756], "isController": false}, {"data": ["Update_Bể-2", 100, 0, 0.0, 64.38999999999999, 28, 465, 53.0, 75.9, 96.89999999999998, 463.099999999999, 4.014290875516839, 19.3736577214885, 0.8977271586849183], "isController": false}, {"data": ["ViewMD_Bể-1", 100, 0, 0.0, 71.02999999999997, 37, 329, 60.0, 93.0, 127.19999999999982, 328.65999999999985, 4.115395695296103, 3.890334993209597, 1.4227051524754106], "isController": false}, {"data": ["Update_Bể-0", 100, 0, 0.0, 65.25, 26, 299, 55.0, 97.70000000000002, 136.84999999999997, 298.15999999999957, 4.033071183706392, 4.422987245412381, 1.4454464105666465], "isController": false}, {"data": ["ViewMD_Bể-2", 100, 0, 0.0, 65.33999999999997, 24, 473, 51.0, 80.70000000000002, 97.74999999999994, 472.76999999999987, 4.123201253453181, 19.89927792438049, 0.9220830928132602], "isController": false}, {"data": ["Update_Bể-1", 100, 0, 0.0, 68.01000000000002, 33, 316, 56.0, 90.9, 122.49999999999989, 315.8399999999999, 4.006731308598446, 3.787613190159468, 1.3851395344178221], "isController": false}, {"data": ["Add_Bể-0", 100, 0, 0.0, 77.05000000000004, 29, 399, 58.5, 132.40000000000003, 291.0999999999982, 398.7599999999999, 4.108632236328527, 4.505853516989195, 1.4765397099305642], "isController": false}, {"data": ["Add_Bể-1", 100, 0, 0.0, 68.96000000000004, 35, 374, 54.5, 90.9, 113.74999999999994, 373.31999999999965, 4.079800905715801, 3.856686793684468, 1.4103999224837829], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
