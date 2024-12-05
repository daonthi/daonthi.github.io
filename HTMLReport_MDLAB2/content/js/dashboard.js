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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9987962962962963, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-1"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "LAB_Lịch sử"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra QC"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_view"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ bền_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-1"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "LAB_Kiểm tra độ bền_view"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-1"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-2"], "isController": false}, {"data": [0.995, 500, 1500, "LAB_Lịch sử QC"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-0"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ sạch_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-2"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "LAB_Kiểm tra độ dày_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-0"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "LAB_Kiểm tra độ sạch_view-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "LAB_Kiểm tra độ sạch_view"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10800, 0, 0.0, 62.567500000000194, 25, 931, 41.0, 116.0, 130.0, 260.9599999999991, 233.24622594648295, 797.5699806168068, 95.66739736086215], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LAB_Kiểm tra độ dày_view-2", 300, 0, 0.0, 38.1366666666667, 26, 432, 33.0, 49.900000000000034, 62.0, 110.98000000000002, 6.890848952590959, 33.25642140986769, 1.5073732083792724], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-1", 300, 0, 0.0, 46.95333333333333, 32, 404, 43.0, 58.0, 64.94999999999999, 134.83000000000015, 6.894649751792609, 6.450268029509101, 2.3161714009928294], "isController": false}, {"data": ["LAB_Lịch sử", 300, 0, 0.0, 127.13666666666666, 88, 619, 110.0, 150.0, 186.74999999999994, 578.5400000000004, 6.804881368234814, 46.537679904051174, 5.216632689515946], "isController": false}, {"data": ["LAB_Kiểm tra QC", 300, 0, 0.0, 121.8233333333333, 92, 931, 110.0, 143.80000000000007, 175.89999999999998, 464.1400000000017, 6.816167950378297, 46.614867340331266, 5.225285001022425], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-2", 300, 0, 0.0, 37.866666666666646, 25, 399, 33.0, 45.900000000000034, 60.94999999999999, 155.75000000000023, 6.9178619194760875, 33.386790630909005, 1.5132822948853941], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view", 300, 0, 0.0, 124.31666666666666, 90, 846, 111.0, 148.0, 183.84999999999997, 451.8800000000001, 6.861534239055853, 46.92512136338685, 5.2600628688074655], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt", 300, 0, 0.0, 123.8166666666666, 88, 920, 110.0, 154.7000000000001, 198.0, 421.5700000000013, 6.823454487558568, 46.66469900036392, 6.330353284356093], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-1", 300, 0, 0.0, 46.81333333333333, 31, 396, 43.0, 55.900000000000034, 68.89999999999998, 94.97000000000003, 6.945087508102603, 6.4974549148069265, 2.333115334753218], "isController": false}, {"data": ["LAB_Lịch sử QC-0", 300, 0, 0.0, 37.92666666666665, 25, 390, 33.0, 50.0, 65.84999999999997, 127.70000000000027, 6.81121580202066, 7.336690458621864, 1.443392411170394], "isController": false}, {"data": ["LAB_Lịch sử QC-1", 300, 0, 0.0, 45.7533333333333, 31, 410, 42.0, 54.0, 63.94999999999999, 91.97000000000003, 6.804572672836146, 6.3659966997822535, 2.2859111322808925], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view", 300, 0, 0.0, 128.34666666666664, 91, 920, 111.0, 156.0, 195.95, 537.98, 6.83667190811513, 46.75509118411158, 5.241003367060915], "isController": false}, {"data": ["LAB_Lịch sử QC-2", 300, 0, 0.0, 39.290000000000006, 26, 472, 33.0, 52.7000000000001, 70.0, 122.99000000000001, 6.809824306532892, 32.865382541880415, 1.4896490670540699], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-0", 300, 0, 0.0, 38.486666666666665, 25, 374, 34.0, 50.0, 66.89999999999998, 88.88000000000011, 6.845720283869201, 7.373856907331766, 2.553774559021518], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-1", 300, 0, 0.0, 47.27333333333332, 31, 401, 43.0, 61.0, 71.0, 99.99000000000001, 6.842909605164116, 6.401862697018772, 2.29878994548482], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-2", 300, 0, 0.0, 37.95666666666665, 25, 432, 32.0, 49.0, 56.94999999999999, 128.8800000000001, 6.846657689937696, 33.043146780929774, 1.4977063696738708], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-0", 300, 0, 0.0, 40.01999999999998, 25, 355, 35.0, 52.80000000000007, 70.94999999999999, 155.59000000000037, 6.873954586073368, 7.404269441834887, 2.5643072772265882], "isController": false}, {"data": ["LAB_Kiểm tra QC-1", 300, 0, 0.0, 45.79, 32, 291, 42.0, 57.0, 64.94999999999999, 93.0, 6.839633395649993, 6.3987976494459895, 2.2976893438511694], "isController": false}, {"data": ["LAB_Kiểm tra QC-0", 300, 0, 0.0, 37.91, 25, 355, 33.0, 48.0, 64.0, 100.99000000000001, 6.838386140870754, 7.365956946660589, 1.449150188055619], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-2", 300, 0, 0.0, 37.900000000000006, 25, 468, 33.0, 47.0, 65.89999999999998, 84.98000000000002, 6.8744271310724105, 33.17716687671861, 1.5037809349220899], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-1", 300, 0, 0.0, 46.60333333333333, 31, 365, 42.0, 60.900000000000034, 70.94999999999999, 111.95000000000005, 6.873482106034917, 6.430464704669386, 2.309060394996105], "isController": false}, {"data": ["LAB_Kiểm tra QC-2", 300, 0, 0.0, 38.02000000000004, 25, 566, 32.0, 48.0, 54.0, 96.83000000000015, 6.843377891327159, 33.027317909119944, 1.496988913727816], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-2", 300, 0, 0.0, 39.13333333333337, 25, 487, 33.0, 49.80000000000007, 59.0, 136.97000000000003, 6.883575788169428, 33.22131986829425, 1.5057822036620623], "isController": false}, {"data": ["LAB_Lịch sử QC", 300, 0, 0.0, 123.10333333333327, 89, 626, 110.0, 151.90000000000003, 186.0, 539.800000000002, 6.788405403570701, 46.42500296992737, 5.204002189260743], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-1", 300, 0, 0.0, 47.36000000000004, 32, 399, 44.0, 58.900000000000034, 67.0, 121.98000000000002, 6.879787185249737, 6.436363401825437, 2.3111785075448332], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-0", 300, 0, 0.0, 37.83333333333335, 25, 356, 33.0, 47.0, 68.84999999999997, 96.8900000000001, 6.870019236053861, 7.40003048571036, 2.5628392071997803], "isController": false}, {"data": ["LAB_Lịch sử-0", 300, 0, 0.0, 37.29333333333335, 25, 337, 33.0, 47.900000000000034, 58.89999999999998, 99.83000000000015, 6.829979054730899, 7.356901266961115, 1.4473686082779347], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt", 300, 0, 0.0, 124.46666666666664, 90, 583, 110.0, 147.90000000000003, 194.64999999999992, 495.6700000000003, 6.848064280496713, 46.83300210577977, 6.353184635226443], "isController": false}, {"data": ["LAB_Lịch sử-2", 300, 0, 0.0, 39.83, 26, 438, 33.0, 48.0, 56.0, 178.80000000000018, 6.825317377258043, 32.94015476407153, 1.4930381762751967], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt", 300, 0, 0.0, 124.69000000000005, 85, 554, 111.0, 151.0, 206.95, 464.71000000000026, 6.851661527920521, 46.85760320315177, 6.35652192531689], "isController": false}, {"data": ["LAB_Lịch sử-1", 300, 0, 0.0, 49.88333333333337, 31, 408, 42.0, 56.0, 71.0, 395.30000000000064, 6.822833750284285, 6.383080793722993, 2.292045712986127], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-1", 300, 0, 0.0, 47.58333333333331, 31, 395, 43.0, 60.900000000000034, 70.94999999999999, 91.98000000000002, 6.856359273225917, 6.414445491943778, 2.3033081933493316], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-2", 300, 0, 0.0, 40.39333333333334, 25, 497, 33.0, 50.0, 62.94999999999999, 413.2600000000025, 6.856045889800489, 33.08845584706447, 1.499760038393857], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-0", 300, 0, 0.0, 40.243333333333325, 25, 392, 33.0, 48.0, 66.74999999999994, 259.910000000001, 6.858553759630553, 7.387680465695801, 1.4534239900779589], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-0", 300, 0, 0.0, 44.296666666666646, 25, 627, 33.0, 49.0, 77.64999999999992, 291.82000000000016, 6.926486885851496, 7.460854526459181, 1.4678199748337644], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view", 300, 0, 0.0, 129.09999999999994, 90, 855, 110.5, 149.80000000000007, 218.64999999999992, 562.9300000000001, 6.837606837606837, 46.761485042735046, 5.241720085470085], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-0", 300, 0, 0.0, 39.080000000000005, 25, 349, 34.0, 50.900000000000034, 66.94999999999999, 131.7800000000002, 6.881365262868153, 7.412251840765208, 1.4582580684007709], "isController": false}]}, function(index, item){
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
