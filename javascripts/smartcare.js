var smartcare = function () {
	var
	dialChart,
	dialHeartLabel,
	pulseSeries,
	temperatureSeries,
	bloodOxygenSeries,
	bloodSugarSeries,
	bpBulletChart,
	bpBulletSeries,
	eLinearChart,
	eLinearSeries;
	
    function _sc(g) {
		drawRuntimeGadgets(g);
        return _sc;
    }

	_sc.onData = function (data) {
		var d = data || {};
		if (d.pulse) {
			_sc.pulse(d.pulse);
		}
		if (d.temperature) {
			_sc.temperature(d.temperature);
		}
		if (d.bloodOxygen) {
			_sc.bloodOxygen(d.bloodOxygen);
		}
		if (d.bloodSugar) {
			_sc.bloodSugar(d.bloodSugar);
		}
		if (d.bloodPressure) {
			_sc.bloodPressure(d.bloodPressure);
		}
		if (d.energyInOut) {
			_sc.energyInOut(d.energyInOut);
		}
		return _sc;
	}
	
	_sc.pulse = function (value) {
		pulseSeries.fMovePointer(value);
		dialHeartLabel.fValue(value);
		return _sc;
	}
	
	_sc.temperature = function (value) {
		temperatureSeries.fMovePointer(value);
		return _sc;
	}
	
	_sc.bloodOxygen = function (value) {
		bloodOxygenSeries.fMovePointer(value);
		return _sc;
	}
	
	_sc.bloodSugar = function (value) {
		bloodSugarSeries.fMovePointer(value);
		return _sc;
	}
	
	_sc.bloodPressure = function(values) {
		if (typeof values[0] === 'number') {
			bpBulletSeries.fChangeMeasure(0, values[0]);
		}
		
		if (typeof values[1] === 'number') {
			bpBulletSeries.fMoveTarget(0, values[1]);
		}
		
		if (typeof values[2] === 'number') {
			bpBulletSeries.fMoveTarget(1, values[2]);
		}
		return _sc;
	}
	
	_sc.energyInOut = function(values) {
		if (typeof values[0] === 'number') {
			eLinearSeries.fMovePointer(0, values[0]);
		}
		
		if (typeof values[1] === 'number') {
			eLinearSeries.fMovePointer(1, values[1]);
		}
		return _sc;
	}
	
    function getContainerSize(g) {
        return {'width': $(window).width(), 'height': $(window).height() - 100};
        //return {'width' : 400, 'height' : 800};
    }

    function getDialOptions(_fontSize) {
        return {
            chart : {
                colorPalette : [0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
                    0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf],
                title : {
                    enabled : false
                },
                legend : {
                    enabled : false
                },
                plot : {
                    layout : {
                        type : 'mixed', // It contains two types, mixed/grid, default is mixed.
                        rows : 0, // row number for grid layout, the height of each row will get same size to fit total height of plot.
                        columns : 0 // column number for grid layout, the width of each column will get same size to fit total width of plot.
                    },
                    fill : 'blue',
                    fillOpacity : 0.5,
                    border : {},
                    series : [{
                            type : 'dial',
                            axisIndex : 0,
                            startAngle : -90, //
                            endAngle : 0,
                            fillOpacity : 0,
                            dialArc : {
                                radius : '95%', // percent value of min value of container's width and height.
                                innerRadius : '50%', // Same with radius,
                                fill : 'red',
                                fillOpacity : 0.7,
                                border : {
                                    enabled : false,
                                    stroke : 'white',
                                    strokeOpacity : 0,
                                    strokeWidth : 1
                                }
                            },
                            data : [60],
                            indicator : {
                                fill : 'red',
                                fillOpacity : 1,
                                body : {
                                    headRadius : '80%',
                                    headSize : 3,
                                    pivotSize : 3,
                                    tailRadius : '15%',
                                    tailSize : 3,
                                    fill : 'red',
                                    fillOpacity : 0.8,
                                    border : {
                                        stroke : 'rgb(255,128,128)',
                                        strokeWidth : 2
                                    }
                                },
                                pivotMarker : {
                                    enabled : true,
                                    type : 'circle',
                                    size : '80%', // percent of radius
                                    fill : 'red',
                                    fillOpacity : 1,
                                    border : {
                                        stroke : 'green',
                                        strokeWidth : 1,
                                        strokeOpacity : 0
                                    }
                                }
                            }
                        }, {
                            type : 'dial',
                            axisIndex : 1,
                            startAngle : 0, //
                            endAngle : 90,
                            fillOpacity : 0,
                            dialArc : {
                                radius : '95%', // percent value of min value of container's width and height.
                                innerRadius : '55%', // Same with radius,
                                fill : 'rgb(255, 128,64)',
                                fillOpacity : 0.7,
                                border : {
                                    enabled : false,
                                    stroke : 'white',
                                    strokeOpacity : 0,
                                    strokeWidth : 1
                                }
                            },
                            data : [37.5],
                            indicator : {
                                fill : 'rgb(0,128,255)',
                                fillOpacity : 1,
                                body : {
                                    headRadius : '80%',
                                    headSize : 3,
                                    pivotSize : 3,
                                    tailRadius : '15%',
                                    tailSize : 3,
                                    fill : 'rgb(128, 0,128)',
                                    fillOpacity : 1,
                                    border : {
                                        stroke : 'rgb(255, 200,255)',
                                        strokeWidth : 2
                                    }
                                }
                            }
                        }, {
                            type : 'dial',
                            axisIndex : 2,
                            startAngle : 90, //
                            endAngle : 180,
                            fill : {
                                type : 'radialGradient',
                                parameters : ['50%', '50%', '50%', '50%', '50%'],
                                stops : [{
                                        offset : '50%',
                                        stopColor : 'black',
                                        stopOpacity : 1
                                    }, {
                                        offset : '100%',
                                        stopColor : 'blue',
                                        stopOpacity : 1
                                    }
                                ]

                            },
                            fillOpacity : 0,
                            border : {
                                enabled : true,
                                stroke : 'blue',
                                strokeOpacity : 1,
                                strokeWidth : 1,
                            },
                            dialArc : {
                                radius : '95%', // percent value of min value of container's width and height.
                                innerRadius : '50%', // Same with radius,
                                fill : 'rgb(64,128,128)',
                                fillOpacity : 0.7,
                                border : {
                                    enabled : true,
                                    stroke : 'white',
                                    strokeOpacity : 0,
                                    strokeWidth : 1
                                }
                            },
                            data : [5],
                            indicator : {
                                fill : 'red',
                                fillOpacity : 1,
                                body : {
                                    headRadius : '80%',
                                    headSize : 3,
                                    pivotSize : 3,
                                    tailRadius : '15%',
                                    tailSize : 3,
                                    fill : 'rgb(0,64,64)',
                                    fillOpacity : 1,
                                    border : {
                                        enabled : true,
                                        stroke : 'rgb(100,255,255)',
                                        strokeWidth : 2
                                    }
                                }
                            }
                        }, {
                            type : 'dial',
                            axisIndex : 3,
                            startAngle : 180, //
                            endAngle : 270,
                            fillOpacity : 0,
                            dialArc : {
                                radius : '95%', // percent value of min value of container's width and height.
                                innerRadius : '55%', // Same with radius,
                                fill : 'rgb(255,128,64)',
                                fillOpacity : 0.7,
                                border : {
                                    enabled : false,
                                    stroke : 'white',
                                    strokeOpacity : 0,
                                    strokeWidth : 1
                                }
                            },
                            data : [10],
                            indicator : {
                                fill : 'red',
                                fillOpacity : 1,
                                body : {
                                    headRadius : '80%',
                                    headSize : 3,
                                    pivotSize : 3,
                                    tailRadius : 0,
                                    tailSize : 3,
                                    fill : 'red',
                                    fillOpacity : 0.8,
                                    border : {
                                        stroke : 'rgb(255,128,128)',
                                        strokeWidth : 2
                                    }
                                }
                            }
                        }
                    ]
                },
                // category : {},
                xAxis : {},
                yAxis : [{
                        enabled : true,
                        orient : 'out', // 'in' or 'out'
                        //      x : ,
                        //      y : ,
                        //      fill:,
                        fillOpacity : 0,
                        title : {},
                        label : {
                            enabled : true,
                            normalize : false, // Used for dial axis label, true means the label will be rotated rather than horizontal.
                            fill : 'white',
                            fillOpacity : 1,
                            font : {
                                fontSize : _fontSize
                            },
                            position : 'same', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
                            format : null
                        },
                        axisLine : {
                            enabled : true,
                            fill : 'black',
                            fillOpacity : 1,
                            width : 1 // stroke-width
                        },
                        tick : {
                            enabled : true,
                            padding : 10,
                            //showStartTickLabel: false,
                            showEndTickLabel : false,
                            scale : {
                                stepNumber : 5,
                                //              stepInterval:0,
                                min : 0,
                                max : 250
                                //              autoExpand:false,// TRUE indicate to ignore min/max when actual
                                // value exceeds min/max
                            },
                            major : {
                                enabled : true,
                                style : 'below', // cross/above/below
                                size : '10%',
                                strokeWidth : 4,
                                stroke : 'white'
                            },
                            minor : {
                                enabled : false,
                                style : 'below', // cross/above/below
                                size : '5%',
                                stroke : 'rgb(100,100,100)',
                                strokeWidth : 3,
                                count : 2
                            }
                        },
                        bands : [{
                                enabled : true,
                                type : 'line', // line or range
                                label : {},
                                marker : {
                                    enabled : false,
                                    type : 'arrow',
                                    size : 5,
                                    border : {},
                                    fill : 'white',
                                    fillOpacity : 0
                                },
                                //          startValue: 0,
                                //          endValue : 0,
                            }
                        ]
                    }, {
                        enabled : true,
                        orient : 'out', // 'in' or 'out'
                        //      x : ,
                        //      y : ,
                        //      fill:,
                        fillOpacity : 0,
                        title : {},
                        label : {
                            enabled : true,
                            normalize : false, // Used for dial axis label, true means the label will be rotated rather than horizontal.
                            fill : 'black',
                            fillOpacity : 1,
                            font : {
                                fontSize : _fontSize
                            },
                            position : 'same', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
                            format : null
                        },
                        axisLine : {
                            enabled : true,
                            fill : 'black',
                            fillOpacity : 1,
                            width : 1 // stroke-width
                        },
                        tick : {
                            enabled : true,
                            showStartTickLabel : false,
                            showEndTickLabel : false,
                            padding : 10,
                            scale : {
                                stepNumber : 5,
                                //              stepInterval:0,
                                min : 30,
                                max : 45
                                //              autoExpand:false,// TRUE indicate to ignore min/max when actual
                                // value exceeds min/max
                            },
                            major : {
                                enabled : true,
                                style : 'below', // cross/above/below
                                size : '10%',
                                strokeWidth : 4
                            },
                            minor : {
                                enabled : false,
                                count : 2,
                                style : 'below', // cross/above/below
                                size : '5%',
                                strokeWidth : 3
                            }
                        }
                    }, {
                        enabled : true,
                        orient : 'out', // 'in' or 'out'
                        //      x : ,
                        //      y : ,
                        //      fill:,
                        fillOpacity : 0,
                        title : {},
                        label : {
                            enabled : true,
                            normalize : false, // Used for dial axis label, true means the label will be rotated rather than horizontal.
                            fill : 'black',
                            fillOpacity : 1,
                            font : {
                                fontSize : adaptFontSize(_fontSize)
                            },
                            position : 'same', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
                            format : null
                        },
                        axisLine : {
                            enabled : true,
                            fill : 'black',
                            fillOpacity : 1,
                            width : 1 // stroke-width
                        },
                        tick : {
                            enabled : true,
                            padding : 20,
                            showStartTickLabel : false,
                            showEndTickLabel : false,
                            scale : {
                                stepNumber : 4,
                                //              stepInterval:0,
                                min : 0,
                                max : 20
                                //              autoExpand:false,// TRUE indicate to ignore min/max when actual
                                // value exceeds min/max
                            },
                            major : {
                                enabled : true,
                                style : 'below', // cross/above/below
                                size : '10%',
                                strokeWidth : 4
                            },
                            minor : {
                                enabled : false,
                                style : 'below', // cross/above/below
                                size : '5%',
                                strokeWidth : 3
                            }
                        }
                    }, {
                        enabled : true,
                        orient : 'out', // 'in' or 'out'
                        //      x : ,
                        //      y : ,
                        //      fill:,
                        fillOpacity : 0,
                        title : {},
                        label : {
                            enabled : true,
                            normalize : false, // Used for dial axis label, true means the label will be rotated rather than horizontal.
                            fill : 'black',
                            fillOpacity : 1,
                            font : {
                                fontSize : adaptFontSize(_fontSize)
                            },
                            position : 'same', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
                            format : null
                        },
                        axisLine : {
                            enabled : true,
                            fill : 'black',
                            fillOpacity : 1,
                            width : 1 // stroke-width
                        },
                        tick : {
                            enabled : true,
                            padding : 20,
                            showStartTickLabel : false,
                            showEndTickLabel : false,
                            scale : {
                                stepNumber : 3,
                                //              stepInterval:0,
                                min : 5,
                                max : 20
                                //              autoExpand:false,// TRUE indicate to ignore min/max when actual
                                // value exceeds min/max
                            },
                            major : {
                                enabled : true,
                                style : 'below', // cross/above/below
                                size : '10%',
                                strokeWidth : 4
                            },
                            minor : {
                                enabled : false,
                                style : 'below', // cross/above/below
                                size : '5%',
                                strokeWidth : 3
                            }
                        }
                    }

                ]
            }
        };
    }

    function getHeartPath(size) {
        // return a heart marker paths
        var r = size / 2;
        return 'M' + (-r) + ',' + (-r / 2) + ' A' + r + ',' + size + ' 0 0,1 ' + 0 + ',' + (-r / 2) + ' A' + r + ',' + size + ' 0 0,1 ' + r + ',' + (-r / 2) + ' L0,' + r + 'Z';
    }

    function createDial(g, bounds, _fontSize) {

        var
        opts = getDialOptions(_fontSize);
        dial = g.selectAll('.dialGadget').data([opts]),
        dialUpdate = dial.enter().append('div').attr('class', 'dialGadget').attr(bounds),
        context = new d3charts.ChartContext(),
        chart = new d3charts.Chart(context, opts);
		
		dialChart = chart;
        chart.fRender(dialUpdate);

        var series = chart.fSeries('dial');
		pulseSeries = series[0];
		temperatureSeries = series[1];
		bloodOxygenSeries = series[2];
		bloodSugarSeries = series[3];

        var
        bbox = series[0].d3Sel.bbox(),
        size = bbox.width;

        // Add heart label.
        var labelOpts = {
            'width' : size * 0.4,
            'digitCount' : 3,
            'negative' : false,
            'decimals' : 0,
            'value' : 0,
            'gap' : 150,
            'fill' : 'yellow',
            'fillOpacity' : 0.5
        };
        var
        heartLabel = new d3charts.LedLabel(series[0], context, labelOpts).fRender(),
        h = heartLabel.d3Sel.bbox().height;
        heartLabel.d3Sel.attr('transform', 'translate(' + (series[0].cx - labelOpts.width / 2) + ' ' + (series[0].cy - h / 2) + ')');
        heartLabel.fValue(series[0].options.data[0]);

		dialHeartLabel = heartLabel;
		
        // Add labels.
        var
        fontSize = _fontSize,
        plot = chart.d3Sel.select('.plot');
        // Add pulse label.
        plot.append('text')
        .attr('class', 'watchItemLabel')
        .text('Pulse')
        .attr('dy', '1em')
        .attr('transform', 'translate(10, 10)')
        .style('text-anchor', 'start')
        .style('font-size', fontSize);

        plot.append('text')
        .attr('class', 'watchItemLabel')
        .text('Body Temp.')
        .attr('dy', '1em')
        .attr('transform', 'translate(' + (bounds.width - 10) + ', 10)')
        .style('text-anchor', 'end')
        .style('font-size', fontSize);

        plot.append('text')
        .attr('class', 'watchItemLabel')
        .text('Blood Sugar')
        .attr('dy', '0em')
        .attr('transform', 'translate(' + (bounds.width - 10) + ', ' + (bounds.height - 10) + ')')
        .style('text-anchor', 'end')
        .style('font-size', fontSize);

        plot.append('text')
        .attr('class', 'watchItemLabel')
        .text('Blood Oxygen')
        .attr('dy', '0em')
        .attr('transform', 'translate(' + 10 + ', ' + (bounds.height - 10) + ')')
        .style('text-anchor', 'start')
        .style('font-size', fontSize);
    }

    function getBloodPressureOptions(_fontSize) {
        return {
            chart : {
                // width:,
                // height:,
                fill : 'yellow',
                fillOpacity : 1,

                colorPalette : [0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
                    0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf],
                title : {
                    enabled : false
                },
                legend : {
                    enabled : false
                },
                plot : {
                    layout : {
                        type : 'mixed', // It contains two types, mixed/grid, default is mixed.
                        rows : 0, // row number for grid layout, the height of each row will get same size to fit total height of plot.
                        columns : 0 // column number for grid layout, the width of each column will get same size to fit total width of plot.
                    },
                    // fill:'',
                    fillOpacity : 0,
                    border : {},
                    series : [{
                            type : 'bullet',
                            orient : 'horizontal',
                            axisIndex : 0,
                            fill : {
                                type : 'linearGradient',
                                parameters : 'T,B',
                                stops : [{
                                        offset : '0%',
                                        stopColor : 'blue',
                                        stopOpacity : 1
                                    }, {
                                        offset : '50%',
                                        stopColor : 'white',
                                        stopOpacity : 1
                                    }, {
                                        offset : '100%',
                                        stopColor : 'blue',
                                        stopOpacity : 1
                                    }
                                ]
                            },
                            fillOpacity : 1,
                            title : {
                                enabled : false,
                                text : 'title',
                                font : {
                                    fill : 'red',
                                    fontSize : _fontSize
                                }
                            },
                            subtitle : {
                                enabled : false,
                                text : 'subtitle'
                            },
                            data : [{
                                    value : 105,
                                    //size: 20,
                                    fill : {
                                        type : 'linearGradient',
                                        parameters : 'T,B',
                                        stops : [{
                                                offset : '0%',
                                                stopColor : 'yellow',
                                                stopOpacity : 1
                                            }, {
                                                offset : '50%',
                                                stopColor : 'red',
                                                stopOpacity : 1
                                            }, {
                                                offset : '100%',
                                                stopColor : 'yellow',
                                                stopOpacity : 1
                                            }
                                        ]
                                    },
                                    fillOpacity : 1
                                }
                            ],
                            targets : [{
                                    value : 120,
                                    size : '80%',
                                    //width: 10,
                                    fill : 'red'
                                    //fillOpacity: 1
                                }, {
                                    value : 70,
                                    size : '80%',
                                    //width: 10,
                                    fill : 'black'
                                    //fillOpacity: 1
                                }
                            ]
                        }
                    ]
                },
                yAxis : [{
                        enabled : true,
                        orient : 'bottom',
                        reverse : false,
                        xOffset : 0, // The x offset relative to origin x of axis container, default is 0
                        yOffset : 0, // The y offset relative to origin y of axis container, default is 0
                        //fill : 'pink', // Default is undefined.
                        //fillOpacity : 0.5,
                        title : { // Inherit from label options and add following additional options.
                            position : '', // left/middle/right/top/bottom

                        },
                        label : {
                            enabled : true,
                            fill : 'black',
                            fillOpacity : 1,
                            font : {
                                fontSize : adaptFontSize(_fontSize, 2),
                            },
                            //        anchor: 'middle', // start/middle/end
                            rotation : 0,
                            rotationAnchor : 'middle',
                            position : 'opposite', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
                            format : null
                        },
                        axisLine : {
                            enabled : false,
                            stroke : 'red',
                            strokeOpacity : 1,
                            strokeWidth : 1 // stroke-width
                        },
                        tick : {
                            enabled : true,
                            padding : 3,
                            scale : {
                                //          stepNumber:0,
                                //          stepInterval:0,
                                //         min:50,
                                max : 220
                                //          autoExpand:false,// TRUE indicate to ignore min/max when actual
                                // value exceeds min/max
                            },
                            outerTickSize : 6,
                            showStartTickLabel : true,
                            showEndTickLabel : true,
                            major : {
                                enabled : true,
                                stroke : 'white',
                                strokeOpacity : 1,
                                strokeWidth : 3,
                                style : 'above', // cross/above/below
                                size : 10,
                                lineStepNumber : 1
                            },
                            minor : {
                                enabled : true,
                                count : 3,
                                stroke : 'white',
                                strokeOpacity : 1,
                                strokeWidth : 2,
                                style : 'above', // cross/above/below
                                size : 6
                            }
                        }
                    }
                ]
            }
        };
    }

    function getEnergyOptions(_fontSize) {
        return {
            chart : {
                // width:,
                // height:,
                fill : 'yellow',
                fillOpacity : 1,

                colorPalette : [0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
                    0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf],
                title : {
                    enabled : false
                },
                legend : {
                    enabled : false
                },
                plot : {
                    layout : {
                        type : 'mixed', // It contains two types, mixed/grid, default is mixed.
                        rows : 0, // row number for grid layout, the height of each row will get same size to fit total height of plot.
                        columns : 0 // column number for grid layout, the width of each column will get same size to fit total width of plot.
                    },
                    // fill:'',
                    fillOpacity : 0,
                    border : {},
                    series : [{
                            type : 'linear',
                            round : 20,
                            axisIndex : 0,
                            fill : {
                                type : 'linearGradient',
                                parameters : 'T,B',
                                stops : [{
                                        offset : '0%',
                                        stopColor : 'blue',
                                        stopOpacity : 1
                                    }, {
                                        offset : '30%',
                                        stopColor : 'white',
                                        stopOpacity : 1
                                    }, {
                                        offset : '100%',
                                        stopColor : 'blue',
                                        stopOpacity : 1
                                    }
                                ]
                            },
                            fillOpacity : 1,
                            border : {
                                enabled : true,
                                stroke : 'red',
                                strokeOpacity : 1,
                                strokeWidth : 2,
                            },
                            data : [{
                                    value : 150,
                                    markerPosition : 'below', // below or above
                                    marker : {
                                        enabled : true,
                                        type : 'triangle-up',
                                        size : Math.max(parseInt(_fontSize) / 2, 20),
                                        fill : 'red',
                                        border : {
                                            stroke : 'black',
                                            strokeWidth : 1,
                                            strokeOpacity : 1
                                        },
                                    },
                                    labelPosition : 'above',
                                    label : {
                                        enabled : true,
                                        text : '',
                                        font : {
                                            fontSize : adaptFontSize(_fontSize, 1.5),
                                            fill : 'red',
                                            fillOpacity : 1,
                                            textAnchor : 'middle', // start/middle/end
                                        },
                                        fill : 'pink',
                                        fillOpacity : 0
                                    },
                                    line : {
                                        enabled : true,
                                        stroke : 'red',
                                        strokeWidth : 1,
                                        strokeOpacity : 1
                                    }
                                }, {
                                    value : 50,
                                    markerPosition : 'above', // below or above
                                    marker : {
                                        enabled : true,
                                        type : 'triangle-down',
                                        size : Math.max(parseInt(_fontSize) / 2, 20),
                                        fill : 'yellow',
                                        border : {
                                            stroke : 'black',
                                            strokeWidth : 1
                                        },
                                    },
                                    labelPosition : 'below',
                                    label : {
                                        enabled : true,
                                        text : '',
                                        font : {
                                            fontSize : adaptFontSize(_fontSize, 1.5),
                                            fill : 'yellow',
                                            fillOpacity : 1,
                                            textAnchor : 'middle', // start/middle/end
                                        },
                                        fill : 'pink',
                                        fillOpacity : 0
                                    },
                                    line : {
                                        enabled : true,
                                        stroke : 'yellow',
                                        strokeWidth : 1,
                                        strokeOpacity : 1
                                    }
                                }
                            ]

                        }
                    ]
                },
                yAxis : [{
                        enabled : true,
                        orient : 'top',
                        xOffset : 0, // The x offset relative to origin x of axis container, default is 0
                        yOffset : 0, // The y offset relative to origin y of axis container, default is 0
                        fill : 'pink', // Default is undefined.
                        fillOpacity : 0.5,
                        title : { // Inherit from label options and add following additional options.
                            position : '', // left/middle/right/top/bottom

                        },
                        label : {
                            enabled : true,
                            fill : 'black',
                            fillOpacity : 1,
                            font : {
                                fontSize : adaptFontSize(_fontSize, 2),
                            },
                            //        anchor: 'middle', // start/middle/end
                            //rotation : 45,
                            rotationAnchor : 'middle',
                            position : 'same', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
                            format : null
                        },
                        axisLine : {
                            enabled : true,
                            stroke : 'red',
                            strokeOpacity : 1,
                            strokeWidth : 1 // stroke-width
                        },
                        tick : {
                            enabled : true,
                            padding : 3,
                            scale : {
                                //          stepNumber:0,
                                //          stepInterval:0,
                                //          min:,
                                //          max:,
                                //          autoExpand:false,// TRUE indicate to ignore min/max when actual
                                // value exceeds min/max
                            },
                            outerTickSize : 6,
                            showStartTickLabel : true,
                            showEndTickLabel : true,
                            major : {
                                enabled : true,
                                stroke : 'white',
                                strokeOpacity : 1,
                                strokeWidth : 3,
                                style : 'below', // cross/above/below
                                size : 10,
                                lineStepNumber : 1
                            },
                            minor : {
                                enabled : true,
                                count : 3,
                                stroke : 'white',
                                strokeOpacity : 1,
                                strokeWidth : 2,
                                style : 'below', // cross/above/below
                                size : 6
                            }
                        }
                    }
                ]
            }
        };
    }

    function createOthers(g, bounds, _fontSize) {
        // create chart widget.
        // Add blood pressure title
        var
        x = bounds.x,
        y = bounds.y,
        width = bounds.width,
        gH = bounds.height / 2,
        bloodPressure = g.selectAll('bpTitleDiv').data([0]);
        bloodPressure.enter().append('div')
        .attr('class', 'bpTitleDiv')
        .text('Blood Pressure')
        .style('font-size', _fontSize)
        .style('float', 'left');

        // Add blood pressure gadget, use bullet gadget with two target to show the most higher pressure and the most low pressure.
        var
        bpOpts = getBloodPressureOptions(_fontSize),
        bpContext = new d3charts.ChartContext(),
        bpChart = new d3charts.Chart(context, bpOpts),
        bpUpdate = g.selectAll('bpGadgetDiv').data([0]);
        bpUpdate.enter().append('div')
        .attr('class', 'bpGadgetDiv')
        .style('float', 'left')
        .attr({
            'width' : bounds.width,
            'height' : gH
        });
		
		bpBulletChart = bpChart;
		
		
        // Add energy title
        // Use linear gadget with two pointers to show food consumed and consumed energy.
        var
        energy = g.selectAll('eTitleDiv').data([0]);
        energy.enter().append('div')
        .attr('class', 'eTitleDiv')
        .text('Energy In/Out')
        .style('font-size', _fontSize)
        .style('float', 'left');

        // Add energy gadget, use linear gadget with two pointers to show high pressure and low pressure.
        var
        eOpts = getEnergyOptions(_fontSize),
        eContext = new d3charts.ChartContext(),
        eChart = new d3charts.Chart(context, eOpts),
        eUpdate = g.selectAll('eGadgetDiv').data([0]);
        eUpdate.enter().append('div')
        .attr('class', 'eGadgetDiv')
        .style('float', 'left')
        .attr({
            'width' : bounds.width,
            'height' : gH
        });
		eLinearChart = eChart;
		
        bpChart.fRender(bpUpdate);
        eChart.fRender(eUpdate);
		
		bpBulletSeries = bpChart.fSeries('bullet')[0];
		eLinearSeries = eChart.fSeries('linear')[0];
    }

    function adaptFontSize(_fontSize, factor) {
        var size = parseInt(_fontSize) / (factor || 1);
        return size + 'px';
    }

    function drawRuntimeGadgets(g) {
        var
        containerSize = getContainerSize(g),
        rtElement = g.selectAll('#dayDiv').data([0]);
        rtStatusUpdate = (rtElement.enter().append('div').attr('class', 'dayDiv').attr({
                width : containerSize.width,
                height : containerSize.height
            }), rtElement),
        fontSize = Math.min(containerSize.width, containerSize.height) / 20 + 'px';
        createDial(rtStatusUpdate, {
            'x' : 0,
            'y' : 0,
            'width' : containerSize.width,
            'height' : containerSize.width
        }, fontSize);
        createOthers(rtStatusUpdate, {
            'x' : 0,
            'y' : containerSize.width,
            'width' : containerSize.width,
            'height' : containerSize.height - containerSize.width
        }, fontSize);
    }
    return _sc;
}

var DaySummary = function() {
    var d = new Date();
    function draw(g, bounds) {
        var opts = {
            title : 'Simple bar Chart A',
            font : {},
            subtitleFont : {},
            fill : function (y, context) {
                if (!arguments.length) {
                    return 'green';
                }
                return y > 50 ? 'red' : y > 30 ? 'yellow' : 'green';
            },
            fillOpacity : 1,
            border : {
                stroke : 'blue',
                strokeWidth : 1
            },
            categoryType : 'date',
            categoryLabelFont : {},
            seriesLabelFont : {},
            xDataFormat : d3.time.format('%H'),
            yDataFormat : function (y) {
                return d3.round(y, 0);
            }
        };
		
		// Generate random data
        var chartOpts = [],
			keys = ['Pulse', 'Body Temp.', 'Blood Sugar', 'Blood Oxygen', 'Blood Pressure', 'Energy In', 'Energy Out'];
        for (var i = 0; i < keys.length; i++) {
            var o = d3charts.api.clone(opts);
            o.title = keys[i];
            o.data = getData();
            chartOpts.push(o);
        }

        var simpleBarCharts = new d3charts.SimpleBarCharts();
        simpleBarCharts.bounds(bounds).data(chartOpts);
        simpleBarCharts(g);

        return draw;
    }

    function getData() {
        var v = [];
        for (var i = 0; i < 24; i++) {
            v.push({
                'x' : (d.setHours(i % 23), d.getTime()),
                'y' : Math.random() * 100,
            })
        }
        return v;
    }
	
    return draw;
}
