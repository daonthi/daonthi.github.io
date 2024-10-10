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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.98125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MD Sản xuất_Delete-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Update"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-0"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Add-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_Delete-1"], "isController": false}, {"data": [0.7, 500, 1500, "MD Sản xuất_View"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-2"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-1"], "isController": false}, {"data": [1.0, 500, 1500, "MD Sản xuất_View-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 80, 0, 0.0, 171.72500000000002, 50, 601, 109.5, 404.5000000000001, 496.25000000000006, 601.0, 1.6514935694969137, 5.674186768439958, 0.72273003499102], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MD Sản xuất_Delete-2", 5, 0, 0.0, 72.2, 54, 84, 78.0, 84.0, 84.0, 84.0, 0.15563233417374794, 0.7511083940299436, 0.03617235891928907], "isController": false}, {"data": ["MD Sản xuất_Update-1", 5, 0, 0.0, 105.0, 72, 160, 98.0, 160.0, 160.0, 160.0, 0.15578750584203147, 0.14665933167159995, 0.0532476826608506], "isController": false}, {"data": ["MD Sản xuất_Update-0", 5, 0, 0.0, 113.2, 63, 152, 121.0, 152.0, 152.0, 152.0, 0.15607441628168311, 0.16994431069734048, 0.05563199408477962], "isController": false}, {"data": ["MD Sản xuất_Update-2", 5, 0, 0.0, 86.6, 50, 200, 62.0, 200.0, 200.0, 200.0, 0.15586520776832197, 0.7522322820225069, 0.034552150550204185], "isController": false}, {"data": ["MD Sản xuất_Update", 5, 0, 0.0, 305.8, 225, 407, 299.0, 407.0, 407.0, 407.0, 0.1550195324610901, 1.0628829466887828, 0.1426058589632294], "isController": false}, {"data": ["MD Sản xuất_Add-1", 5, 0, 0.0, 91.6, 59, 108, 92.0, 108.0, 108.0, 108.0, 0.15626464981091975, 0.1471085179860612, 0.05341076897834172], "isController": false}, {"data": ["MD Sản xuất_Add-0", 5, 0, 0.0, 116.2, 111, 118, 117.0, 118.0, 118.0, 118.0, 0.15621582778767143, 0.17009828904614616, 0.05247875464742088], "isController": false}, {"data": ["MD Sản xuất_Delete", 5, 0, 0.0, 249.0, 188, 288, 266.0, 288.0, 288.0, 288.0, 0.15475564084310875, 1.0704435586833392, 0.13979391384753476], "isController": false}, {"data": ["MD Sản xuất_Delete-0", 5, 0, 0.0, 89.4, 52, 119, 98.0, 119.0, 119.0, 119.0, 0.1555693839452396, 0.17547132661792159, 0.048463509256378344], "isController": false}, {"data": ["MD Sản xuất_Add", 5, 0, 0.0, 270.6, 227, 296, 278.0, 296.0, 296.0, 296.0, 0.1554388037429664, 1.0657576573040692, 0.1398038459446016], "isController": false}, {"data": ["MD Sản xuất_Add-2", 5, 0, 0.0, 62.0, 51, 86, 56.0, 86.0, 86.0, 86.0, 0.15653861807707964, 0.7554822759149682, 0.034701431937008864], "isController": false}, {"data": ["MD Sản xuất_Delete-1", 5, 0, 0.0, 87.0, 52, 122, 93.0, 122.0, 122.0, 122.0, 0.15533739281719897, 0.14957291925562322, 0.055824375543680874], "isController": false}, {"data": ["MD Sản xuất_View", 5, 0, 0.0, 549.8, 482, 601, 574.0, 601.0, 601.0, 601.0, 0.15394562640475384, 1.0555197685427506, 0.11981900805135626], "isController": false}, {"data": ["MD Sản xuất_View-2", 5, 0, 0.0, 60.2, 52, 77, 57.0, 77.0, 77.0, 77.0, 0.15653861807707964, 0.7554822759149682, 0.034701431937008864], "isController": false}, {"data": ["MD Sản xuất_View-1", 5, 0, 0.0, 95.2, 53, 135, 105.0, 135.0, 135.0, 135.0, 0.15628418716594256, 0.1471269105741881, 0.053417446785234274], "isController": false}, {"data": ["MD Sản xuất_View-0", 5, 0, 0.0, 393.8, 351, 443, 382.0, 443.0, 443.0, 443.0, 0.15456906145665886, 0.16830517922282676, 0.033208196797329045], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 80, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
