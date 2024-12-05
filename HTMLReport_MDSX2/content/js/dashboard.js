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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9990625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MD Sản xuất_Delete-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "MD Sản xuất_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-0"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "MD Sản xuất_Update-2"], "isController": false}, {"data": [0.9975, 500, 1500, "MD Sản xuất_Update"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-0"], "isController": false}, {"data": [0.9975, 500, 1500, "MD Sản xuất_Delete"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "MD Sản xuất_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "MD Sản xuất_Delete-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "MD Sản xuất_View"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "MD Sản xuất_View-2"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "MD Sản xuất_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9600, 0, 0.0, 72.29739583333344, 26, 1243, 48.0, 138.0, 163.0, 233.0, 237.47680890538032, 815.9206864564007, 103.89610389610391], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MD Sản xuất_Delete-2", 600, 0, 0.0, 44.091666666666676, 26, 204, 39.0, 62.0, 72.94999999999993, 100.98000000000002, 15.41148669474982, 74.37848363813829, 3.5819666341313057], "isController": false}, {"data": ["MD Sản xuất_Update-1", 600, 0, 0.0, 55.64333333333334, 32, 973, 49.0, 70.0, 83.94999999999993, 112.0, 15.417030679891052, 14.513689038491187, 5.269492908165887], "isController": false}, {"data": ["MD Sản xuất_Update-0", 600, 0, 0.0, 43.070000000000036, 27, 159, 38.0, 62.0, 76.0, 112.81000000000017, 15.399224905679748, 16.76771071272746, 5.3160410196853425], "isController": false}, {"data": ["MD Sản xuất_Update-2", 600, 0, 0.0, 45.12500000000003, 26, 1047, 39.0, 59.89999999999998, 70.89999999999986, 122.96000000000004, 15.44202805301763, 74.5258814824347, 3.4231839531591817], "isController": false}, {"data": ["MD Sản xuất_Update", 600, 0, 0.0, 143.96499999999986, 98, 1237, 129.5, 180.0, 207.94999999999993, 298.97, 15.340952673161004, 105.18440304517911, 13.940191857789369], "isController": false}, {"data": ["MD Sản xuất_Add-1", 600, 0, 0.0, 52.30666666666664, 32, 153, 48.0, 70.0, 80.0, 110.99000000000001, 15.41742683146183, 14.514061978055862, 5.269628311534805], "isController": false}, {"data": ["MD Sản xuất_Add-0", 600, 0, 0.0, 43.44000000000001, 26, 178, 38.0, 63.0, 75.0, 129.96000000000004, 15.413466231664398, 16.783217625298636, 5.336009549926786], "isController": false}, {"data": ["MD Sản xuất_Delete", 600, 0, 0.0, 145.7800000000002, 100, 1243, 131.0, 183.0, 209.0, 299.6500000000003, 15.34958684028755, 106.17297225562179, 13.865593581314437], "isController": false}, {"data": ["MD Sản xuất_Delete-0", 600, 0, 0.0, 45.404999999999994, 26, 959, 38.0, 64.89999999999998, 76.94999999999993, 116.93000000000006, 15.410299216643123, 17.38173397970977, 4.800669384872223], "isController": false}, {"data": ["MD Sản xuất_Add", 600, 0, 0.0, 138.46000000000012, 90, 464, 128.0, 178.0, 201.89999999999986, 318.8800000000001, 15.331544653123803, 105.11989747029514, 13.946615082407053], "isController": false}, {"data": ["MD Sản xuất_Add-2", 600, 0, 0.0, 42.586666666666645, 26, 187, 38.5, 58.0, 67.94999999999993, 95.98000000000002, 15.437657592754592, 74.50478889003242, 3.4222151108938403], "isController": false}, {"data": ["MD Sản xuất_Delete-1", 600, 0, 0.0, 56.124999999999986, 33, 969, 50.0, 73.89999999999998, 82.0, 107.0, 15.409111921516256, 14.837289408803738, 5.537649596794904], "isController": false}, {"data": ["MD Sản xuất_View", 600, 0, 0.0, 150.44500000000002, 98, 1221, 131.0, 207.89999999999998, 246.8499999999998, 422.93000000000006, 15.208739955894654, 104.27789377962536, 11.837271235203163], "isController": false}, {"data": ["MD Sản xuất_View-2", 600, 0, 0.0, 44.98999999999999, 27, 1023, 39.0, 61.0, 73.8499999999998, 103.99000000000001, 15.452766045122077, 74.57770487792314, 3.4255643478932725], "isController": false}, {"data": ["MD Sản xuất_View-1", 600, 0, 0.0, 55.66666666666666, 34, 1004, 49.5, 74.0, 87.0, 117.97000000000003, 15.453960077269802, 14.548454603992273, 5.282115260785576], "isController": false}, {"data": ["MD Sản xuất_View-0", 600, 0, 0.0, 49.65833333333334, 27, 497, 38.0, 72.89999999999998, 97.94999999999993, 233.0, 15.30221882172915, 16.662083970925785, 3.2875860749808723], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
