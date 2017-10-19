var obj = {};
obj.tableData = [];
obj.colorList = ['#778899', '#FFD700', '#7CFC00', "#00BFFF", '#FF8C00', "#FF0000", "#9400D3"];
obj.labels = ["0", "0~10", "10~20", "20~30", "30~50", "50~80", ">80"];
obj.TableInit = (tableData) => {
    $('#vehicle_table').html('<table id=\"myTable\" class=\"display\" style=\"text-align: center;\">');
    $('#myTable').dataTable({
        "data": tableData,
        "columns": [
            { "title": "车牌号" },
            { "title": "经度" },
            { "title": "纬度" },
            { "title": "速度" }
        ],
        "destroy": true,
        "displayLength": 20,
        "bAutoWidth": true,
        "lengthMenu": [10, 20],
        "pagingType": "full",
        "select": true,
        "language": {
            "lengthMenu": "每页显示 _MENU_ 条记录",
            "zeroRecords": "抱歉, 没有找到",
            "info": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "infoEmpty": "记录数据为0",
            "search": "搜索",
            "infoFiltered": "(从 _MAX_ 条数据中检索)",
            "paginate": {
                "first": "首页",
                "previous": "上一页",
                "next": "下一页",
                "last": "尾页"
            }
        },
    });
}
obj.EchartsInit = (params) => {
    var vehicleDataMap_chart = echarts.init(document.getElementById("vehicle"));
    var series = obj.labels.map((i, j) => {
        var name = i;
        var data = params[name];
        for (var index in data) {
            var tempArr = [];
            var tempStr = String(data[index]);
            tempArr.push(Number(tempStr.split(',')[0]));
            tempArr.push(Number(tempStr.split(',')[1]));
            tempArr.push(tempStr.split(',')[2]);
            tempArr.push(tempStr.split(',')[3]);
            tempArr.push(tempStr.split(',')[4]);
            data[index] = tempArr;
        }
        return {
            name: name,
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: data,
            symbolSize: 8,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            itemStyle: {
                normal: {
                    color: obj.colorList[j]
                }
            },
            blendMode: 'lighter'
        }
    });
    vehicleDataMap_chart.setOption(option = {
        animation: true,
        bmap: {
            center: [125.33, 43.88],
            zoom: 12,
            roam: true,
            mapStyle: {
                style: 'dark'
            },
        },
        legend: {
            orient: 'vertical',
            bottom: '55',
            left: '1',
            backgroundColor: "rgba(255,255,255,0.6)",
            data: obj.labels,
            formatter: (name) => {
                return '速度:' + name + 'km/h';
            }
        },
        series: series,
        tooltip: {
            formatter: function (params) {
                var retStr = '车牌号: ' + params.data[3] + '<br />经度: ' + params.data[0] + '   纬度: ' + params.data[1] + '<br />速度: ' + params.data[2] + '    km/h' + '<br />数据采集时间: ' + params.data[4];
                return retStr;
            }
        },
    });
    var baiduMap = vehicleDataMap_chart.getModel().getComponent('bmap').getBMap();
    baiduMap.addControl(new BMap.NavigationControl());
}

$(() => {
    window.setInterval(() => {
        $.ajax({
            url: "http://111.26.195.112:8001/api/gpsinfo",
            type: 'GET',
            dataType: 'JSON',
            success: () => { },
            error: () => { },
        });
    }, 1000 * 60);
    $.ajax({
        url: "http://111.26.195.112:8001/api/gpsinfofile",
        type: 'GET',
        dataType: 'JSON',
        success: function (points) {
            obj.data = JSON.parse(points);
            obj.EchartsInit(obj.data);

            obj.labels.map((i, j) => {
                var name = i;
                var data = obj.data[name];
                for (var index in data) {
                    var tempStr = String(data[index]);
                    var tempArr = [tempStr.split(',')[3], tempStr.split(',')[0], tempStr.split(',')[1], tempStr.split(',')[2]];
                    obj.tableData.push(tempArr);
                }
            });
            obj.TableInit(obj.tableData);

            //selected event
            var table = $('#myTable').DataTable();
            table.on('select', function (e, dt, type, indexes) {
                if (type === 'row') {
                    var data = table.rows(indexes).data();
                    var tempStr = Number(data[0][1]) + "," + Number(data[0][2]) + "," + data[0][3] + "," + data[0][0] + "," + " ";
                    var filterObj = {};
                    filterObj['0'] = [];
                    filterObj['0~10'] = [];
                    filterObj['10~20'] = [];
                    filterObj['20~30'] = [];
                    filterObj['30~50'] = [];
                    filterObj['50~80'] = [];
                    filterObj['>80'] = [];
                    if (Number(data[0][3]) == 0) {
                        filterObj['0'][0] = tempStr;
                    } else if (Number(data[0][3]) > 0 && Number(data[0][3]) < 10) {
                        filterObj['0~10'][0] = tempStr;
                    } else if (Number(data[0][3]) >= 10 && Number(data[0][3]) < 20) {
                        filterObj['10~20'][0] = tempStr;
                    } else if (Number(data[0][3]) >= 20 && Number(data[0][3]) < 30) {
                        filterObj['20~30'][0] = tempStr;
                    } else if (Number(data[0][3]) >= 30 && Number(data[0][3]) < 50) {
                        filterObj['30~50'][0] = tempStr;
                    } else if (Number(data[0][3]) >= 50 && Number(data[0][3]) < 80) {
                        filterObj['50~80'][0] = tempStr;
                    } else {
                        filterObj['>80'][0] = tempStr;
                    }
                    obj.EchartsInit(filterObj);
                    $(".select-item").text('');
                }
            });
            //deselected event
            table.on('deselect', function (e, dt, type, indexes) {
                obj.EchartsInit(obj.data);
            });
            //Add a custom class when an item is selected
            table.on('select', function (e, dt, type, indexes) {
                table[type](indexes).nodes().to$().addClass('custom-selected');
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('API called error');
        }
    });
});
