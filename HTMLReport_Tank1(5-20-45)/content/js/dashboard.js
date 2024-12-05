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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9918518518518519, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9888888888888889, 500, 1500, "ViewMD_Bể-0"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Add_Bể"], "isController": false}, {"data": [0.9822222222222222, 500, 1500, "Update_Bể"], "isController": false}, {"data": [0.98, 500, 1500, "ViewMD_Bể"], "isController": false}, {"data": [0.9955555555555555, 500, 1500, "Add_Bể-2"], "isController": false}, {"data": [0.9955555555555555, 500, 1500, "Update_Bể-2"], "isController": false}, {"data": [0.9955555555555555, 500, 1500, "ViewMD_Bể-1"], "isController": false}, {"data": [0.9955555555555555, 500, 1500, "Update_Bể-0"], "isController": false}, {"data": [0.9977777777777778, 500, 1500, "ViewMD_Bể-2"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Update_Bể-1"], "isController": false}, {"data": [0.9977777777777778, 500, 1500, "Add_Bể-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Add_Bể-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 0, 0.0, 105.95407407407386, 24, 2704, 62.0, 187.0, 225.94999999999982, 750.1599999999817, 61.32879045996593, 210.6080973168654, 27.011020017035776], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ViewMD_Bể-0", 225, 0, 0.0, 91.01333333333336, 24, 2191, 54.0, 115.80000000000007, 249.99999999999966, 1768.1200000000144, 5.194865164388623, 5.6971031050863505, 1.1262305336858147], "isController": false}, {"data": ["Add_Bể", 225, 0, 0.0, 203.61333333333334, 102, 2380, 162.0, 259.6, 366.89999999999947, 1446.0200000000002, 5.2062845639447435, 35.75761654123377, 4.835133418272902], "isController": false}, {"data": ["Update_Bể", 225, 0, 0.0, 211.63555555555556, 95, 2704, 167.0, 238.20000000000002, 344.0999999999996, 2173.1000000000085, 5.206405035172159, 35.758443957388465, 4.830160921302295], "isController": false}, {"data": ["ViewMD_Bể", 225, 0, 0.0, 220.76444444444456, 99, 2703, 168.0, 274.4, 459.9999999999999, 2187.820000000009, 5.176578856551248, 35.55359286926262, 4.069478495628666], "isController": false}, {"data": ["Add_Bể-2", 225, 0, 0.0, 60.35555555555555, 25, 979, 47.0, 83.4, 97.09999999999997, 502.28000000000293, 5.2340187959430535, 25.26027430620173, 1.1704983440146088], "isController": false}, {"data": ["Update_Bể-2", 225, 0, 0.0, 61.857777777777805, 27, 1026, 49.0, 78.80000000000001, 92.69999999999999, 592.3800000000026, 5.234140554121013, 25.26086193209575, 1.1705255731383906], "isController": false}, {"data": ["ViewMD_Bể-1", 225, 0, 0.0, 68.12, 34, 995, 54.0, 91.20000000000002, 107.0, 483.8800000000033, 5.2291531096030495, 4.943183798921632, 1.8077345710932418], "isController": false}, {"data": ["Update_Bể-0", 225, 0, 0.0, 71.51555555555557, 24, 2192, 51.0, 92.0, 137.0, 460.7400000000014, 5.224296461409863, 5.729379810706325, 1.8723796888060742], "isController": false}, {"data": ["ViewMD_Bể-2", 225, 0, 0.0, 61.44, 26, 1338, 49.0, 78.0, 95.0, 334.12000000000126, 5.234871222167935, 25.264388261673762, 1.1706889744887274], "isController": false}, {"data": ["Update_Bể-1", 225, 0, 0.0, 78.03999999999999, 35, 2200, 53.0, 93.4, 124.99999999999977, 521.580000000002, 5.22866703848299, 4.942724309815952, 1.807566534788065], "isController": false}, {"data": ["Add_Bể-0", 225, 0, 0.0, 65.52444444444447, 25, 667, 52.0, 93.0, 134.79999999999995, 322.84000000000015, 5.223932576443547, 5.728980745455179, 1.8773507696593996], "isController": false}, {"data": ["Add_Bể-1", 225, 0, 0.0, 77.56888888888885, 35, 2178, 54.0, 92.4, 100.69999999999999, 866.5200000000059, 5.229031583350764, 4.943068918636268, 1.8076925590880568], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
