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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9975925925925926, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-1"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "LAB_Lịch sử"], "isController": false}, {"data": [0.99, 500, 1500, "LAB_Kiểm tra QC"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_view"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ bền_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ bền_view"], "isController": false}, {"data": [0.995, 500, 1500, "LAB_Lịch sử QC-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ bền_kt-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ bền_kt-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-0"], "isController": false}, {"data": [0.995, 500, 1500, "LAB_Kiểm tra QC-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_kt-1"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-2"], "isController": false}, {"data": [0.995, 500, 1500, "LAB_Lịch sử QC"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ sạch_kt-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ sạch_kt"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Lịch sử-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_kt"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "LAB_Lịch sử-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ bền_view-2"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ bền_view-0"], "isController": false}, {"data": [0.995, 500, 1500, "LAB_Kiểm tra độ sạch_view-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "LAB_Kiểm tra độ sạch_view"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10800, 0, 0.0, 63.47870370370381, 24, 1364, 41.0, 116.0, 131.0, 220.0, 277.9135894598698, 950.3070639587247, 113.98799567689973], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LAB_Kiểm tra độ dày_view-2", 300, 0, 0.0, 38.89999999999997, 25, 1031, 31.0, 46.900000000000034, 53.0, 69.99000000000001, 8.302200083022, 40.06784454130345, 1.8161062681610627], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-1", 300, 0, 0.0, 47.47333333333333, 31, 101, 44.0, 65.0, 75.0, 90.95000000000005, 8.298984757531327, 7.764089255581067, 2.7879401919831808], "isController": false}, {"data": ["LAB_Lịch sử", 300, 0, 0.0, 130.74, 86, 1229, 110.0, 141.0, 170.64999999999992, 1201.4700000000023, 8.281344890410203, 56.63501783939712, 6.348491932589853], "isController": false}, {"data": ["LAB_Kiểm tra QC", 300, 0, 0.0, 136.26000000000005, 87, 1233, 111.0, 150.0, 181.84999999999997, 1203.7100000000003, 8.181520671975566, 55.95233326742664, 6.271966530762517], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-2", 300, 0, 0.0, 34.54999999999998, 26, 299, 31.0, 42.0, 49.94999999999999, 84.92000000000007, 8.305877792851408, 40.08559380104654, 1.8169107671862454], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view", 300, 0, 0.0, 121.74333333333331, 86, 1175, 108.0, 139.0, 168.0, 455.1200000000017, 8.256501995321315, 56.46512057933122, 6.329447330397688], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt", 300, 0, 0.0, 125.37666666666667, 89, 1229, 109.0, 146.0, 169.0, 457.3700000000006, 8.201427048306405, 56.08847033133765, 7.608745796768638], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-1", 300, 0, 0.0, 47.726666666666674, 30, 357, 44.0, 62.900000000000034, 72.89999999999998, 90.99000000000001, 8.296001327360212, 7.761298116807699, 2.7869379459100716], "isController": false}, {"data": ["LAB_Lịch sử QC-0", 300, 0, 0.0, 35.99, 24, 279, 31.0, 47.0, 54.89999999999998, 105.92000000000007, 8.304728158564943, 8.94542495986048, 1.759888682039641], "isController": false}, {"data": ["LAB_Lịch sử QC-1", 300, 0, 0.0, 48.05333333333332, 33, 296, 44.5, 61.0, 68.94999999999999, 94.90000000000009, 8.30059210890377, 7.765593008134579, 2.7884801615848596], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view", 300, 0, 0.0, 121.36999999999999, 85, 1075, 110.0, 150.80000000000007, 163.95, 298.1200000000008, 8.22729267222466, 56.265361898036424, 6.307055417672225], "isController": false}, {"data": ["LAB_Lịch sử QC-2", 300, 0, 0.0, 43.376666666666694, 26, 1021, 32.0, 44.0, 55.89999999999998, 633.9800000000027, 8.301281164393037, 40.06340968206093, 1.8159052547109769], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-0", 300, 0, 0.0, 39.56666666666667, 25, 980, 32.0, 49.0, 58.0, 135.64000000000033, 8.232937237575126, 8.868095481489613, 3.0712715085485334], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-1", 300, 0, 0.0, 50.763333333333335, 31, 1060, 44.0, 61.0, 69.0, 114.79000000000019, 8.228195282501371, 7.6978623834339, 2.7641593527153043], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-2", 300, 0, 0.0, 34.94000000000002, 25, 105, 31.0, 48.0, 55.94999999999999, 93.7800000000002, 8.228420966016621, 39.71177384184975, 1.7999670863161357], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-0", 300, 0, 0.0, 35.100000000000016, 25, 134, 31.0, 46.0, 54.0, 89.96000000000004, 8.287063893262617, 8.926397924090494, 3.0914632883069526], "isController": false}, {"data": ["LAB_Kiểm tra QC-1", 300, 0, 0.0, 58.193333333333335, 32, 1017, 44.0, 64.90000000000003, 70.94999999999999, 976.9600000000064, 8.208383495676918, 7.6793275281821165, 2.7575038305789645], "isController": false}, {"data": ["LAB_Kiểm tra QC-0", 300, 0, 0.0, 35.870000000000005, 26, 126, 31.0, 48.900000000000034, 65.74999999999994, 106.0, 8.213327492744895, 8.846972875485955, 1.7405195956305095], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-2", 300, 0, 0.0, 34.980000000000004, 25, 293, 31.0, 46.0, 54.0, 106.64000000000033, 8.284775344508574, 39.98374975836072, 1.8122946066112509], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-1", 300, 0, 0.0, 53.92, 32, 1037, 44.0, 66.0, 71.0, 100.92000000000007, 8.277232093587903, 7.743738618805871, 2.7806326564396864], "isController": false}, {"data": ["LAB_Kiểm tra QC-2", 300, 0, 0.0, 42.05666666666669, 25, 1031, 32.0, 47.0, 58.94999999999999, 392.900000000001, 8.256047554833916, 39.84510450780196, 1.8060104026199189], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-2", 300, 0, 0.0, 35.550000000000004, 25, 364, 32.0, 45.900000000000034, 51.849999999999966, 75.97000000000003, 8.305417900944049, 40.083374283657704, 1.8168101658315106], "isController": false}, {"data": ["LAB_Lịch sử QC", 300, 0, 0.0, 127.52666666666666, 86, 1175, 110.0, 140.80000000000007, 167.0, 901.3800000000042, 8.266056815363845, 56.53046472460254, 6.336772070371697], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-1", 300, 0, 0.0, 49.81333333333333, 32, 594, 45.0, 63.900000000000034, 71.0, 94.0, 8.295542528481363, 7.760868888950337, 2.7867838181617075], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-0", 300, 0, 0.0, 35.576666666666625, 25, 137, 32.0, 47.0, 52.94999999999999, 97.79000000000019, 8.286377195889957, 8.925658249088498, 3.091207117998011], "isController": false}, {"data": ["LAB_Lịch sử-0", 300, 0, 0.0, 35.086666666666694, 25, 141, 31.5, 46.0, 53.94999999999999, 99.97000000000003, 8.313934153641503, 8.955341183072829, 1.76183956185567], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt", 300, 0, 0.0, 121.01666666666671, 90, 1035, 112.5, 143.90000000000003, 166.79999999999995, 277.4700000000005, 8.253094910591471, 56.44181997936726, 7.656679848693259], "isController": false}, {"data": ["LAB_Lịch sử-2", 300, 0, 0.0, 36.92333333333335, 25, 646, 31.0, 46.0, 55.94999999999999, 118.96000000000004, 8.31255195344971, 40.11780444721529, 1.8183707398171236], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt", 300, 0, 0.0, 124.09666666666676, 86, 1230, 111.0, 147.80000000000007, 164.84999999999997, 388.870000000001, 8.254457406999778, 56.451137911347125, 7.657943883447061], "isController": false}, {"data": ["LAB_Lịch sử-1", 300, 0, 0.0, 58.633333333333304, 31, 1034, 45.0, 60.0, 70.94999999999999, 975.0900000000036, 8.307717869901138, 7.772259491567667, 2.790873971919914], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-1", 300, 0, 0.0, 46.453333333333326, 32, 94, 44.0, 61.0, 69.94999999999999, 90.0, 8.254230293025175, 7.722219356170037, 2.772905489063145], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-2", 300, 0, 0.0, 37.776666666666664, 26, 926, 31.0, 48.900000000000034, 57.94999999999999, 77.95000000000005, 8.253321962089741, 39.83195032875733, 1.805414179207131], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-0", 300, 0, 0.0, 36.993333333333354, 25, 610, 32.0, 46.900000000000034, 54.94999999999999, 91.92000000000007, 8.260139321016547, 8.897396163165284, 1.750439680332608], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-0", 300, 0, 0.0, 52.59000000000003, 25, 1231, 32.0, 54.900000000000034, 139.95, 517.940000000001, 8.21422704123542, 8.847941822736981, 1.7407102226055529], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view", 300, 0, 0.0, 134.9833333333334, 85, 1364, 111.0, 165.90000000000003, 230.44999999999987, 642.0800000000008, 8.192468390726127, 56.027203261967834, 6.280359069062508], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-0", 300, 0, 0.0, 35.26333333333336, 26, 341, 31.0, 43.900000000000034, 50.0, 116.60000000000036, 8.290040897535095, 8.929604599591023, 1.756776244887808], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
