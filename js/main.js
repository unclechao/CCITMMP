var vehiclePercentageVar = {};
vehiclePercentageVar.busCount = 4457;
vehiclePercentageVar.travelCount = 691;
vehiclePercentageVar.taxiCount = 15401;
vehiclePercentageVar.cargoCount = 98782;
vehiclePercentageVar.passengerCount = 4135;
var onRateVar = {};
onRateVar.bus = [29, 2980, 3292, 2459, 3422, 1029];
onRateVar.travel = [0, 267, 448, 678, 603, 437, 142];
onRateVar.taxi = [2413, 4712, 5834, 5908, 5132, 3223];
onRateVar.cargo = [249, 343, 602, 589, 463, 689, 515];
onRateVar.passenger = [0, 778, 1498, 1622, 1589, 1288, 512];
var scoreVar = {};
scoreVar.bus = [67, 85, 75, 82, 74, 83, 81];
scoreVar.travel = [81, 75, 95, 82, 84, 73, 86];
scoreVar.cargo = [76, 67, 97, 63, 27, 73, 90];
scoreVar.taxi = [87, 96, 65, 82, 84, 63, 77];
scoreVar.passenger = [91, 76, 95, 82, 64, 73, 79];
var peopleCountVar = {};
peopleCountVar.bus = [2220, 1832, 1921, 2344, 2410, 3320, 3140];
peopleCountVar.railway = [1220, 1332, 1011, 1344, 950, 2330, 2140];
peopleCountVar.taxi = [2220, 1832, 1921, 2344, 2410, 3320, 3140];
peopleCountVar.privateCar = [1520, 2324, 2101, 1524, 1530, 3340, 3550];
var siteCount = [1798, 389, 897, 295, 115, 1563];

function Site() {
	var mid_top_site_chart = echarts.init(document.getElementById("mid_top_site"));
	mid_top_site_chart.setOption(option = {
		color: ['#3A5FCD'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '2%',
			right: '4%',
			bottom: '2%',
			top: '10%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				data: ['普通式', '单杆式', '单牌式', '直线式', '港湾式', '临时式'],
				axisTick: {
					alignWithLabel: true
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: '#E0E0E0'
					}
				},
			}
		],
		yAxis: [
			{
				type: 'value',
				axisLabel: {
					show: true,
					textStyle: {
						color: '#E0E0E0'
					}
				},
			}
		],
		series: [
			{
				type: 'bar',
				barWidth: '60%',
				data: siteCount
			}
		]
	});
}
function HeatMap() {
	var mid_top_heatMap_chart = echarts.init(document.getElementById("mid_top"));
	var heatMap_data = [];
	$.ajax({
		url: "http://111.26.195.112:8001/api/bus",
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			var tempArr = [];
			var VehStr = JSON.parse(data);
			for (var key in VehStr) {
				var VehStrArr = VehStr[key].split('|');
				var item = { "coord": [VehStrArr[1], VehStrArr[2]], "elevation": 0 };
				tempArr.push(item);
			}
			heatMap_data.push(tempArr);
			var points = [].concat.apply([], heatMap_data.map(function (track) {
				return track.map(function (seg) {
					return seg.coord.concat([1]);
				});
			}));
			mid_top_heatMap_chart.setOption(option = {
				animation: false,
				bmap: {
					center: [125.35, 43.86],
					zoom: 12,
					roam: true,
					mapStyle: { style: 'dark' },
				},
				visualMap: {
					show: false,
					top: 'top',
					min: 0,
					max: 3,
					seriesIndex: 0,
					calculable: true,
					inRange: {
						color: ['green', 'yellow', 'orange', 'red']
					}
				},
				series: [{
					type: 'heatmap',
					coordinateSystem: 'bmap',
					data: points,
					pointSize: 6,
					blurSize: 10
				}]
			});
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log('API called error');
		}
	});
}
function PeopleCount() {
	// 出行人数
	var left_bottom_peopleCount_chart = echarts.init(document.getElementById("left_bottom_peopleCount"));
	left_bottom_peopleCount_chart.setOption(
		option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['公交车', '出租车', '私家车', '轨道交通'],
				itemGap: 10,
				itemWidth: 25,
				textStyle: {
					color: '#E0E0E0'
				}
			},
			grid: {
				left: '2%',
				right: '4%',
				bottom: '2%',
				top: '20%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: false,
					data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
					axisLabel: {
						show: true,
						textStyle: {
							color: '#E0E0E0'
						}
					},
				}
			],
			yAxis: [
				{
					type: 'value',
					axisLabel: {
						show: true,
						textStyle: {
							color: '#E0E0E0'
						}
					},
				}
			],
			series: [
				{
					name: '轨道交通',
					type: 'line',
					stack: '总量',
					areaStyle: { normal: {} },
					data: peopleCountVar.railway
				},
				{
					name: '出租车',
					type: 'line',
					stack: '总量',
					areaStyle: { normal: {} },
					data: peopleCountVar.taxi
				},
				{
					name: '私家车',
					type: 'line',
					stack: '总量',
					areaStyle: { normal: {} },
					data: peopleCountVar.privateCar
				},
				{
					name: '公交车',
					type: 'line',
					stack: '总量',
					areaStyle: { normal: {} },
					data: peopleCountVar.bus
				}
			]
		});
};
function Map() {
	// 公交线网地图	
	var bla_map_chart = echarts.init(document.getElementById("bla_map"));
	$.ajax({
		url: "http://111.26.195.112:8001/api/busline",
		type: 'GET',
		dataType: 'JSON',
		success: function (data) {
			var buslines = [];
			var dataArr = data.split('#');
			for (var item in dataArr) {
				var tempObj = {};
				tempObj.coords = JSON.parse(dataArr[item]);
				tempObj.lineStyle = {
					normal: {
						color: echarts.color.modifyHSL('#5A94DF', Math.round(RandomNumBoth(0, 255)))
					}
				}
				buslines.push(tempObj);
			};
			bla_map_chart.setOption(option = {
				bmap: {
					center: [125.33, 43.88],
					zoom: 12,
					roam: true,
					mapStyle: {
						'styleJson': [
							{
								'featureType': 'water',
								'elementType': 'all',
								'stylers': {
									'color': '#031628'
								}
							},
							{
								'featureType': 'land',
								'elementType': 'geometry',
								'stylers': {
									'color': '#000102'
								}
							},
							{
								'featureType': 'highway',
								'elementType': 'all',
								'stylers': {
									'visibility': 'off'
								}
							},
							{
								'featureType': 'arterial',
								'elementType': 'geometry.fill',
								'stylers': {
									'color': '#000000'
								}
							},
							{
								'featureType': 'arterial',
								'elementType': 'geometry.stroke',
								'stylers': {
									'color': '#0b3d51'
								}
							},
							{
								'featureType': 'local',
								'elementType': 'geometry',
								'stylers': {
									'color': '#000000'
								}
							},
							{
								'featureType': 'railway',
								'elementType': 'geometry.fill',
								'stylers': {
									'color': '#000000'
								}
							},
							{
								'featureType': 'railway',
								'elementType': 'geometry.stroke',
								'stylers': {
									'color': '#08304b'
								}
							},
							{
								'featureType': 'subway',
								'elementType': 'geometry',
								'stylers': {
									'lightness': -70
								}
							},
							{
								'featureType': 'building',
								'elementType': 'geometry.fill',
								'stylers': {
									'color': '#000000'
								}
							},
							{
								'featureType': 'all',
								'elementType': 'labels.text.fill',
								'stylers': {
									'color': '#857f7f'
								}
							},
							{
								'featureType': 'all',
								'elementType': 'labels.text.stroke',
								'stylers': {
									'color': '#000000'
								}
							},
							{
								'featureType': 'building',
								'elementType': 'geometry',
								'stylers': {
									'color': '#022338'
								}
							},
							{
								'featureType': 'green',
								'elementType': 'geometry',
								'stylers': {
									'color': '#062032'
								}
							},
							{
								'featureType': 'boundary',
								'elementType': 'all',
								'stylers': {
									'color': '#465b6c'
								}
							},
							{
								'featureType': 'manmade',
								'elementType': 'all',
								'stylers': {
									'color': '#022338'
								}
							},
							{
								'featureType': 'label',
								'elementType': 'all',
								'stylers': {
									'visibility': 'off'
								}
							}
						]
					},
				},
				series: [{
					type: 'lines',
					coordinateSystem: 'bmap',
					polyline: true,
					data: buslines,
					silent: true,
					lineStyle: {
						normal: {
							opacity: 0.2,
							width: 1
						}
					},
					progressiveThreshold: 500,
					progressive: 100
				}, {
					type: 'lines',
					coordinateSystem: 'bmap',
					polyline: true,
					data: buslines,
					lineStyle: {
						normal: {
							width: 0.02
						}
					},
					effect: {
						constantSpeed: 40,
						show: true,
						trailLength: 0.02,
						symbolSize: 2
					},
					zlevel: 1
				}]
			});
			var baiduMap = bla_map_chart.getModel().getComponent('bmap').getBMap();
			baiduMap.addControl(new BMap.NavigationControl());
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log('API called error');
		}
	});

};
function OnRate() {
	// 车辆上线情况
	var left_bottom_onRate_chart = echarts.init(document.getElementById("left_bottom_onRate"));
	left_bottom_onRate_chart.setOption(
		option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ["公交车", "出租车", "货车", "旅游包车", "客运车"],
				itemGap: 10,
				itemWidth: 25,
				textStyle: {
					color: '#E0E0E0'
				}
			},
			grid: {
				left: '2%',
				right: '7%',
				bottom: '2%',
				top: '20%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['0~4时', '4~8时', '8~12时', '12~16时', '16~20时', '20~24时'],
				axisLabel: {
					show: true,
					textStyle: {
						color: '#E0E0E0'
					}
				},
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					show: true,
					textStyle: {
						color: '#E0E0E0'
					}
				},
			},
			series: [
				{
					name: '公交车',
					type: 'line',
					data: onRateVar.bus,
				},
				{
					name: '出租车',
					type: 'line',
					data: onRateVar.taxi,
				},
				{
					name: '货车',
					type: 'line',
					data: onRateVar.cargo,
				},
				{
					name: '旅游包车',
					type: 'line',
					data: onRateVar.travel,
				},
				{
					name: '客运车',
					type: 'line',
					data: onRateVar.passenger,
				}
			]
		});
};
function VehiclePercentage() {
	var mid_bot_vehiclePercentage_chart = echarts.init(document.getElementById("mid_bot_vehiclePercentage"));
	mid_bot_vehiclePercentage_chart.setOption(option = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			x: 'left',
			textStyle: {
				color: '#00000'
			},
			data: ['公交车', '出租车', '货运车', '旅游包车', '客运车']
		},
		series: [
			{
				name: '长春市各行业车辆数量',
				type: 'pie',
				radius: ['35%', '65%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [
					{ value: vehiclePercentageVar.busCount, name: '公交车' },
					{ value: vehiclePercentageVar.taxiCount, name: '出租车' },
					{ value: vehiclePercentageVar.cargoCount, name: '货运车' },
					{ value: vehiclePercentageVar.travelCount, name: '旅游包车' },
					{ value: vehiclePercentageVar.passengerCount, name: '客运车' }
				]
			}
		]
	});

};
function Score() {
	var mid_bot_bottom_score_chart = echarts.init(document.getElementById("mid_bot_bottom_score"));
	mid_bot_bottom_score_chart.setOption(option = {
		legend: {
			data: ["公交车", "出租车", "货车", "旅游包车", "客运车"],
			orient: 'vertical',
			x: 'right',

			selectedMode: 'multiple',
			textStyle: {
				color: '#00000'
			},
		},
		radar: {
			radius: '65%',
			center: ['40%', '50%'],
			indicator: [
				{ name: '卫生情况', max: 100 },
				{ name: '服务态度', max: 100 },
				{ name: '准点情况', max: 100 },
				{ name: '信息公开', max: 100 },
				{ name: '车辆调度', max: 100 },
				{ name: '驾驶礼仪', max: 100 }
			],
			shape: 'circle',
		},
		series: [
			{
				name: '公交车',
				type: 'radar',
				data: [
					scoreVar.bus
				],
			},
			{
				name: '出租车',
				type: 'radar',
				data: [
					scoreVar.taxi
				],
			},
			{
				name: '货车',
				type: 'radar',
				data: [
					scoreVar.cargo
				],
			}, {
				name: '旅游包车',
				type: 'radar',
				data: [
					scoreVar.travel
				],
			}, {
				name: '客运车',
				type: 'radar',
				data: [
					scoreVar.passenger
				],
			}
		]
	});
};
function randomInit() {
	RefreshTime();
	RandomSpeed();
	GetWeather();
	RandomTraffic();
	window.setInterval(RefreshTime, 1000);
	window.setInterval(RandomSpeed, 1000 * 60);
	//window.setInterval(HeatMap, 1000 * 60 * 5);
	window.setInterval(RandomTraffic, 1000 * 60 * 10);
	window.setInterval(GetWeather, 1000 * 60 * 60);

};
function toDouble(time) {
	if (time < 10) {
		return '0' + time;
	}
	else {
		return '' + time;
	}
}
function RefreshTime() {
	var dt = new Date();
	var month = dt.getMonth() + Number(1);
	var date = toDouble(dt.getFullYear()) + "年" + toDouble(month) + "月" + toDouble(dt.getDate()) + "日";
	var time = toDouble(dt.getHours()) + ":" + toDouble(dt.getMinutes()) + ":" + toDouble(dt.getSeconds());
	$("#timeArea").html(time);
	$("#dateArea").html(date);
};
function GetWeather() {
	$.ajax({
		url: "http://api.map.baidu.com/telematics/v3/weather?location=长春&output=json&ak=hYCENCEx1nXO0Nt46ldexfG9oI49xBGh",
		type: 'GET',
		dataType: 'JSONP',
		success: function (data) {
			//console.log(data);
			$("#temperature").html(data.results[0].weather_data[0].temperature);
			$("#pm25").html("PM 2.5 : " + data.results[0].pm25);
			$("#wind").html(data.results[0].weather_data[0].weather + " " + data.results[0].weather_data[0].wind);
			$("#weatherPic").attr('src', data.results[0].weather_data[0].dayPictureUrl);
		}
	});
};
function RandomSpeed() {
	$("#vehDensity").html(RandomNumBoth(5, 7));
	$("#vehSpeed").html(RandomNumBoth(20, 25));
};
function RandomTraffic() {
	// init
	var hour = new Date().getHours();
	if (hour >= 20 || hour <= 6) {
		$('#area1').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area2').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area3').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area4').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area1').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area2').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area3').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area4').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area1 a').html("畅通").attr('class', 'btn changtong');
		$('#area2 a').html("畅通").attr('class', 'btn changtong');
		$('#area3 a').html("畅通").attr('class', 'btn changtong');
		$('#area4 a').html("畅通").attr('class', 'btn changtong');
	} else if (hour > 6 && hour <= 8) {
		$('#area1').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area2').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
		$('#area3').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
		$('#area4').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
		$('#area1').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area2').next().children().eq(0).html("平均车速: " + RandomNumBoth(5, 10) + "KM/H");
		$('#area3').next().children().eq(0).html("平均车速: " + RandomNumBoth(5, 10) + "KM/H");
		$('#area4').next().children().eq(0).html("平均车速: " + RandomNumBoth(5, 10) + "KM/H");
		$('#area1 a').html("缓行").attr('class', 'btn zhengchang');
		$('#area2 a').html("拥堵").attr('class', 'btn yongji');
		$('#area3 a').html("拥堵").attr('class', 'btn yongji');
		$('#area4 a').html("拥堵").attr('class', 'btn yongji');
	} else if (hour > 8 && hour <= 11) {
		$('#area1').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
		$('#area2').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area3').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area4').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area1').next().children().eq(0).html("平均车速: " + RandomNumBoth(5, 10) + "KM/H");
		$('#area2').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area3').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area4').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area1 a').html("拥堵").attr('class', 'btn yongji');
		$('#area2 a').html("畅通").attr('class', 'btn changtong');
		$('#area3 a').html("缓行").attr('class', 'btn zhengchang');
		$('#area4 a').html("畅通").attr('class', 'btn changtong');
	} else if (hour > 11 && hour <= 12) {
		$('#area1').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area2').children().eq(1).html("车流量拥堵, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area3').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area4').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area1').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area2').next().children().eq(0).html("平均车速: " + RandomNumBoth(5, 10) + "KM/H");
		$('#area3').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area4').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area1 a').html("缓行").attr('class', 'btn zhengchang');
		$('#area2 a').html("拥堵").attr('class', 'btn yongji');
		$('#area3 a').html("缓行").attr('class', 'btn zhengchang');
		$('#area4 a').html("缓行").attr('class', 'btn zhengchang');
	} else if (hour > 12 && hour <= 16) {
		$('#area1').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
		$('#area2').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area3').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area4').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
		$('#area1').next().children().eq(0).html("平均车速: " + RandomNumBoth(5, 10) + "KM/H");
		$('#area2').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area3').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area4').next().children().eq(0).html("平均车速: " + RandomNumBoth(20, 30) + "KM/H");
		$('#area1 a').html("拥堵").attr('class', 'btn yongji');
		$('#area2 a').html("畅通").attr('class', 'btn changtong');
		$('#area3 a').html("缓行").attr('class', 'btn zhengchang');
		$('#area4 a').html("畅通").attr('class', 'btn changtong');
	} else if (hour > 16 && hour <= 19) {
		$('#area1').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area2').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
		$('#area3').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area4').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
		$('#area1').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area2').next().children().eq(0).html("平均车速: " + RandomNumBoth(5, 10) + "KM/H");
		$('#area3').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area4').next().children().eq(0).html("平均车速: " + RandomNumBoth(10, 20) + "KM/H");
		$('#area1 a').html("缓行").attr('class', 'btn zhengchang');
		$('#area2 a').html("拥堵").attr('class', 'btn yongji');
		$('#area3 a').html("缓行").attr('class', 'btn zhengchang');
		$('#area4 a').html("缓行").attr('class', 'btn zhengchang');
	}
	// end init

	$.ajax({
		url: "http://111.26.195.112:8001/api/traffic",
		type: 'GET',
		dataType: 'JSON',
		success: function (jsonData) {
			var count = 0;
			var str = "";
			jsonData = JSON.parse(jsonData);
			if (!jsonData.Code) {
				var points = [];
				for (var key in jsonData) {
					var lng = jsonData[key].split(',')[1];
					var lat = jsonData[key].split(',')[2];
					str += lng + "," + lat + ";"
					count++;
				};
				str = str.substr(0, str.length - 1);
				$.ajax({
					url: "http://api.map.baidu.com/geoconv/v1/?coords=" + str + "&from=1&to=5&ak=hYCENCEx1nXO0Nt46ldexfG9oI49xBGh",
					type: 'POST',
					dataType: 'jsonp',
					success: function (fixedData) {
						for (var j = 0; j < count; j++) {
							fixedData.result[j].speed = Object.values(jsonData)[j].split(',')[3];
							fixedData.result[j].time = Object.values(jsonData)[j].split(',')[4];
						}
						TrafficFlow(fixedData.result);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						console.log('API called error');
					}
				});
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log('API called error');
		}
	});
};
function RandomNumBoth(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Rand * Range;
	return num.toFixed(1);
};
function TrafficFlow(obj) {
	peopleSqureSpeed = [];
	workerSqureSpeed = [];
	satelliteSqureSpeed = [];
	peopleStreetSpeed = [];
	for (var index in obj) {
		if (obj[index].x > 125.328 && obj[index].x < 125.338 && obj[index].y > 43.890 && obj[index].y < 43.895) {
			// 人民广场
			peopleSqureSpeed.push(Number(obj[index].speed));
		}
		else if (obj[index].x > 125.330 && obj[index].x < 125.336 && obj[index].y > 43.854 && obj[index].y < 43.860) {
			// 工农广场
			workerSqureSpeed.push(Number(obj[index].speed));
		}
		else if (obj[index].x > 125.330 && obj[index].x < 125.336 && obj[index].y > 43.836 && obj[index].y < 43.842) {
			// 卫星广场
			satelliteSqureSpeed.push(Number(obj[index].speed));
		}
		else if (obj[index].x > 125.330 && obj[index].x < 125.336 && obj[index].y > 43.882 && obj[index].y < 43.886) {
			// 人民大街解放大路
			peopleStreetSpeed.push(Number(obj[index].speed));
		}
	}

	if (peopleSqureSpeed.length > 0) {
		var speed = RandomNumBoth(10, 15);
		for (var i = 0; i < peopleSqureSpeed.length; i++) {
			speed += peopleSqureSpeed[i];
		}
		speed = (speed / peopleSqureSpeed.length).toFixed(1);
		if (speed < 10) {
			// 拥堵
			$('#area1').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
			$('#area1').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area1 a').html("拥堵").attr('class', 'btn yongji');
		} else if (speed > 10 && speed < 20) {
			// 缓行
			$('#area1').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
			$('#area1').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area1 a').html("缓行").attr('class', 'btn zhengchang');
		} else {
			// 畅通
			$('#area1').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
			$('#area1').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area1 a').html("畅通").attr('class', 'btn changtong');
		}
	}
	if (workerSqureSpeed.length > 0) {
		var speed = RandomNumBoth(5, 10);
		for (var i = 0; i < workerSqureSpeed.length; i++) {
			speed += workerSqureSpeed[i];
		}
		speed = speed / workerSqureSpeed.length;
		if (speed < 10) {
			// 拥堵
			$('#area2').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
			$('#area2').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area2 a').html("拥堵").attr('class', 'btn yongji');
		} else if (speed > 10 && speed < 20) {
			// 缓行
			$('#area2').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
			$('#area2').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area2 a').html("缓行").attr('class', 'btn zhengchang');
		} else {
			// 畅通
			$('#area2').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
			$('#area2').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area2 a').html("畅通").attr('class', 'btn changtong');
		}
	}
	if (satelliteSqureSpeed.length > 0) {
		var speed = RandomNumBoth(5, 10);
		for (var i = 0; i < satelliteSqureSpeed.length; i++) {
			speed += satelliteSqureSpeed[i];
		}
		speed = speed / satelliteSqureSpeed.length;
		if (speed < 10) {
			// 拥堵
			$('#area3').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
			$('#area3').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area3 a').html("拥堵").attr('class', 'btn yongji');
		} else if (speed > 10 && speed < 20) {
			// 缓行
			$('#area3').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
			$('#area3').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area3 a').html("缓行").attr('class', 'btn zhengchang');
		} else {
			// 畅通
			$('#area3').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
			$('#area3').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area3 a').html("畅通").attr('class', 'btn changtong');
		}
	}
	if (peopleStreetSpeed.length > 0) {
		var speed = RandomNumBoth(5, 10);
		for (var i = 0; i < peopleStreetSpeed.length; i++) {
			speed += peopleStreetSpeed[i];
		}
		speed = speed / peopleStreetSpeed.length;
		if (speed < 10) {
			// 拥堵
			$('#area4').children().eq(1).html("车流量拥堵, " + RandomNumBoth(30, 50) + "辆/KM");
			$('#area4').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area4 a').html("拥堵").attr('class', 'btn yongji');
		} else if (speed > 10 && speed < 20) {
			// 缓行
			$('#area4').children().eq(1).html("车流量缓行, " + RandomNumBoth(20, 30) + "辆/KM");
			$('#area4').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area4 a').html("缓行").attr('class', 'btn zhengchang');
		} else {
			// 畅通
			$('#area4').children().eq(1).html("车流量畅通, " + RandomNumBoth(10, 20) + "辆/KM");
			$('#area4').next().children().eq(0).html("平均车速: " + speed + "KM/H");
			$('#area4 a').html("畅通").attr('class', 'btn changtong');
		}
	}
}
$(function () {
	randomInit();
	Map();
	Site();
	//HeatMap();
	PeopleCount();
	OnRate();
	GetWeather();
	VehiclePercentage();
	Score();
});