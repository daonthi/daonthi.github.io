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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9978125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-2"], "isController": false}, {"data": [0.975, 500, 1500, "Phương pháp kiểm tra_View"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-1"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Update"], "isController": false}, {"data": [0.995, 500, 1500, "Phương pháp kiểm tra_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Phương pháp kiểm tra_Add-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 0, 0.0, 109.40187500000002, 27, 661, 75.0, 219.9000000000001, 285.89999999999964, 447.96000000000004, 20.497841321085872, 70.5614166570583, 9.187997232791421], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Phương pháp kiểm tra_Update-0", 100, 0, 0.0, 80.37000000000002, 28, 391, 64.5, 120.9, 201.99999999999977, 390.4499999999997, 1.3088833915786444, 1.4200873516053456, 0.4767710010340179], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-2", 100, 0, 0.0, 62.38000000000002, 32, 117, 54.0, 100.9, 111.94999999999999, 116.99, 1.3090375955597444, 6.317640427008064, 0.28890868808252174], "isController": false}, {"data": ["Phương pháp kiểm tra_Update-1", 100, 0, 0.0, 72.07999999999998, 38, 187, 61.0, 109.70000000000002, 137.95, 186.71999999999986, 1.309328968903437, 1.2300531914893618, 0.4449672667757774], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-1", 100, 0, 0.0, 75.26000000000003, 39, 151, 75.0, 106.80000000000001, 116.84999999999997, 150.88999999999993, 1.3046654837699614, 1.286828260359044, 0.4994422555056884], "isController": false}, {"data": ["Phương pháp kiểm tra_View-0", 100, 0, 0.0, 116.68000000000006, 27, 443, 73.0, 331.8, 397.6499999999999, 442.72999999999985, 1.349327360310885, 1.463967477837298, 0.2885768475664881], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-2", 100, 0, 0.0, 60.279999999999994, 29, 121, 53.0, 94.10000000000005, 115.94999999999999, 120.99, 1.3052955841850387, 6.299580836955529, 0.31867567973267547], "isController": false}, {"data": ["Phương pháp kiểm tra_View", 100, 0, 0.0, 248.50000000000003, 107, 606, 198.5, 478.6, 522.5999999999997, 605.5699999999998, 1.3464930588282817, 9.224266413750387, 1.0427431598152612], "isController": false}, {"data": ["Phương pháp kiểm tra_View-1", 100, 0, 0.0, 72.50000000000001, 38, 158, 65.5, 106.70000000000002, 127.59999999999991, 157.98, 1.355527842541886, 1.2734548677004824, 0.46066766523884395], "isController": false}, {"data": ["Phương pháp kiểm tra_View-2", 100, 0, 0.0, 59.17, 28, 142, 53.0, 84.0, 111.64999999999992, 141.83999999999992, 1.356557599435672, 6.546980133213957, 0.2993965014379511], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete-0", 100, 0, 0.0, 74.69000000000004, 27, 444, 65.5, 103.9, 162.74999999999972, 442.039999999999, 1.3052444722896597, 1.5334073243793562, 0.43975521771477794], "isController": false}, {"data": ["Phương pháp kiểm tra_Add", 100, 0, 0.0, 201.59999999999997, 114, 436, 193.0, 270.30000000000007, 302.9, 434.8799999999994, 1.327192854393672, 9.092048704659774, 1.2248019994160353], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-2", 100, 0, 0.0, 64.06, 33, 143, 53.0, 104.60000000000002, 115.0, 142.76999999999987, 1.3313629162173315, 6.425386261666067, 0.2938359561182783], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-1", 100, 0, 0.0, 75.3, 39, 188, 70.0, 111.9, 139.5499999999999, 187.8499999999999, 1.330831370357062, 1.2502536897299743, 0.45227472351978276], "isController": false}, {"data": ["Phương pháp kiểm tra_Update", 100, 0, 0.0, 215.01999999999998, 109, 512, 196.0, 320.40000000000003, 380.0999999999998, 511.8299999999999, 1.3059604032805725, 8.946593973645719, 1.207758302643264], "isController": false}, {"data": ["Phương pháp kiểm tra_Delete", 100, 0, 0.0, 210.47000000000003, 117, 661, 203.0, 287.9, 311.24999999999983, 658.3499999999987, 1.302727912248248, 9.102556847789272, 1.2556566888564655], "isController": false}, {"data": ["Phương pháp kiểm tra_Add-0", 100, 0, 0.0, 62.070000000000014, 30, 144, 56.5, 96.80000000000001, 106.94999999999999, 143.76999999999987, 1.329168605037549, 1.4420960158171063, 0.48156401608294014], "isController": false}]}, function(index, item){
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
