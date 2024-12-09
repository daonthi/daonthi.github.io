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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9995833333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "ViewMD_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể"], "isController": false}, {"data": [0.995, 500, 1500, "ViewMD_Bể"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "ViewMD_Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "ViewMD_Bể-2"], "isController": false}, {"data": [1.0, 500, 1500, "Update_Bể-1"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-0"], "isController": false}, {"data": [1.0, 500, 1500, "Add_Bể-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 0, 0.0, 100.45666666666666, 26, 629, 72.0, 199.0, 221.0, 325.8700000000001, 48.10969009341298, 165.21262227879564, 21.188935773563724], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ViewMD_Bể-0", 100, 0, 0.0, 84.78999999999999, 31, 474, 64.0, 200.40000000000038, 252.44999999999987, 472.079999999999, 4.132743728561392, 4.532296100756292, 0.8959659255279581], "isController": false}, {"data": ["Add_Bể", 100, 0, 0.0, 192.23000000000002, 100, 294, 186.0, 241.8, 277.7499999999997, 293.92999999999995, 4.163544008660171, 28.59590333291698, 3.866728859605296], "isController": false}, {"data": ["Update_Bể", 100, 0, 0.0, 196.77999999999992, 126, 326, 193.0, 229.8, 293.34999999999985, 325.86999999999995, 4.160945366787334, 28.57805543419465, 3.860252049265593], "isController": false}, {"data": ["ViewMD_Bể", 100, 0, 0.0, 213.97000000000003, 131, 629, 193.5, 327.4000000000002, 393.0, 626.869999999999, 4.106270274709481, 28.20253793167166, 3.228073799942512], "isController": false}, {"data": ["Add_Bể-2", 100, 0, 0.0, 60.31999999999999, 26, 119, 53.5, 81.80000000000001, 97.79999999999995, 118.81999999999991, 4.203270144172166, 20.285704152830903, 0.939989124038502], "isController": false}, {"data": ["Update_Bể-2", 100, 0, 0.0, 59.31000000000001, 29, 112, 54.0, 75.0, 95.79999999999995, 111.88999999999994, 4.200798151648813, 20.273773892039486, 0.9394363053980256], "isController": false}, {"data": ["ViewMD_Bể-1", 100, 0, 0.0, 68.81999999999998, 38, 107, 71.0, 92.9, 99.0, 106.97999999999999, 4.196567208023837, 3.967067438835033, 1.4507663980863652], "isController": false}, {"data": ["Update_Bể-0", 100, 0, 0.0, 67.44, 38, 146, 66.0, 95.70000000000002, 134.69999999999993, 145.92999999999995, 4.187955440154116, 4.592845663372142, 1.5009566860708603], "isController": false}, {"data": ["ViewMD_Bể-2", 100, 0, 0.0, 60.19999999999999, 26, 101, 53.0, 87.0, 93.89999999999998, 100.99, 4.206098843322818, 20.299355941114616, 0.9406217139852787], "isController": false}, {"data": ["Update_Bể-1", 100, 0, 0.0, 69.85000000000001, 38, 107, 72.0, 95.80000000000001, 102.94999999999999, 106.97999999999999, 4.19339958904684, 3.964073049020841, 1.4496713423072083], "isController": false}, {"data": ["Add_Bể-0", 100, 0, 0.0, 63.480000000000004, 39, 142, 54.0, 86.9, 133.1499999999998, 141.98, 4.19058793948791, 4.595732671918871, 1.5059925407534678], "isController": false}, {"data": ["Add_Bể-1", 100, 0, 0.0, 68.29, 35, 108, 72.0, 93.0, 97.89999999999998, 107.92999999999996, 4.1963911036508605, 3.966900965169954, 1.4507055182543014], "isController": false}]}, function(index, item){
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
