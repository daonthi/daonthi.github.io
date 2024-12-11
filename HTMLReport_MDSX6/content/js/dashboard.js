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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.999702380952381, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MD Sản xuất_Delete-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-1"], "isController": false}, {"data": [0.9952380952380953, 500, 1500, "MD Sản xuất_View"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1680, 0, 0.0, 94.94940476190474, 26, 542, 68.0, 185.0, 216.0, 295.19000000000005, 53.85996409335727, 185.051580733842, 23.576445382630162], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MD Sản xuất_Delete-2", 105, 0, 0.0, 58.390476190476214, 28, 137, 52.0, 86.4, 92.09999999999997, 135.85999999999996, 3.5178236397748592, 16.97762151149156, 0.8176191662757974], "isController": false}, {"data": ["MD Sản xuất_Update-1", 105, 0, 0.0, 63.56190476190476, 40, 116, 55.0, 93.0, 98.0, 115.21999999999997, 3.5169988276670576, 3.310924677608441, 1.2020992086752638], "isController": false}, {"data": ["MD Sản xuất_Update-0", 105, 0, 0.0, 65.38095238095238, 27, 137, 59.0, 114.80000000000001, 129.2999999999999, 137.0, 3.511940598033313, 3.824036881647602, 1.2156893333166099], "isController": false}, {"data": ["MD Sản xuất_Update-2", 105, 0, 0.0, 56.542857142857144, 26, 118, 51.0, 76.0, 95.89999999999992, 117.94, 3.5215991414005905, 16.995842731251678, 0.7806669971659512], "isController": false}, {"data": ["MD Sản xuất_Update", 105, 0, 0.0, 185.68571428571434, 120, 295, 173.0, 271.4, 282.7, 294.64, 3.4944089456869007, 23.95922383561302, 3.178638137313632], "isController": false}, {"data": ["MD Sản xuất_Add-1", 105, 0, 0.0, 65.5238095238095, 41, 117, 62.0, 93.4, 95.69999999999999, 117.0, 3.516763238101618, 3.3107028921191013, 1.202018684898014], "isController": false}, {"data": ["MD Sản xuất_Add-0", 105, 0, 0.0, 65.29523809523808, 33, 145, 58.0, 94.20000000000005, 134.7, 144.88, 3.5122930255895635, 3.8244206284495736, 1.2192413028934606], "isController": false}, {"data": ["MD Sản xuất_Delete", 105, 0, 0.0, 186.39047619047616, 109, 318, 173.0, 251.4, 276.4, 316.37999999999994, 3.4911557387950527, 24.14829697059117, 3.153631892954515], "isController": false}, {"data": ["MD Sản xuất_Delete-0", 105, 0, 0.0, 65.9904761904762, 27, 144, 64.0, 93.40000000000003, 112.39999999999998, 143.88, 3.509944843723884, 3.958970990723717, 1.0934300831522648], "isController": false}, {"data": ["MD Sản xuất_Add", 105, 0, 0.0, 186.58095238095243, 122, 314, 172.0, 264.0000000000001, 288.79999999999995, 313.28, 3.493478839499601, 23.952846613404976, 3.181203680213601], "isController": false}, {"data": ["MD Sản xuất_Add-2", 105, 0, 0.0, 55.580952380952404, 28, 132, 51.0, 78.80000000000001, 89.69999999999999, 131.21999999999997, 3.5215991414005905, 16.995842731251678, 0.7806669971659512], "isController": false}, {"data": ["MD Sản xuất_Delete-1", 105, 0, 0.0, 61.85714285714284, 38, 121, 55.0, 87.4, 94.0, 120.39999999999998, 3.513821029382237, 3.383425327120005, 1.2627794324342412], "isController": false}, {"data": ["MD Sản xuất_View", 105, 0, 0.0, 201.2571428571429, 126, 542, 180.0, 293.20000000000005, 345.1999999999996, 536.3599999999998, 3.465918468394124, 23.763880436128073, 2.697594745420036], "isController": false}, {"data": ["MD Sản xuất_View-2", 105, 0, 0.0, 56.53333333333333, 28, 106, 52.0, 81.0, 85.09999999999997, 105.63999999999999, 3.5225442834138487, 17.000404149053946, 0.7808765159520934], "isController": false}, {"data": ["MD Sản xuất_View-1", 105, 0, 0.0, 64.67619047619048, 35, 119, 60.0, 93.0, 100.39999999999998, 118.45999999999998, 3.5175879396984926, 3.3114792713567835, 1.2023005653266332], "isController": false}, {"data": ["MD Sản xuất_View-0", 105, 0, 0.0, 79.94285714285714, 40, 395, 59.0, 138.40000000000003, 239.19999999999948, 391.8799999999999, 3.48420493761614, 3.7938364310957, 0.7485596545659676], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1680, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
