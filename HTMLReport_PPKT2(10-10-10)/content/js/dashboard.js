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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.985, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [0.99, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [0.98, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [0.985, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.955, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [0.99, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [0.96, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [0.99, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [0.96, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [0.97, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 0, 0.0, 99.76, 25, 1288, 51.0, 179.80000000000018, 297.9499999999998, 864.6700000000003, 79.82438635002994, 274.78609558970265, 35.78065755338256], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 100, 0, 0.0, 67.39999999999999, 27, 937, 44.0, 104.80000000000001, 142.74999999999994, 931.3699999999972, 5.580668564093979, 6.054807397176181, 2.0328021234443887], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 100, 0, 0.0, 67.11000000000001, 26, 1001, 39.0, 78.70000000000002, 122.94999999999999, 997.5299999999982, 5.589714924538848, 26.976924958077138, 1.233667551704863], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 100, 0, 0.0, 63.690000000000005, 33, 594, 48.5, 88.90000000000006, 107.34999999999985, 591.4799999999987, 5.5853440571939235, 5.24716892873101, 1.8981442694369974], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 100, 0, 0.0, 63.74000000000001, 30, 381, 49.0, 88.40000000000003, 193.1999999999989, 380.92999999999995, 5.643659348721711, 5.566499943563406, 2.16046334443253], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 100, 0, 0.0, 88.03, 25, 906, 47.0, 174.4000000000001, 432.64999999999856, 903.6799999999988, 5.247691015952981, 5.693539764378673, 1.1223089184508817], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 100, 0, 0.0, 71.36, 26, 751, 41.5, 81.50000000000003, 362.9499999999975, 750.0399999999995, 5.644933672029354, 27.243420124188543, 1.3781576347727915], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 100, 0, 0.0, 212.77000000000004, 97, 1288, 144.5, 456.60000000000105, 660.3999999999992, 1285.6699999999987, 5.2088759245754765, 35.68385215907907, 4.033826765808938], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 100, 0, 0.0, 63.47000000000001, 32, 376, 49.0, 90.10000000000005, 114.64999999999992, 375.98, 5.412719891745603, 5.084996617050067, 1.8394790257104194], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 100, 0, 0.0, 61.17000000000001, 26, 572, 40.0, 78.70000000000002, 106.49999999999989, 571.6799999999998, 5.425935973955507, 26.1864995930548, 1.197521025501899], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 100, 0, 0.0, 55.620000000000005, 26, 942, 41.5, 69.9, 86.0, 933.9699999999959, 5.648760097158673, 6.636189840704965, 1.9031467124216235], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 100, 0, 0.0, 196.41000000000005, 95, 1009, 127.5, 476.20000000000044, 603.4499999999991, 1007.5599999999993, 5.363368195226602, 36.74221473585412, 4.949592719227675], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 100, 0, 0.0, 69.32000000000002, 26, 776, 39.0, 108.40000000000003, 272.1499999999989, 773.9299999999989, 5.590027391134216, 26.978432975571582, 1.233736514058919], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 100, 0, 0.0, 68.20000000000005, 32, 602, 48.0, 91.9, 191.84999999999928, 599.909999999999, 5.48456096089508, 5.152487933965886, 1.8638937640541875], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 100, 0, 0.0, 198.30999999999995, 93, 1151, 129.0, 415.9000000000008, 686.1499999999985, 1150.7199999999998, 5.535259603675413, 37.919771601350604, 5.1190340280084135], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 100, 0, 0.0, 190.84999999999988, 96, 1067, 130.5, 241.40000000000003, 939.3999999999971, 1066.1999999999996, 5.604124635731899, 39.15772633658372, 5.401631851042366], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 100, 0, 0.0, 58.709999999999994, 26, 432, 42.5, 88.40000000000003, 137.69999999999993, 431.30999999999966, 5.40452899529806, 5.863702845484516, 1.9580861887261525], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
