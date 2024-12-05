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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999652777777778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [0.9997222222222222, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.9997222222222222, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28800, 0, 0.0, 86.63784722222185, 26, 751, 61.0, 177.0, 196.0, 247.9900000000016, 79.8367781424643, 274.82875288299476, 35.78621207753039], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 1800, 0, 0.0, 57.80611111111113, 27, 316, 54.0, 81.0, 101.0, 139.0, 5.007316245403006, 5.432742527971425, 1.823954062046212], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 1800, 0, 0.0, 52.30277777777778, 27, 225, 51.0, 77.0, 84.94999999999982, 106.0, 5.007734167213807, 24.168185795283826, 1.10522257987336], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 1800, 0, 0.0, 62.33111111111106, 34, 359, 57.0, 81.0, 89.0, 121.98000000000002, 5.007720235362851, 4.704518424237366, 1.701842423736594], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 1800, 0, 0.0, 62.02499999999998, 34, 343, 56.0, 82.0, 90.94999999999982, 130.98000000000002, 5.008500538413808, 4.940024945115182, 1.9173166123615357], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 1800, 0, 0.0, 59.61777777777773, 26, 597, 54.0, 84.0, 103.94999999999982, 218.93000000000006, 5.000652863012672, 5.425513018366287, 1.0694755634763429], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 1800, 0, 0.0, 52.87277777777786, 27, 347, 51.0, 76.0, 84.0, 113.97000000000003, 5.008528410877411, 24.172018951715003, 1.2227852565618678], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 1800, 0, 0.0, 174.6861111111112, 102, 751, 170.0, 217.0, 242.94999999999982, 340.0, 4.999083501358084, 34.24665113479196, 3.8713605630634387], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 1800, 0, 0.0, 62.608888888888856, 36, 323, 57.0, 82.0, 90.0, 120.97000000000003, 5.007929221267006, 4.704714756698105, 1.701913446289959], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 1800, 0, 0.0, 52.28388888888888, 28, 197, 50.0, 77.0, 83.0, 103.0, 5.008751401754733, 24.173095144015516, 1.1054470867154], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 1800, 0, 0.0, 56.92666666666658, 27, 251, 54.0, 78.0, 92.94999999999982, 121.0, 5.008096422549789, 5.883535152663472, 1.687298111112966], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 1800, 0, 0.0, 174.13166666666686, 102, 479, 169.0, 219.0, 246.94999999999982, 317.99, 5.005227682245901, 34.28874237397949, 4.619082187228884], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 1800, 0, 0.0, 52.69555555555557, 27, 201, 51.0, 75.0, 85.0, 118.99000000000001, 5.0072465985495676, 24.16583270510934, 1.10511497194551], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 1800, 0, 0.0, 63.46166666666664, 35, 370, 58.0, 83.0, 92.0, 153.92000000000007, 5.0069262479763665, 4.703772510305923, 1.7015725920857185], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 1800, 0, 0.0, 172.62111111111156, 99, 497, 169.0, 214.9000000000001, 234.94999999999982, 304.0, 5.00572877849094, 34.29217517686908, 4.62932143870207], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 1800, 0, 0.0, 172.02055555555535, 105, 489, 168.0, 211.0, 229.94999999999982, 300.98, 5.006592012816876, 34.98258383955541, 4.825689762353766], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 1800, 0, 0.0, 57.81388888888894, 26, 309, 53.0, 81.0, 95.0, 146.99, 5.007163024882818, 5.432576289692198, 1.8141186349917242], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
