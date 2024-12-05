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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9960648148148148, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-1"], "isController": false}, {"data": [0.9908333333333333, 500, 1500, "LAB_Lịch sử"], "isController": false}, {"data": [0.9891666666666666, 500, 1500, "LAB_Kiểm tra QC"], "isController": false}, {"data": [0.9975, 500, 1500, "LAB_Kiểm tra độ sạch_view-2"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "LAB_Kiểm tra độ dày_view"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "LAB_Kiểm tra độ bền_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-1"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "LAB_Lịch sử QC-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Lịch sử QC-1"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "LAB_Kiểm tra độ bền_view"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "LAB_Lịch sử QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-0"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "LAB_Kiểm tra độ bền_kt-1"], "isController": false}, {"data": [0.9975, 500, 1500, "LAB_Kiểm tra độ bền_kt-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_kt-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ dày_kt-1"], "isController": false}, {"data": [0.9975, 500, 1500, "LAB_Kiểm tra QC-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ sạch_kt-2"], "isController": false}, {"data": [0.9841666666666666, 500, 1500, "LAB_Lịch sử QC"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "LAB_Kiểm tra độ sạch_kt-1"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "LAB_Kiểm tra độ sạch_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-0"], "isController": false}, {"data": [0.9891666666666666, 500, 1500, "LAB_Kiểm tra độ sạch_kt"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Lịch sử-2"], "isController": false}, {"data": [0.985, 500, 1500, "LAB_Kiểm tra độ dày_kt"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "LAB_Lịch sử-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-1"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "LAB_Kiểm tra độ bền_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ sạch_view-0"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "LAB_Kiểm tra độ sạch_view"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21600, 0, 0.0, 66.61430555555528, 25, 1515, 40.0, 116.0, 137.0, 424.9900000000016, 388.66396761133603, 1329.0106275303642, 159.41295546558703], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LAB_Kiểm tra độ dày_view-2", 600, 0, 0.0, 40.898333333333376, 25, 763, 31.0, 46.0, 57.0, 437.7000000000003, 11.246907100547348, 54.279506729399415, 2.4602609282447325], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-1", 600, 0, 0.0, 50.02166666666662, 31, 451, 45.0, 64.89999999999998, 75.0, 112.94000000000005, 11.247961307013103, 10.522995050897023, 3.7786120015747144], "isController": false}, {"data": ["LAB_Lịch sử", 600, 0, 0.0, 129.9733333333333, 85, 1505, 108.0, 152.89999999999998, 186.94999999999993, 604.99, 11.236796763802532, 76.84696068057532, 8.614145956625965], "isController": false}, {"data": ["LAB_Kiểm tra QC", 600, 0, 0.0, 130.14333333333332, 85, 1486, 108.0, 155.0, 187.59999999999945, 614.7600000000002, 11.247328759419638, 76.91898759982004, 8.62221980092228], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-2", 600, 0, 0.0, 43.01333333333333, 25, 1358, 31.0, 48.0, 70.0, 332.2200000000016, 11.211181284801375, 54.10708780223476, 2.452445906050301], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view", 600, 0, 0.0, 126.24666666666653, 86, 1039, 109.0, 149.89999999999998, 181.94999999999993, 604.4300000000005, 11.208249271463798, 76.65172817193455, 8.592261404393634], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt", 600, 0, 0.0, 133.435, 87, 1512, 110.0, 152.89999999999998, 195.89999999999986, 575.99, 11.230066631728683, 76.80093420116793, 10.418518847795164], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-1", 600, 0, 0.0, 52.43000000000001, 30, 393, 45.0, 67.0, 81.89999999999986, 369.98, 11.20301734600519, 10.48094786862595, 3.7635136396736186], "isController": false}, {"data": ["LAB_Lịch sử QC-0", 600, 0, 0.0, 37.36666666666667, 25, 657, 31.0, 46.89999999999998, 56.0, 132.7700000000002, 11.241849658997227, 12.10914079479877, 2.382306031252342], "isController": false}, {"data": ["LAB_Lịch sử QC-1", 600, 0, 0.0, 52.57333333333325, 31, 1015, 44.5, 67.0, 75.0, 365.9000000000019, 11.231327917337426, 10.507433735165288, 3.773024222230542], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view", 600, 0, 0.0, 131.97166666666675, 86, 1493, 109.0, 158.39999999999986, 188.94999999999993, 610.3400000000006, 11.222924694175303, 76.75209143877895, 8.60351160637462], "isController": false}, {"data": ["LAB_Lịch sử QC-2", 600, 0, 0.0, 49.065, 25, 1357, 31.0, 48.89999999999998, 66.74999999999966, 484.7500000000002, 11.235955056179774, 54.22665028089888, 2.457865168539326], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-0", 600, 0, 0.0, 36.2433333333333, 25, 403, 31.0, 47.0, 54.94999999999993, 100.95000000000005, 11.250492209034144, 12.118450104067053, 4.196960960792034], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-1", 600, 0, 0.0, 53.77833333333329, 31, 1012, 45.0, 65.89999999999998, 81.0, 383.99, 11.2572468526614, 10.531682114110959, 3.7817313645659394], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-2", 600, 0, 0.0, 43.298333333333346, 25, 1340, 31.0, 46.89999999999998, 61.849999999999795, 426.7900000000002, 11.25703564727955, 54.32838883677299, 2.4624765478424018], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-0", 600, 0, 0.0, 36.976666666666645, 25, 381, 31.0, 46.0, 53.0, 102.74000000000024, 11.242692250037475, 12.110048390421225, 4.194051210463199], "isController": false}, {"data": ["LAB_Kiểm tra QC-1", 600, 0, 0.0, 51.26666666666669, 31, 416, 45.0, 67.0, 78.0, 348.42000000000144, 11.272898074213245, 10.54632456552372, 3.786989196806012], "isController": false}, {"data": ["LAB_Kiểm tra QC-0", 600, 0, 0.0, 37.37000000000005, 25, 416, 31.0, 47.0, 58.94999999999993, 211.8000000000011, 11.267394039548554, 12.136655884396538, 2.38771924470902], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-2", 600, 0, 0.0, 44.17166666666668, 25, 1016, 31.0, 47.0, 65.89999999999986, 462.73000000000025, 11.249648448485985, 54.29273694572044, 2.460860598106309], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-1", 600, 0, 0.0, 55.52000000000004, 29, 1015, 44.0, 69.89999999999998, 82.0, 413.9200000000001, 11.248593925759279, 10.523586895388076, 3.778824521934758], "isController": false}, {"data": ["LAB_Kiểm tra QC-2", 600, 0, 0.0, 41.40166666666673, 25, 1025, 31.0, 45.0, 58.899999999999864, 468.99, 11.27310987524425, 54.40596582368857, 2.46599278520968], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-2", 600, 0, 0.0, 38.38666666666671, 25, 1016, 31.0, 46.89999999999998, 54.0, 151.76000000000022, 11.234061674998594, 54.217512497893615, 2.457450991405943], "isController": false}, {"data": ["LAB_Lịch sử QC", 600, 0, 0.0, 139.09166666666667, 87, 1507, 110.0, 151.89999999999998, 192.8499999999998, 900.8500000000001, 11.211181284801375, 76.67177982174222, 8.594509090399491], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-1", 600, 0, 0.0, 55.18833333333329, 31, 1015, 45.0, 70.0, 85.0, 404.84000000000015, 11.22565436210219, 10.502125858294823, 3.771118262268705], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-0", 600, 0, 0.0, 37.85833333333333, 25, 649, 32.0, 47.0, 56.849999999999795, 147.74000000000024, 11.205737337516808, 12.070242464141641, 4.180265295831466], "isController": false}, {"data": ["LAB_Lịch sử-0", 600, 0, 0.0, 36.12333333333331, 25, 403, 31.0, 48.0, 59.0, 101.97000000000003, 11.268452090297863, 12.137795562107952, 2.3879434605416368], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt", 600, 0, 0.0, 131.5366666666666, 87, 1515, 110.0, 158.0, 186.8499999999998, 579.8100000000002, 11.184222789717971, 76.48741425429195, 10.375987939679758], "isController": false}, {"data": ["LAB_Lịch sử-2", 600, 0, 0.0, 43.429999999999986, 25, 1363, 31.0, 47.0, 58.899999999999864, 415.73000000000025, 11.260838557111219, 54.34674233324575, 2.4633084343680793], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt", 600, 0, 0.0, 136.77499999999992, 86, 1487, 109.0, 155.89999999999998, 199.89999999999986, 866.1900000000007, 11.222714774704, 76.75065582739465, 10.411698277313281], "isController": false}, {"data": ["LAB_Lịch sử-1", 600, 0, 0.0, 50.28499999999998, 31, 1012, 45.0, 65.0, 76.0, 106.98000000000002, 11.25703564727955, 10.531484521575985, 3.781660412757974], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-1", 600, 0, 0.0, 51.258333333333354, 29, 421, 44.0, 68.0, 76.94999999999993, 341.780000000002, 11.247328759419638, 10.522403272972669, 3.7783995051175348], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-2", 600, 0, 0.0, 43.47333333333334, 26, 1033, 31.0, 46.0, 60.0, 457.5900000000004, 11.247750449910018, 54.283576878374326, 2.460445410917816], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-0", 600, 0, 0.0, 37.11666666666666, 25, 377, 31.0, 47.0, 56.94999999999993, 174.41000000000054, 11.244799280332845, 12.112317974811651, 2.38293109749241], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-0", 600, 0, 0.0, 44.81666666666664, 25, 748, 31.0, 52.0, 89.89999999999986, 397.8900000000001, 11.1333778668448, 11.99230057336896, 2.3593193331106654], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view", 600, 0, 0.0, 140.375, 85, 1467, 111.0, 173.79999999999995, 258.8499999999998, 613.8000000000002, 11.10370863868532, 75.93678866866533, 8.512120391960915], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-0", 600, 0, 0.0, 35.234999999999964, 25, 349, 31.0, 44.89999999999998, 52.94999999999993, 101.91000000000008, 11.229856445001777, 12.09622232308297, 2.3797645005521346], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
