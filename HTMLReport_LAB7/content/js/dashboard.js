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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9994708994708995, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-1"], "isController": false}, {"data": [0.9952380952380953, 500, 1500, "LAB_Lịch sử"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_kt-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra QC-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử QC"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt-0"], "isController": false}, {"data": [0.9952380952380953, 500, 1500, "LAB_Lịch sử-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_kt"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Lịch sử-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-1"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-2"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ bền_view-0"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ sạch_view-0"], "isController": false}, {"data": [0.9904761904761905, 500, 1500, "LAB_Kiểm tra độ sạch_view"], "isController": false}, {"data": [1.0, 500, 1500, "LAB_Kiểm tra độ dày_view-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3780, 0, 0.0, 73.75555555555546, 25, 862, 49.0, 142.0, 174.0, 275.0, 91.99542456618559, 314.57224523290904, 37.732498357224564], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LAB_Kiểm tra độ dày_view-2", 105, 0, 0.0, 44.514285714285734, 26, 83, 42.0, 63.400000000000006, 74.69999999999999, 83.0, 2.7834477639636295, 13.433397313972907, 0.608879198367044], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-1", 105, 0, 0.0, 54.50476190476191, 32, 117, 49.0, 79.80000000000004, 95.39999999999998, 116.03999999999996, 2.7803521779425395, 2.6011497914735866, 0.9340245597775718], "isController": false}, {"data": ["LAB_Lịch sử", 105, 0, 0.0, 151.2571428571429, 91, 862, 133.0, 193.8, 226.2999999999999, 828.4599999999987, 2.724724932530621, 18.634031936046814, 2.0887783906606807], "isController": false}, {"data": ["LAB_Kiểm tra QC", 105, 0, 0.0, 146.39047619047616, 92, 315, 132.0, 192.20000000000002, 225.79999999999995, 313.73999999999995, 2.765559564885295, 18.913294563370822, 2.1200822836278874], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-2", 105, 0, 0.0, 43.19047619047618, 27, 85, 41.0, 61.400000000000006, 70.09999999999997, 84.94, 2.7828575972012404, 13.430549067742705, 0.6087500993877712], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view", 105, 0, 0.0, 147.21904761904761, 97, 297, 131.0, 211.80000000000004, 229.7, 295.97999999999996, 2.7662881681903206, 18.918277384606263, 2.1206408320599626], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt", 105, 0, 0.0, 145.39047619047628, 101, 282, 133.0, 189.60000000000002, 212.19999999999993, 281.88, 2.7659238185553976, 18.91578564584321, 2.566042605105105], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-1", 105, 0, 0.0, 54.8952380952381, 34, 118, 49.0, 78.4, 94.09999999999997, 117.57999999999998, 2.780131328108452, 2.6009431761014614, 0.9339503680364329], "isController": false}, {"data": ["LAB_Lịch sử QC-0", 105, 0, 0.0, 48.9047619047619, 26, 149, 43.0, 73.4, 93.39999999999998, 148.57999999999998, 2.736798206745556, 2.9479379121487774, 0.5799660262341657], "isController": false}, {"data": ["LAB_Lịch sử QC-1", 105, 0, 0.0, 53.78095238095236, 34, 118, 48.0, 79.80000000000001, 93.69999999999999, 117.51999999999998, 2.7407987470634296, 2.5641457028191073, 0.920737079091621], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view", 105, 0, 0.0, 143.47619047619045, 97, 277, 128.0, 193.8, 208.39999999999998, 276.88, 2.7659238185553976, 18.91578564584321, 2.120361521060534], "isController": false}, {"data": ["LAB_Lịch sử QC-2", 105, 0, 0.0, 43.533333333333346, 27, 96, 41.0, 54.400000000000006, 71.09999999999997, 95.88, 2.743591753547072, 13.241045357450812, 0.600160696088422], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-0", 105, 0, 0.0, 47.3142857142857, 27, 141, 44.0, 73.0, 90.49999999999994, 140.57999999999998, 2.776162022103538, 2.990338584355666, 1.0356385668394055], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-1", 105, 0, 0.0, 54.64761904761906, 30, 94, 50.0, 83.0, 87.69999999999999, 93.88, 2.779763323008498, 2.600598890080216, 0.9338267413231672], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_kt-2", 105, 0, 0.0, 43.247619047619054, 27, 98, 42.0, 53.400000000000006, 64.89999999999992, 97.51999999999998, 2.782931354359926, 13.430905032467534, 0.6087662337662338], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-0", 105, 0, 0.0, 46.257142857142824, 26, 132, 44.0, 70.0, 82.89999999999992, 131.88, 2.7785128340830907, 2.992870757806298, 1.0365155299020905], "isController": false}, {"data": ["LAB_Kiểm tra QC-1", 105, 0, 0.0, 54.47619047619046, 33, 123, 48.0, 90.4, 98.79999999999995, 122.03999999999996, 2.7791747174505703, 2.6000482219898893, 0.933629006643551], "isController": false}, {"data": ["LAB_Kiểm tra QC-0", 105, 0, 0.0, 47.81904761904762, 25, 141, 44.0, 70.4, 76.09999999999997, 140.88, 2.776896223421136, 2.991129428157728, 0.5884633598460807], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-2", 105, 0, 0.0, 44.06666666666668, 26, 92, 42.0, 60.0, 76.09999999999997, 91.39999999999998, 2.7825626076586722, 13.429125397508944, 0.6086855704253346], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt-1", 105, 0, 0.0, 53.84761904761904, 35, 106, 49.0, 75.80000000000001, 89.2999999999999, 105.27999999999997, 2.7803521779425395, 2.6011497914735866, 0.9340245597775718], "isController": false}, {"data": ["LAB_Kiểm tra QC-2", 105, 0, 0.0, 43.93333333333333, 28, 103, 43.0, 55.80000000000001, 67.79999999999995, 101.19999999999993, 2.7827100946121432, 13.429837194895716, 0.6087178331964064], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-2", 105, 0, 0.0, 42.3904761904762, 27, 91, 41.0, 53.0, 64.69999999999999, 90.57999999999998, 2.7827100946121432, 13.429837194895716, 0.6087178331964064], "isController": false}, {"data": ["LAB_Lịch sử QC", 105, 0, 0.0, 146.43809523809523, 95, 324, 131.0, 195.4, 223.49999999999983, 322.55999999999995, 2.726422933111757, 18.645644336505505, 2.0900800805593063], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-1", 105, 0, 0.0, 51.723809523809535, 34, 97, 48.0, 74.20000000000002, 91.0, 96.94, 2.779468989067422, 2.6003235268814358, 0.933727863514837], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt-0", 105, 0, 0.0, 47.4, 26, 142, 42.0, 71.0, 92.69999999999999, 141.64, 2.77623542476402, 2.990417649916713, 1.0356659494725153], "isController": false}, {"data": ["LAB_Lịch sử-0", 105, 0, 0.0, 51.87619047619047, 25, 717, 41.0, 72.4, 87.49999999999983, 682.6199999999988, 2.735016019379542, 2.9460182318121437, 0.5795883556692976], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_kt", 105, 0, 0.0, 141.63809523809522, 99, 288, 129.0, 187.20000000000002, 228.2999999999999, 287.82, 2.7657781055737014, 18.9147891341139, 2.565907422163102], "isController": false}, {"data": ["LAB_Lịch sử-2", 105, 0, 0.0, 44.276190476190486, 26, 78, 46.0, 58.0, 61.69999999999999, 77.33999999999997, 2.74237358963644, 13.235166289046177, 0.5998942227329712], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_kt", 105, 0, 0.0, 144.34285714285716, 96, 300, 128.0, 187.00000000000006, 223.8999999999997, 298.67999999999995, 2.766069546891465, 18.91678226257903, 2.566177802291886], "isController": false}, {"data": ["LAB_Lịch sử-1", 105, 0, 0.0, 54.96190476190478, 30, 110, 48.0, 82.60000000000002, 95.39999999999998, 109.63999999999999, 2.738582718238961, 2.562072503977465, 0.9199926319084009], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-1", 105, 0, 0.0, 51.76190476190475, 32, 94, 49.0, 75.80000000000001, 90.69999999999999, 93.94, 2.7795425667090217, 2.600392362214104, 0.9337525810038119], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-2", 105, 0, 0.0, 43.45714285714285, 27, 96, 39.0, 57.400000000000006, 83.79999999999984, 95.75999999999999, 2.7825626076586722, 13.429125397508944, 0.6086855704253346], "isController": false}, {"data": ["LAB_Kiểm tra độ bền_view-0", 105, 0, 0.0, 48.057142857142836, 26, 135, 44.0, 73.80000000000001, 90.49999999999994, 134.82, 2.776382241730347, 2.9905757935825905, 0.5883544398979349], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view-0", 105, 0, 0.0, 63.9714285714286, 26, 418, 46.0, 119.60000000000011, 235.19999999999925, 417.21999999999997, 2.7585844520925837, 2.9714049322833196, 0.584582837992276], "isController": false}, {"data": ["LAB_Kiểm tra độ sạch_view", 105, 0, 0.0, 162.21904761904764, 96, 551, 133.0, 246.20000000000005, 345.7999999999996, 550.5799999999999, 2.7466059797535904, 18.783673511928118, 2.105552435650946], "isController": false}, {"data": ["LAB_Kiểm tra độ dày_view-0", 105, 0, 0.0, 48.019047619047605, 25, 138, 44.0, 70.0, 74.69999999999999, 137.64, 2.7771165595493135, 2.991366762873919, 0.5885100521701183], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3780, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
