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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9916666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-2"], "isController": false}, {"data": [0.8, 500, 1500, "LAB_Kiểm tra độ sạch"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120, 0, 0.0, 135.9416666666666, 39, 568, 87.0, 275.9, 369.79999999999995, 563.3799999999999, 2.0476417991945945, 7.0017751561326875, 0.7848627013514436], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LAB_Kiểm tra độ bền-0", 5, 0, 0.0, 77.6, 66, 97, 71.0, 97.0, 97.0, 97.0, 0.1567348985925206, 0.16882675112065454, 0.03321432909626657], "isController": false}, {"data": ["LAB_Kiểm tra độ bền-2", 5, 0, 0.0, 62.8, 48, 102, 51.0, 102.0, 102.0, 102.0, 0.15681354869060687, 0.7568091383095499, 0.03430296377607025], "isController": false}, {"data": ["LAB_Lịch sử", 5, 0, 0.0, 271.0, 259, 284, 272.0, 284.0, 284.0, 284.0, 0.15595271513677053, 1.0665399063503946, 0.11955359509996569], "isController": false}, {"data": ["LAB_Lịch sử-0", 5, 0, 0.0, 117.0, 115, 118, 117.0, 118.0, 118.0, 118.0, 0.15664651148218928, 0.168731545082866, 0.03319559862464363], "isController": false}, {"data": ["LAB_Kiểm tra độ bền-1", 5, 0, 0.0, 69.0, 50, 75, 73.0, 75.0, 75.0, 75.0, 0.15670051397768583, 0.1466006761627178, 0.05264157891437884], "isController": false}, {"data": ["LAB_Kiểm tra QC", 5, 0, 0.0, 188.6, 177, 206, 182.0, 206.0, 206.0, 206.0, 0.15617191404297853, 1.0680389785575963, 0.11972163332396303], "isController": false}, {"data": ["LAB_Kiểm tra độ dày", 5, 0, 0.0, 224.0, 194, 244, 229.0, 244.0, 244.0, 244.0, 0.15592353509838774, 1.0663403479433686, 0.11953122563694764], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch-2", 5, 0, 0.0, 76.4, 39, 107, 71.0, 107.0, 107.0, 107.0, 0.1563868384836732, 0.7547497615100712, 0.03420962091830351], "isController": false}, {"data": ["LAB_Kiểm tra độ dày-1", 5, 0, 0.0, 66.8, 55, 74, 67.0, 74.0, 74.0, 74.0, 0.15667105345616344, 0.14657311446387164, 0.0526316820204299], "isController": false}, {"data": ["LAB_Kiểm tra độ bền", 5, 0, 0.0, 209.8, 190, 243, 195.0, 243.0, 243.0, 243.0, 0.15613290032475644, 1.067772168920185, 0.11969172534661504], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch-1", 5, 0, 0.0, 77.2, 64, 87, 76.0, 87.0, 87.0, 87.0, 0.15636727545659243, 0.14628891590567927, 0.05252963159869903], "isController": false}, {"data": ["LAB_Kiểm tra độ dày-2", 5, 0, 0.0, 84.8, 73, 103, 83.0, 103.0, 103.0, 103.0, 0.15663669684533693, 0.7559556209078663, 0.03426427743491745], "isController": false}, {"data": ["LAB_Lịch sử QC-0", 5, 0, 0.0, 116.6, 103, 140, 118.0, 140.0, 140.0, 140.0, 0.15663669684533693, 0.16872097326211585, 0.033193518765076285], "isController": false}, {"data": ["LAB_Lịch sử QC-1", 5, 0, 0.0, 95.4, 50, 122, 103.0, 122.0, 122.0, 122.0, 0.15654351909830932, 0.1464538000939261, 0.05258883844708829], "isController": false}, {"data": ["LAB_Lịch sử QC-2", 5, 0, 0.0, 64.2, 53, 74, 62.0, 74.0, 74.0, 74.0, 0.15648472709063596, 0.7552221887518777, 0.034231034051076616], "isController": false}, {"data": ["LAB_Lịch sử-2", 5, 0, 0.0, 62.8, 50, 75, 63.0, 75.0, 75.0, 75.0, 0.15697601406505085, 0.7575932241303529, 0.03433850307672988], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch", 5, 0, 0.0, 462.6, 366, 568, 423.0, 568.0, 568.0, 568.0, 0.1542353013757789, 1.054794741732988, 0.1182370230273305], "isController": false}, {"data": ["LAB_Lịch sử-1", 5, 0, 0.0, 90.6, 80, 94, 93.0, 94.0, 94.0, 94.0, 0.1567594682718836, 0.14665583066842236, 0.052661383872585905], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch-0", 5, 0, 0.0, 308.6, 213, 378, 307.0, 378.0, 378.0, 378.0, 0.1549426712116517, 0.16689625619770684, 0.032834530911062906], "isController": false}, {"data": ["LAB_Kiểm tra độ dày-0", 5, 0, 0.0, 71.6, 65, 82, 66.0, 82.0, 82.0, 82.0, 0.15655332206149414, 0.1686311662439727, 0.0331758504759221], "isController": false}, {"data": ["LAB_Kiểm tra QC-1", 5, 0, 0.0, 64.0, 50, 81, 58.0, 81.0, 81.0, 81.0, 0.15679879578524836, 0.14669262340065228, 0.05267459545910687], "isController": false}, {"data": ["LAB_Kiểm tra QC-0", 5, 0, 0.0, 68.8, 46, 77, 74.0, 77.0, 77.0, 77.0, 0.15666614444618518, 0.16875269269935766, 0.03319975912580291], "isController": false}, {"data": ["LAB_Kiểm tra QC-2", 5, 0, 0.0, 55.6, 48, 78, 51.0, 78.0, 78.0, 78.0, 0.1569464498713039, 0.7574505422499843, 0.03433203590934773], "isController": false}, {"data": ["LAB_Lịch sử QC", 5, 0, 0.0, 276.8, 226, 324, 273.0, 324.0, 324.0, 324.0, 0.1557389814670612, 1.0650782101697556, 0.11938974653480768], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
