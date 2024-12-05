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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9944791666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.9816666666666667, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 0, 0.0, 78.23000000000019, 24, 1284, 47.0, 141.0, 177.94999999999982, 542.0, 109.88507852204569, 378.26650565450296, 49.255127970331024], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 300, 0, 0.0, 47.74666666666667, 24, 409, 38.0, 70.0, 99.0, 303.7800000000002, 7.20876585928489, 7.821229364907728, 2.625849282727797], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 300, 0, 0.0, 46.0366666666667, 24, 704, 35.0, 59.0, 72.94999999999999, 321.39000000000055, 7.225955632632416, 34.87370384420839, 1.594790989233326], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 300, 0, 0.0, 58.923333333333325, 32, 614, 47.0, 78.0, 94.89999999999998, 360.5500000000004, 7.21795828020114, 6.780933462454587, 2.452978009287106], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 300, 0, 0.0, 55.23, 32, 446, 48.0, 75.90000000000003, 93.0, 169.85000000000014, 7.213792771779643, 7.115166698727967, 2.7615300454468943], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 300, 0, 0.0, 58.52333333333337, 24, 870, 37.0, 70.90000000000003, 167.5999999999999, 563.5200000000013, 7.02543206407194, 7.622319358578053, 1.5025093965153857], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 300, 0, 0.0, 46.67666666666663, 25, 743, 35.5, 60.0, 72.0, 374.50000000000045, 7.224041610479676, 34.86446644432672, 1.7636820338085148], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 300, 0, 0.0, 165.58333333333348, 89, 1284, 122.5, 205.30000000000024, 410.1499999999998, 1053.4200000000005, 7.001657058837258, 47.96545338646813, 5.4221816871659625], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 300, 0, 0.0, 56.286666666666676, 33, 575, 48.0, 71.0, 88.89999999999998, 301.82000000000016, 7.103786318107551, 6.673674255878383, 2.4141773815443632], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 300, 0, 0.0, 50.626666666666665, 25, 753, 34.5, 56.0, 68.94999999999999, 677.4600000000005, 7.111026832274581, 34.31903770029392, 1.5694258438418507], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 300, 0, 0.0, 49.83666666666663, 24, 612, 38.0, 68.0, 115.74999999999994, 386.51000000000045, 7.210845111047015, 8.471334637294492, 2.4294351204211133], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 300, 0, 0.0, 155.82333333333335, 90, 1200, 122.0, 185.7000000000001, 273.7499999999997, 1105.1600000000017, 7.0754716981132075, 48.47112691627358, 6.529610112028302], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 300, 0, 0.0, 45.23666666666666, 24, 685, 35.0, 56.900000000000034, 69.94999999999999, 331.8100000000002, 7.224737501204123, 34.867824932569114, 1.594522143820441], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 300, 0, 0.0, 59.53999999999998, 32, 677, 47.0, 73.90000000000003, 90.89999999999998, 379.93000000000006, 7.177720356014929, 6.743131818834338, 2.4393034022394486], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 300, 0, 0.0, 152.84666666666678, 89, 1109, 125.5, 190.7000000000001, 269.6499999999999, 870.1900000000016, 7.184252119354375, 49.21633654030365, 6.644030036160736], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 300, 0, 0.0, 151.88666666666666, 91, 832, 123.5, 199.0, 281.95, 743.6400000000003, 7.186145112223633, 50.2117854276954, 6.926489478285865], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 300, 0, 0.0, 50.87666666666667, 24, 694, 37.0, 67.0, 100.0, 554.3500000000015, 7.099079486026645, 7.702223934546487, 2.5720297747225445], "isController": false}]}, function(index, item){
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
