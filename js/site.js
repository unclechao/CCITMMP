var obj = {};
obj.labels = ["linshi", "danpai", "dangan", "putong", "gangwan"];
obj.colorList = ['#FF3030', '#7CFC00', "#00BFFF", '#FF8C00', "#9400D3"];
obj.tableData = [];
obj.ConvertNumberToType = (number) => {
    var siteType = "";
    switch (number) {
        case "6":
            siteType = "临时式";
            break;
        case "2":
            siteType = "普通式";
            break;
        case "1":
            siteType = "港湾式";
            break;
        case "3":
            siteType = "直线式";
            break;
        case "5":
            siteType = "单杆式";
            break;
        case "4":
            siteType = "单牌式";
            break;
        default:
            break;
    }
    return siteType;
}
obj.ConvertTypeToNumber = (type) => {
    var siteNumber = 0;
    switch (type) {
        case "临时式":
            siteType = 6;
            break;
        case "普通式":
            siteType = 2;
            break;
        case "港湾式":
            siteType = 1;
            break;
        case "直线式":
            siteType = 3;
            break;
        case "单杆式":
            siteType = 5;
            break;
        case "单牌式":
            siteType = 4;
            break;
        default:
            siteType = 0;
    }
    return siteType;
}
obj.TableInit = (tableData) => {
    $('#site_table').html('<table id=\"myTable\" class=\"display\" style=\"text-align: center;\">');
    $('#myTable').dataTable({
        "data": tableData,
        "columns": [
            { "title": "站点名称" },
            { "title": "经度" },
            { "title": "纬度" },
            { "title": "类型" }
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
    var siteMap_chart = echarts.init(document.getElementById("site"));
    var series = obj.labels.map((i, j) => {
        var name = i;
        var data = params[name];
        //截取部分数据
        data = data.slice(0, 200);
        for (var index in data) {
            var tempArr = [];
            var tempStr = String(data[index]);
            tempArr.push(Number(tempStr.split(',')[1]));
            tempArr.push(Number(tempStr.split(',')[2]));
            tempArr.push(tempStr.split(',')[0]);
            tempArr.push(tempStr.split(',')[3]);
            tempArr.push(tempStr.split(',')[4]);
            data[index] = tempArr;
        }
        return {
            name: name,
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: data,
            symbolSize: 5,
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
    siteMap_chart.setOption(option = {
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
            data: obj.labels.reverse(),
            formatter: (name) => {
                switch (name) {
                    case "linshi":
                        return "临时式";
                        break;
                    case "putong":
                        return "普通式";
                        break;
                    case "gangwan":
                        return "港湾式";
                        break;
                    case "zhixian":
                        return "直线式";
                        break;
                    case "dangan":
                        return "单杆式";
                        break;
                    case "danpai":
                        return "单牌式";
                        break;
                    default:
                        break;
                }
            }
        },
        series: series,
        tooltip: {
            formatter: (params) => {
                var siteType = "";
                switch (params.data[3]) {
                    case "6":
                        siteType = "临时式";
                        break;
                    case "2":
                        siteType = "普通式";
                        break;
                    case "1":
                        siteType = "港湾式";
                        break;
                    case "3":
                        siteType = "直线式";
                        break;
                    case "5":
                        siteType = "单杆式";
                        break;
                    case "4":
                        siteType = "单牌式";
                        break;
                    default:
                        break;
                }
                var retStr = '站点名称: ' + params.data[2] + '<br />经度: ' + params.data[0] + '   纬度: ' + params.data[1] + '<br />类型: ' + siteType + '<br />数据采集时间: ' + params.data[4];
                return retStr;
            }
        },
    });
    var baiduMap = siteMap_chart.getModel().getComponent('bmap').getBMap();
    baiduMap.addControl(new BMap.NavigationControl());
}

$(() => {
    $.ajax({
        url: "http://111.26.195.112:8091/api/site",
        type: 'GET',
        dataType: 'JSON',
        success: (sites) => {
            obj.data = JSON.parse(sites);
            obj.EchartsInit(obj.data);

            obj.labels.map((i, j) => {
                var name = i;
                var data = obj.data[name];
                //截取部分数据
                data = data.slice(0, 200);
                for (var index in data) {
                    var tempStr = String(data[index]);
                    var siteType = obj.ConvertNumberToType(tempStr.split(',')[3]);
                    var tempArr = [tempStr.split(',')[0], Number(tempStr.split(',')[1]), Number(tempStr.split(',')[2]), siteType];
                    obj.tableData.push(tempArr);
                }
            });

            obj.TableInit(obj.tableData);

            //selected event
            var table = $('#myTable').DataTable();
            table.on('select', function (e, dt, type, indexes) {
                if (type === 'row') {
                    var data = table.rows(indexes).data();
                    var siteType = obj.ConvertTypeToNumber(data[0][3]);
                    var tempStr = data[0][0] + "," + data[0][1] + "," + data[0][2] + "," + siteType + "," + " ";
                    var filterObj = {};
                    filterObj.linshi = [];
                    filterObj.putong = [];
                    filterObj.gangwan = [];
                    filterObj.zhixian = [];
                    filterObj.dangan = [];
                    filterObj.danpai = [];
                    switch (data[0][3]) {
                        case "临时式":
                            filterObj.linshi[0] = tempStr;
                            break;
                        case "普通式":
                            filterObj.putong[0] = tempStr;
                            break;
                        case "港湾式":
                            filterObj.gangwan[0] = tempStr;
                            break;
                        case "直线式":
                            filterObj.zhixian[0] = tempStr;
                            break;
                        case "单杆式":
                            filterObj.dangan[0] = tempStr;
                            break;
                        case "单牌式":
                            filterObj.danpai[0] = tempStr;
                            break;
                        default:
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
        error: (XMLHttpRequest, textStatus, errorThrown) => {
            console.log('API called error');
        }
    });
});
