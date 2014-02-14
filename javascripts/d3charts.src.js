/**
 * 
 */
(function () {
    var NS_D3CHARTS = null;
    if (!arguments.length) {
        NS_D3CHARTS = window.d3charts = window.d3charts || {};
    } else {
        if (typeof arguments[0] === 'object') {
            NS_D3CHARTS = arguments[0]; 
        } else {
            var array = arguments[0].split('.'),
                namespace = window;
            for (var i = 0; i < array.length; i++) {
                if (!namespace[array[i]]) {
                    namespace[array[i]] = {};
                    namespace = namespace[array[i]];
                }
            }
            NS_D3CHARTS = window[array[0]];
        }
    } 
    
/**
 * 
 */
// Inject extended d3 funciton
d3.selection.prototype.bbox = function (refresh) {
    if (!refresh && this._bbox) {
        return this._bbox;
    }
    
    this._bbox = {x: 0, y: 0, width: 0, height: 0};
    for (var j = 0, m = this.length; j < m; j++) {
        for (var group = this[j], i = 0, n = group.length; i < n; i++) {
          var node = group[i];
          if (node && (node.nodeName === 'g' || node.nodeName === 'text')) {
              var bbox = node._bbox;
              if (!bbox || refresh) {
                  bbox = bbox || node.getBBox();
              }
              this._bbox.x = (bbox.x < this._bbox.x) ? bbox.x: this._bbox.x;
              this._bbox.y = (bbox.y < this._bbox.y) ? bbox.y : this._bbox.y;
              this._bbox.width = (bbox.x + bbox.width > this._bbox.x + this._bbox.width) ? bbox.width: this._bbox.width;
              this._bbox.height = (bbox.y + bbox.height > this._bbox.y + this._bbox.height) ? bbox.height: this._bbox.height;
          };
        }
    }
    return this._bbox;
};

d3.transition.prototype.bbox = d3.selection.prototype.bbox;
// JavaScript Document

var CHART_GLOBAL = {
    lazyRender: true,
    prefix: 'd3charts'
};

// The field is used to count internally.
var internalCount = 0;

/**
 * The ClassNS object defines class name space, the t property defines top level
 * class name, the s property defines sub level class name.
 */
var CN = {
    svg: 'svg',
    chart: 'chart',
    chartTitle: 'chartTitle',
    legend: 'legend',
    legendItem: 'legendItem',
    plot: 'plot',
    seriesPlot: 'seriesPlot',
    axis: 'axis',
    xAxis: 'xAxis',
    yAxis: 'yAxis',
    series: 'series',
    
    barSeries: 'barSeries',
    lineSeries: 'lineSeries',
    areaSeries: 'areaSeries',
    pieSeries: 'pieSeries',
    dialSeries: 'dialSeries',
    bubbleSeries: 'bubbleSeries',
    scatterSeries: 'scatterSeries',
    
    linearSeries: 'linearSeries',
    bulletSeries: 'bulletSeries',
    sparkLineSeries: 'sparkLineSeries',
    cylinderSeries: 'cylinderSeries',
    thermometerSeries: 'thermometerSeries',
        
    gadget: 'gadget',
    border: 'border',
    label: 'label',
    title: 'title',
    icon: 'icon',
    tooltip: 'tooltip',
    
    bands: 'bands',
    ranges: 'ranges',
    pointers: 'pointers',
    
    
    tick: 'tick',
    major: 'major',
    minor: 'minor',
    marker: 'marker',
    band: 'band',
    line: 'line',
    range: 'range',
    pointer: 'pointer',
    indicator: 'indicator',
    arcDial: 'arcDial',
    measure: 'measure',
    target: 'target',
    border: 'border',
    seriesPlot: 'seriesPlot',
    domain: 'domain',
    dialArc: 'dialArc',
    ledLabel : 'ledLabel',
    scaleTube : 'scaleTube',
    scaleBall : 'scaleBall'
};

var FN = function () {
    var fn = {};
    for (var i in CN) {
        fn[i] = '.' + CN[i];
    }
    return fn;
};
CN.FN = FN();

/**
 * The exception class.
 */
function Exception(_id, _content) {
    this.fInit.apply(this, arguments);
}

Exception.prototype = {
    _super: null,
    id: null,
    content: null,
    fInit: function (_id, _content) {
        this.id = _id;
        this.content = _content;
    }
};

Exception.ID_OPTION_UNDEFINED = 1001;

/**
 * The object defines default option values of label.
 */
var DefaultLabelOptions = {
    enabled: false, // default is true,
    text: '', // the content.
    xOffset: 0,
    yOffset: 0,
    anchor: 'start', // start/middle/end
    rotation: 0, // degree of rotation, positive is clockwise.
    rotatoinAnchor: 'start', // start/middle/end
    font: {
        fill: 'black', // text
        fillOpacity: 0
    //  fontName:'',
    //  fontSize:''
    },
    padding: { // Padding space between test and border.
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    border: {
        enabled: false, // default is false
        stroke: 'black', // color value, default is null.
        strokeOpacity: 1, // default is 1, not transparency.
        strokeWidth: 0, // Number, default is 0.
        dashStyle: 'solid',
        roundCorner: 0  // Number, default is 0.
    },
//    fill: 'white', // background color.
    fillOpacity: 0
// Number, default is 0 that means transparency.
// cssStyle:{} // CSS style properties to apply for this label text.
};


/**
 * The object defines default option values of series, the initial object
 * contains general series object, and different series implementation file
 * should add concrete series default options to this object, the property name
 * is series name.
 */
var DefaultSeriesOptions = {
        baseSeries: {
            type: '',
            name: '', // The name should be anything including string, object or function and so on.
            layoutData: { // enabled when plot layout is grid type.
                vertialSpan: 1,
                horizontalSpan: 1
            },
            data: [] // The data allows array and function.
        }
    };

/**
 * The default targets options, different series may have different default
 * value for targets, concrete series should register default setting into this
 * object. The property name is targets' container.
 */
var DefaultTargetsOptions = {
        'bulletSeries': {} // 
};

/**
 * Similar to DefaultTargetsOptios.
 */
var DefaultRangesOptions = {}; //

var DefaultBandsOptions = { 
    enabled: true,
    type: 'line', // line or range
//    x1: 0,
//    x2: 0,
    fill: 'black',
    fillOpacity: 1,
    border: {},
    labelPosition: 'below', // above, below
    label: {
        enabled: false,
        text:'',
        font:{
            fill: 'black',
            fillOpacity: 1,
            textAnchor: 'middle', // start/middle/end
        },
        fill: 'white',
        fillOpacity: 1e-6,
        border: {}, 
    },
    markerPosition: 'below', // above, below
    marker: { // Only enabled for line band.
        enabled: false,
        type: 'circle',
        size: 5,
        border: {},
        fill: 'white',
        fillOpacity: 1
    }
};

/**
 * The object defines default option values of axis.
 */
var DefaultAxisOptions = {
    enabled: true,
//    orient: 'bottom', // top, bottom, left, right, in, out
    reverse: false, // Indicate if axis is reverse direction
    xOffset: 0, // The x offset relative to origin x of axis container, default is 0 
    yOffset: 0, // The y offset relative to origin y of axis container, default is 0
    title: { // Inherit from label options and add following additional options. 
        position: '', // left/middle/right/top/bottom
        
    },
    label: {
        enabled: true,
        normalize: true, // Used for dial axis label, true means the label will be rotated rather than horizontal.
        fill: 'black',
        fillOpacity: 1,
        font: {
             
        },
//        anchor: 'middle', // start/middle/end
        rotation: 0,
        position: 'same', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
        format: null
    },
    axisLine: {
        enabled: true,
        stroke: 'black',
        strokeOpacity: 1,
        strokeWidth: 1 // stroke-width
    },
    tick: {
        enabled: true,
        padding: 3,
        scale: {
//          stepNumber:0,
//          stepInterval:0,
//          min:,
//          max:,
//          autoExpand:false,// TRUE indicate to ignore min/max when actual
            // value exceeds min/max
        },
        outerTickSize: 6,
        showStartTickLabel: true,
        showEndTickLabel: true,
        major: {
            enabled: true,
            stroke: 'black',
            strokeOpacity: 1,
            strokeWidth: 2,
            style: 'below',// cross/above/below
            size: 6,
            lineStepNumber: 1
        },
        minor: {
            enabled: false,
            count: 3,
            stroke: 'black',
            strokeOpacity: 1,
            strokeWidth: 1,
            style: 'below',// cross/above/below
            size: 4
        }
    }
//    bands : DefaultBandsOptions // Array in runtime options.
};

var DefaultXAxisOptions = d3c_merge(d3c_clone(DefaultAxisOptions), {
    
});

var DefaultYAxisOptions = d3c_merge(d3c_clone(DefaultAxisOptions), {
    
});

/**
 * The object defines default option values of chart.
 */
var DefaultChartOptions = {
    // width:,
    // height:,
    // fill:,
    fillOpacity: 0,
//  margin: {},
    border: {},
    
    colorPalette: [0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
                    0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf],
    title: {
        enabled: false, // default is true,
        // text: '', // the content.
        position: 'top', // top/right/bottom/left/floating.
        x: 0, // x coordinate relative to container, be valid when position is
        // floating.
        y: 0, // y coordinate relative to container, be valid when position is
        // floating.
        anchor: 'start', // start/middle/end
        vAlign: 'middle', // top/middle/bottom, floating position will ignore
        // this option.
        hAlign: 'middle', // left/middle/right, floating position will ignore
        // this option.
        rotation: 0, // degree of rotation, positive is clockwise.
        rotatoinAnchor: 'start', // start/middle/end
        // font: {
        // fontName:'',
        // fontSize:''
        // },
        margin: { // margin space between title and container.
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        padding: { // Padding space between test and border.
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        borderStyle: {
            enabled: false, // default is false
            stroke: 'black', // color value, default is null.
            strokeOpacity: 1, // default is 1, not transparency.
            strokeWidth: 0, // Number, default is 0.
            dashStyle: 'solid',
            roundCorner: 0
        // Number, default is 0.
        },
        // fill:'', // background color in border area.
        fillOpacity: 0,
//        background: '', // background color of title
        backgroundOapcity: 0
    // Number, default is 0 that means transparency.
    // cssStyle:{} // CSS style properties to apply for this label text.
    },
    legend: {
        enabled: false,
        position: '', // top/right/bottom/left/floating
        x: 0, // The x coordinate of legend if position is floating.
        y: 0,  // The y coordinate of legend if position is floating.
        borderStyle: {
            enabled: false, // default is false
            stroke: 'black', // color value, default is null.
            strokeOpacity: 1, // default is 1, not transparency.
            strokeWidth: 0, // Number, default is 0.
            roundCorner: 0  // Number, default is 0.
        },
        legendItem: {
            // arrangement: '', // vertical/horizontal, the default value
            // depends on legend position, vertical is default for left/right
            // legend position, horizontal is default for top/bottom legend
            // position.
            // icon: '', // No default value, the value depends on series type.
            label: {}, // default label options without x/y/padding/borderStyle
                        // options
            borderStyle: {
                enabled: false, // default is false
                stroke: 'black', // color value, default is null.
                strokeOpacity: 1, // default is 1, not transparency.
                strokeWidth: 0, // Number, default is 0.
                roundCorner: 0
            // Number, default is 0.
            },
            // fill:'', // background color in border area.
            fillOpacity: 0
        }
    },
    plot: {
        layout: {
            type: 'mixed', // It contains two types, mixed/grid, default is mixed.
            rows: 0, // row number for grid layout, the height of each row will get same size to fit total height of plot.
            columns: 0 // column number for grid layout, the width of each column will get same size to fit total width of plot.
        },
        // fill:'',
        fillOpacity: 0,
        border: {},
        series: DefaultSeriesOptions
    }
//    ,
    // category: {},
//    xAxis: DefaultXAxisOptions,
//    yAxis: DefaultYAxisOptions  // Array
};

/**
 * The object defines default options.
 */
var DefaultOptions = {
    // lang:{},
    chart: DefaultChartOptions
};

/**
 * Chart context class.
 */
function ChartContext(svgSelection) {
    this.fInit.apply(this, arguments);
}

ChartContext.prototype = {
    _super: null,
    eContainer: null,
    options: null,
    themeOpts: null,
    eChart: null,
    chartId: null,
    defs: null,
    fInit: function (svgSelection) {
        this.svgSelection = typeof svgSelection === 'string' ? d3.select(svgSelection) : svgSelection;
    },
    fOptions: function () {
        if (!arguments.length) {
            return this.options;
        } else {
            this.options = arguments[0];
        }
    },
    fTheme: function () {
        if (!arguments.length) {
            return this.themeOpts;
        } else {
            this.themeOpts = arguments[0];
        }
    },
    fContainer: function () {
        if (!arguments.length) {
            return this.eContainer;
        } else {
            this.eContainer = arguments[0];
        }
    },
    fChart: function () {
        if (!arguments.length) {
            return this.eChart;
        } else {
            this.eChart = arguments[0];
        }
    },
    fChartId: function () {
        if (!arguments.length) {
            return this.chartId;
        } else {
            this.chartId = arguments[0];
        }
    },
    fDefs: function () {
        if (!arguments.length) {
            return this.defs ? this.defs : (this.defs = this.svgSelection.append('defs'));
        } else {
            this.defs = arguments[0];
        }
    }
};

/**
 * This class defines two abstract callbacks for user to do custom process during rendering.
 */
var RendererCallback = d3c_extendClass(null, null, {
    _super: null,
    fBeforeRendering: function () {
        
    },
    fAfterRendering: function () {
        
    }
});
/**
 * Element class is base class of chart.
 */
var Element = d3c_extendClass(null, RendererCallback,  {
    _super: null,
    eContainer: null,
    chartContext: null,
    options: null,
    d3Sel: null,
    _CLASS_NAMES: 'element',
    classNames: null,
    isRendered: false,
    fInit: function (_container, _chartContext, _options) {
        this.eContainer = _container;
        this.chartContext = _chartContext;
        this.options = _options || {};
    },
    fApplyChange: function (callerFunction) {
        if (!CHART_GLOBAL.lazyRender) {
            this.fRedraw();
        }
        return this;
    },
    fRender: function () {
        this.fBeforeRendering.apply(this, arguments);
        this._fRender.apply(this, arguments);
        this.isRendered = true;
        this.fAfterRendering.apply(this, arguments);
        return this;
    },
    _fRender: function () {
        // Do nothing in abstract method.
        return this;
    },
    fRedraw: function () {
        // Only render element after destory successfully. Before first
        // rendering, the element have not been rendered, so it is forbidden to
        // redraw.
        if (this.fDestory()) {
            this.fRender(this.d3Sel);
        }
        
        return this;
    },
    fOptions: function () {
        if (!arguments.length) {
            return this.options;
        } else {
            this.options = arguments[0];
            return this.fApplyChange(this.fOptions);
        }
    },
    fX: function () {
        if (!arguments.length) {
            return this.options && this.options.x;
        } else if (this.options) {
            this.options.x = arguments[0];
            if (this.isRendered) {
                this.d3Sel.attr('x', this.options.x);
                return this;
            } else {
                return this.fApplyChange(this.fX);
            }
        }
    },
    fY: function () {
        if (!arguments.length) {
            return this.options && this.options.y;
        } else if (this.options) {
            this.options.y = arguments[0];
            if (this.isRendered) {
                this.d3Sel.attr('y', this.options.y);
                return this;
            } else {
                return this.fApplyChange(this.fY);
            }
        }
    },
    fWidth: function () {
        if (!arguments.length) {
            return this.options && this.options.width;
        } else if (this.options) {
            this.options.width = arguments[0];
            return this.fApplyChange(this.fWidth);
        }
    },
    fHeight: function () {
        if (!arguments.length) {
            return this.options && this.options.height;
        } else if (this.options) {
            this.options.height = arguments[0];
            return this.fApplyChange(this.fHeight);
        }
    },
    fClassNames: function () {
        if (!arguments.length) {
            return this.classNames || this._CLASS_NAMES;
        } else {
            this.classNames = arguments[0];
            if (this.isRendered) {
                this.d3Sel.attr('class', this.classNames);
            } else {
                return this.fApplyChange(this.fClassNames);
            }
        }
    },
    fAttr: function () {
        var type = null;
        if (this.d3Sel) {
            if (arguments.length === 1) {
                type = typeof arguments[0];
                if (type === 'string') {
                    return this.d3Sel.attr(arguments[0]);
                } else if (type === 'object') {
                    this.d3Sel.attr.apply(this, arguments);
                }
            } else if (arguments.length) {
                this.d3Sel.attr.apply(this, arguments);
            }
        }
    },
    fGetBBox: function () {
        return this.d3Sel ? d3c_copy(this.d3Sel.bbox()): {};
    },
    fDestory: function () {
        if (this.d3Sel) {
            this.d3Sel.selectAll('*').remove();
            //delete this;
            this.isRendered = false;
            return true;
        } else {
            return false;
        }
    }
});


/**
 * Check if specified value is number.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isNumber(v) {
    return typeof v === 'number';
}

/**
 * Check if specified value is string.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isString(v) {
    return typeof v === 'stirng';
}

/**
 * Check if specified value is function.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isFunction(v) {
    return typeof v === 'funciton';
}

/**
 * Check if specified value is object.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isObject(v) {
    return typeof v === 'object';
}

/**
 * Convert degree to radian.
 * 
 * @param deg
 * @returns {Number}
 */
function d3c_radian(deg) {
    return deg * Math.PI / 180;
}

/**
 * Visit each element of specified object and process with specified function.
 * 
 * @param obj
 * @param functor
 * @returns
 */
function d3c_each(obj, functor) {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            obj[k] = functor.call(obj, obj[k]);
        }
    }
    return obj;
}

/**
 * Clone an object and its properties.
 * 
 * @param obj
 *            the object will be cloned.
 * @returns an new instance of specified object.
 */
function d3c_clone(obj) {
    if (obj === null || (typeof obj) !== 'object') {
        return obj;
    }
    var temp = new obj.constructor();
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = d3c_clone(obj[key]);
        }
    }
    return temp;
}

/**
 * Simple copy object.
 * 
 * @param obj
 * @returns
 */
function d3c_copy(obj) {
    if (obj === null || (typeof obj) !== 'object') {
        return obj;
    }
    var temp = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = d3c_copy(obj[key]);
        }
    }
    return temp;
}

/**
 * Return bounding box of specified svg node.
 * 
 * @param node
 * @param refresh
 * @returns
 */
function d3c_bbox(node, refresh) {
    if (!refresh && node._bbox) {
        return node._bbox;
    }
    
    var b = (node.nodeName === 'g' || node.nodeName === 'text') ? node.getBBox() : {'x': 0, 'y': 0, 'width': 0, 'height': 0};
    node._bbox = {'x': b.x, 'y': b.y, 'width': b.width, 'height': b.height};
    return node._bbox;
}


/**
 * Merge properties of source object into target object and override.
 * 
 * @param a
 *            the target object.
 * @param b
 *            the source object.
 * @returns target object
 */
function d3c_merge(a, b) {
    if (!b) {
        return a;
    }
    if (!a) {
        return d3c_clone(b);
    }
    
    for (var prop in b) {
        if (b.hasOwnProperty(prop)) {
            if (b[prop] === null || (typeof b[prop]) !== 'object') {
                a[prop] = b[prop];
            } else {
                a[prop] = d3c_merge(a[prop], b[prop]);
            }
        }
    }
    
    return a;
}

/**
 * Merge property of source object into target object.
 * 
 * @param a
 * @param b
 * @returns {___anonymous2300_2301}
 */
function d3c_extend(a, b) {
    var k = null;
    if (!a) {
        a = {};
    }
    for (k in b) {
        if (b.hasOwnProperty(k)) {
            a[k] = b[k];
        }
    }
    return a;
}

/**
 * Define and extend class.
 * 
 * @param _Class
 * @param _pClass
 * @param _protoObj
 * @returns
 */
function d3c_extendClass(selfFunction, pClass, protoObj) {
    function constructor(container, chartContext, options) {
        // Initialize private variable set.
        this._p = {};
        
        // Init this object.
        if (this.fInit) {
            this.fInit.apply(this, arguments);
        }
        return this;
    }
    
    var newClass = selfFunction ? selfFunction : constructor;
    newClass.prototype = pClass ? new pClass() : {};
    d3c_extend(newClass.prototype, protoObj);
    newClass.prototype._super = pClass ? pClass.prototype : null;
    return newClass;
}

/**
 * Rotate a svg node.
 * <p>
 * The _mode values include start, end, middle. Middle means the x and y
 * coordinates of rotation point is at center of text. Start means the x
 * coordinate of rotation point is at start of text, y coordinate is center of
 * text. End is similar to Start.
 * 
 * @param svgNode
 * @param degree
 * @param mode
 */
function d3c_rotateNode(svgNode, degree, mode) {
    var box, cx, cy, tran, tranA, cxy;

    if (degree) {
        box = svgNode.getBBox();
        if (mode === 'auto') {
            cxy = '';
        } else {
            cx = (mode === 'start') ? box.x : (mode === 'end') ? box.x +
                    box.width : (box.x + box.width / 2);
            cy = box.y + box.height / 2;  
            cxy = ' ' + cx + ' ' + cy;
        }
        tran = svgNode.getAttribute('transform');
        if (tran) {
            tranA = tran.split(/\)/g);
            if (tranA.length) {
                tran = '';
                for (var i in tranA) {
                    if (tranA.hasOwnProperty(i)) {
                        tran += ' ' + (tranA[i].indexOf('rotate') >= 0) ? 'rotate(' +
                                degree + cxy + ')'
                                : tranA[i].trim() + ')';
                    }
                }
            }
        } else {
            tran = 'rotate(' + degree + cxy + ')';
        }
        svgNode.setAttribute('transform', tran);
    }
    return svgNode;
}

/**
 * Rotate elements of selection.
 * 
 * @param selection
 * @param degree
 * @param mode start/middle/end/auto
 */
function d3c_rotate(selection, degree, mode) {
    return selection.attr('transform', function (_d) {
        var box, cx, cy, tran = null, tranA, cxy;

        if (degree) {
            box = this.getBBox();
            if (mode === 'auto') {
                cxy = '';
            } else {
                cx = (mode === 'start') ? box.x : (mode === 'end') ? box.x +
                        box.width : (box.x + box.width / 2);
                cy = box.y + box.height / 2;  
                cxy = ' ' + cx + ',' + cy;
            }
            
            tran = this.getAttribute('transform');
            if (tran) {
                tranA = tran.split(/\)/g);
                if (tranA.length) {
                    tran = '';
                    for (var i in tranA) {
                        if (tranA.hasOwnProperty(i)) {
                            tran += ' ' + (tranA[i].indexOf('rotate') >= 0) ? 'rotate(' +
                                    degree + cxy + ')'
                                    : tranA[i].trim() + ')';
                        }
                    }
                }
            } else {
                tran = 'rotate(' + degree + cxy + ')';
            }
        }
        return tran;
    });
}

/**
 * Translate elements of selection.
 * 
 * @param selection
 * @param x
 * @param y
 */
function d3c_translate(selection, x, y) {
    if (arguments.length === 1) {
        // Return x and y of current translate.
        var transXY = [];
        selection.each(function(){
            var tran = this.getAttribute('transform');
            if (tran && tran.indexOf('translate') >= 0) {
                tran = tran.match(/translate\([0-9\s\.\-,]+\)/);
                if (tran && tran.length) {
                    tran = tran[0].match(/([0-9\.\-]+)/g);
                    if (tran && tran.length && tran.length > 1) {
                        transXY.push({'x':tran[0], 'y': tran[1]});
                    }
                }
            }
        });
        return transXY;
    }
    
    function f (x, d) {
        return typeof x === 'function' ? x(d) : x; 
    }
    return selection.attr('transform', function (d) {
        var tran = this.getAttribute('transform');
        if (tran && tran.indexOf('translate') >= 0) {
            tranA = tran.split(/\)/g);
            if (tranA.length) {
                tran = '';
                for (var i in tranA) {
                    if (tranA.hasOwnProperty(i) && tranA[i].trim() !== '') {
                        tran += ' ' + (tranA[i].indexOf('translate') >= 0) ? 'translate(' +
                                f(x, d) + ',' + f(y, d) + ')'
                                : tranA[i].trim() + ')';
                    }
                }
            }
        } else {
            tran = 'translate(' + f(x, d) + ',' + f(y, d) + ') ' + (tran || '');
        }
        return tran;
    });
}

/**
 * Convert d3chart styles to CSS styles.
 * 
 * @param d3c_style style object or style name.
 * @returns
 */
function d3c_toCssStyle(d3c_style) {
    if (typeof d3c_style === 'object') {
        for (var key in d3c_style) {
            if (d3c_style.hasOwnProperty(key)) {
                var newKey = d3c_toCssStyle(key);
                if (newKey !== key) {
                    d3c_style[newKey] = d3c_style[key];
                    d3c_style[key] = null;
                    delete d3c_style[key];
                }
            }
        }
        return d3c_style;
    } else {
        return d3c_style ? d3c_style.replace(/([A-Z])/g, function (m, s) {
            return '-' + s.toLowerCase();
        }) : d3c_style;
    }
}

/**
 * Return an unique id.
 * 
 * @returns {String}
 */
function d3c_uniqueId(_param) {
    return CHART_GLOBAL.prefix + '-' + (_param ? (_param + '-') : '') + (internalCount++) + '-' + Math.random().toString(2).slice(2);
}

var LINEAR_GRADIENT_SHORT_NAME_PARTS = {
        'L' : ['0%', '50%'],
        'R' : ['100%', '50%'],
        'T' : ['50%', '0%'],
        'B' : ['50%', '100%'],
        'LT' : ['0%', '0%'],
        'TL' : ['0%', '0%'],
        'LB' : ['0%', '100%'],
        'BL' : ['0%', '100%'],
        'RT' : ['100%', '0%'],
        'TR' : ['100%', '0%'],
        'RB' : ['100%', '100%'],
        'BR' : ['100%', '100%']
    };

/**
 * Convert gradient color options to svg gradient color paramters.
 * 
 * @param gradientOpts
 * @returns
 */
function d3c_adaptColorGradient(gradientOpts) {
    var params = gradientOpts.parameters,
        parts = null;
    if (gradientOpts.type === 'linearGradient') {
        params = params || ['0%',  '0%', '100%', '100%'];
        if (typeof params === 'string') {
            /**
             * It uses short name. The short name include L,T,R,B and mean Left
             * side, Top side, Right side and Bottom Side.
             * <p>
             * The form should be like 'L,R' or 'T,B' or 'LT,RB' and so on
             * separated with comma, the first part means start and the second
             * part means end. The short name will be convert to percent value form.
             */
            parts = params.split(',');
            params = [];
            params[0] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[0]][0];
            params[1] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[0]][1];
            params[2] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[1]][0];
            params[3] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[1]][1];
        }
        return {x1 : params[0], y1 : params[1], x2 : params[2], y2 : params[3]};
    } else if (gradientOpts.type === 'radialGradient') {
        return {cx : params[0], cy : params[1], r : params[2], fx : params[3], fy : params[4]};
    }
}

/**
 * Convert d3charts color option to HTML/CSS style.
 * 
 * @param fillValue
 * @param chartContext
 * @returns fill value object
 */
function d3c_adaptFill(fillValue, chartContext) {
    var bbox = null,
    img = null,
    id = null,
    lg = null,
    i = 0;
    if (typeof fillValue === 'function') {
        return (function (_this) {
            var args = chartContext ? d3.merge(arguments, [chartContext])
                : arguments;
            return {
                'value' : fillValue.apply(_this, args)
            };
        })(this);
    } else if (typeof fillValue === 'object') {
        if (fillValue.type === 'image') {
            bbox = this.getBBox();
            img = this.d3Sel.append('image').datum(fillValue);
            img.attr({'x': 0, 'y': 0, 'width': bbox.width, 'height': bbox.height,
            'xlink:href': fillValue.parameters && fillValue.parameters[0]});
            return {
                value : (fillValue.indexOf('url') >= 0) ? fillValue : ('#url(' + fillValue + ')'),
                imageNode : img
            };
        } else if (fillValue.type === 'linearGradient' || fillValue.type === 'radialGradient') {
            var defs = chartContext.fDefs();
            id = d3c_uniqueId(fillValue.type);
            lg = defs.append(fillValue.type).attr('id', id).attr(d3c_adaptColorGradient(fillValue));
            for (i = 0; i < fillValue.stops.length; i++) {
                lg.append('stop')
                .attr(d3c_toCssStyle({offset: fillValue.stops[i].offset || '0%', stopColor: (fillValue.stops[i].stopColor || (this.options && this.options.fill) || 'white'), stopOpacity: fillValue.stops[i].stopOpacity || 1}));
            }
            return {
                value : 'url(#' + id + ')',
                gradientNode : lg
            };
        }
    } else {
        return {
            value : fillValue
        };
    }
}

/**
 * Convert d3charts dash-style option to HTML/CSS style.
 * 
 * @param name
 * @param value
 * @param width
 *            dash width
 * @param chartContext
 * @returns
 */
function d3c_adaptDashstyle(name, v, width, chartContext) {
    var i, value = v;
    if (typeof value === 'function') {
        return (function (_this) {
            var args = chartContext ? d3.merge(arguments, [chartContext])
                    : arguments;
            return {
                'name' : name,
                'value' : value.apply(_this, args)
            };
        })(this);
    } else {
        value = value && value.toLowerCase();
        if (value === 'solid') {
            value = 'none';
        } else if (value) {
            value = value.replace(/(shortdashdotdot)/g, '3,1,1,1,1,1,').replace(
                    /(shortdashdot)/g, '3,1,1,1').replace(/(shortdot)/g, '1,1,')
                    .replace(/(shortdash)/g, '3,1,').replace(/(longdash)/g, '8,3,')
                    .replace(/(dot)/g, '1,3,').replace(/(dash)/g, '4,3,').replace(
                            /,$/, '').split(','); // ending comma

            i = value.length;
            while (i--) {
                value[i] = parseInt(value[i]) * width;
            }
            value = value.join(',');
        }

        return {
            'name' : name,
            'value' : value
        };
    }
}

/**
* Return combined border width.
* 
* @param borderStyle
* @returns {Number}
*/
function d3c_getBorderWidth(borderStyle) {
    return borderStyle.strokeWidth || borderStyle.style['stroke-width'] || borderStyle.width || 0;
}

/**
 * Convert properties of border style object to fit attribute name standard of HTML/SVG/CSS.
 * 
 * @param _borderStyle
 * @param _chartContext
 * @returns {Object}
 */
function d3c_adaptBorderStyle(borderStyle, chartContext) {
    if (typeof borderStyle === 'object') {
        // Adjust property value
        for (var k in borderStyle) {
            if (borderStyle.hasOwnProperty(k)) {
                if (k === 'roundCorner') {
                    borderStyle.rx = borderStyle.rx || borderStyle.roundCorner;
                    borderStyle.ry = borderStyle.ry || borderStyle.roundCorner;
                } else if (k === 'dashStyle') {
                    borderStyle[k] = d3c_adaptDashstyle.call(this, k, borderStyle[k], d3c_getBorderWidth(borderStyle), chartContext).value;
                } else if (k === 'stroke' || k === 'fill') {
                    borderStyle[k] = d3c_adaptFill.call(this, borderStyle[k], chartContext).value;
                } 
            }
        }
        
        // Adjust property name
        borderStyle = d3c_toCssStyle(borderStyle);
    }
    
    return borderStyle;
}

/**
 * Apply border style to a selection.
 * 
 * @param selection
 * @param borderOpts
 * @param fillOpts
 * @param chartContext
 * @param functor
 * @returns
 */
function d3c_applyBorderStyle(selection, borderOpts, fillOpts, chartContext, functor) {
    if (fillOpts.fill || fillOpts.fillOpacity || fillOpts.fillOpacity === 0) {
        borderOpts = borderOpts || {};
        if (borderOpts.enabled === false) {
            delete borderOpts.stroke;
            delete borderOpts.strokeWidth;
            delete borderOpts.strokeOpacity;
        }
        
        borderOpts.enabled = true;
        if (fillOpts.fill) {
            borderOpts.fill = fillOpts.fill;
        }
        borderOpts.fillOpacity = (fillOpts.fillOpacity === 0) ? fillOpts.fillOpacity : (fillOpts.fillOpacity || 1);
        if (borderOpts.stroke) {
            borderOpts.StrokeOpacity = (borderOpts.StrokeOpacity === 0) ? borderOpts.StrokeOpacity : (borderOpts.StrokeOpacity || 1);    
        }
    }
    
    if (functor) {
        borderOpts = functor.apply(selection, [borderOpts, chartContext]);
    }
    
    if (borderOpts && borderOpts.enabled) {
        var
        _fill = selection.style('fill'),
        _t;
        if (_fill && (_t = /url\(#[0-9a-zA-Z\-]+/i.exec(_fill))) {
            // Remove old fill definition.
            chartContext.fDefs().select(_t[0].substring(4)).remove();
        }
        _fill = selection.style('stroke');
        _t = undefined;
        if (_fill && (_t = /url\(#[0-9a-zA-Z\-]+/i.exec(_fill))) {
            // Remove old stroke definition.
            chartContext.fDefs().select(_t[0].substring(4)).remove();
        }
        
        selection.style(d3c_adaptBorderStyle.call(selection, borderOpts, chartContext));
    }
    
    return selection;
}

/**
 * Convert properties of border style object to fit attribute name standard of HTML/SVG/CSS.
 * 
 * @param fontStyleOpts
 * @param chartContext
 * @returns
 */
function d3c_adaptFontStyle(fontStyleOpts, chartContext) {
    if (typeof fontStyleOpts === 'object') {
        
        // Adjust property value.
        for (var k in fontStyleOpts) {
            if (fontStyleOpts.hasOwnProperty(k)) {
                if (k === 'stroke' || k === 'fill') {
                    fontStyleOpts[k] = d3c_adaptFill.call(this, fontStyleOpts[k], chartContext).value;
                    fontStyleOpts[k + 'Opacity'] = (fontStyleOpts[k + 'Opacity'] === undefined) ? 1 : fontStyleOpts[k + 'Opacity']; 
                } 
            }
        }
        
        // Adjust property name.

        fontStyleOpts = d3c_toCssStyle.call(this, fontStyleOpts);
    }
    
    return fontStyleOpts;
}

/**
 * Apply font style to selection.
 * @param selection
 * @param fontStyleOpts
 * @param chartContext
 * @param functor
 * @returns
 */
function d3c_applyFontStyle(selection, fontStyleOpts, chartContext, functor) {
    fontStyleOpts = functor ? functor.apply(selection, [fontStyleOpts, chartContext]) : fontStyleOpts;
    selection.style(d3c_adaptFontStyle.call(selection, fontStyleOpts, chartContext));
    return selection;
}

/**
 * Convert margin option to standard format, the returned margin option contains
 * top&right&bottom&left.
 * 
 * @param margin
 * @returns
 */
function d3c_adaptMargin(margin) {
    if (typeof margin === 'string') {
        var values = margin.split(/ /g);
        switch (values.length) {
        case 1:
            return {
                top : values[0],
                right : values[0],
                bottom : values[0],
                left : values[0]
            };
        case 2:
            return {
                top : values[0],
                right : values[1],
                bottom : values[0],
                left : values[1]
            };
        case 3:
            return {
                top : values[0],
                right : values[1],
                bottom : values[2],
                left : values[1]
            };
        case 4:
            return {
                top : values[0],
                right : values[1],
                bottom : values[2],
                left : values[3]
            };
        }
        return {
            top : 0,
            right : 0,
            bottom : 0,
            left : 0
        };
    } else {
        var m = d3c_merge({
            top : 0,
            right : 0,
            bottom : 0,
            left : 0
        }, margin);
        return m;
    }
}

/**
 * Plus values of same option between specified two objects and save to first
 * object, if first object doesn't contain any option, just add the option to
 * first object with current value.
 * 
 * @param objectA
 * @param objectB
 * @returns
 */
function d3c_plusOfObject(objectA, objectB) {
    if (!objectB) {
        return objectA;
    }
    for (var p in objectB) {
        if (objectB.hasOwnProperty(p)) {
            if (objectA[p]) {
                objectA[p] += objectB[p];
            } else {
                objectA[p] = objectB[p];
            }
        }
    }
    return objectA;
}

/**
 * Add margin's settings to a bbox object.
 * 
 * @param bbox
 * @param margin
 * @returns
 */
function d3c_plusOfMargin2BBox(bbox, margin) {
    var m = d3c_adaptMargin(margin),
        b = d3c_copy(bbox);
    b.y += m.top;
    b.x += m.left;
    b.width += m.left + m.right;
    b.height += m.top + m.bottom;
    return b;
}

/**
 * Get/set series values
 * 
* @param data data array object.
* @param prop  index or property name of value in data array.
* @param valArray values array.
*/
function _values(data, prop, valArray) {
    var type = typeof data[0],
        nameType = typeof prop,
        hasValues = (valArray !== undefined),
        result = [],
        i = 0;
    if (!prop) {
        return data;
    }
    if (type === 'number' || type === 'string' || type === 'boolean') {
        // data is single dimension array with primtive value.
        if (hasValues) {
            if (nameType === 'number' && data.length >= prop) {
                data[prop] = valArray.length && valArray[0];
            } 
        } else {
            if (nameType === 'number') {
                result = (data.length >= prop && [data[prop]]) || [];
            }
        }
    } else if (type === 'array') {
        for (i = 0; i < data.length; i++) {
            if (hasValues) {
                _values(data[i], prop, valArray[i]);
            } else {
                result = result.concat([_values(data[i], prop)] || []);
            }
        }
    } else if (type === 'object') {
        for (i = 0; i < data.length; i++) {
            if (hasValues) {
                data[i][prop] = valArray[i];
            } else {
                result = result.concat([data[i][prop]]|| []);
            }
        }
    }
    return result;
}

/**
 * Get/set series values
 * 
 * @param data data array object.
 * @param prop  index or property name of value in data array.
 * @param valArray values array.
 */
function d3c_seriesValues(data, prop, valArray) {
    if (!data.length) {
        return [];
    }

    return _values(data, prop, valArray);
}

/**
 * Return min and max of specified property in data set.
 * 
 * @param data
 * @param name
 */
function d3c_getValuesMinMax(data, prop) {
    var arr = d3c_seriesValues(data, prop);
    return arr ? d3.extent(arr) : false;
}

/**
 * Convert percent number to pure number.
 * 
 * @param numberProperty
 * @param refValue
 * @returns
 */
function d3c_adaptNumberOpt(numberProperty, refValue) {
    var r = numberProperty || 0, s = refValue || 1; 
    return (typeof r === 'number') ? (r >= 1 ? r : Math.abs(s * r)) : (r.indexOf('%') ? (parseInt(r, 0) * s / 100) : r);
}

/**
 * Returns CSS class filter names with '.'
 * 
 * @param className
 * @returns {String}
 */
function d3c_classFilterNames(className) {
    return '.' + className.replace(/\s/g, '.');
}

/**
 * Save map of series type to creator function.
 */
var SERIES_CREATOR_SET = {};


/**
 * Register series creator.
 * 
 * @param seriesType
 * @param creatorCallback
 */
function d3c_registerSeriesCreator(seriesType, creatorCallback) {
    SERIES_CREATOR_SET[seriesType] = creatorCallback;
}

/**
 * Create series instance according to series type.
 * 
 * @param eContainer
 * @param chartContext
 * @param serieOpts
 * @returns
 */
function d3c_createSeries(eContainer, chartContext, serieOpts) {
    return SERIES_CREATOR_SET[serieOpts.type] && SERIES_CREATOR_SET[serieOpts.type].call(this, eContainer, chartContext, serieOpts);
}

/**
 * Merge chart options.
 * 
 * @param a
 * @param b
 * @returns
 */
function d3c_mergeChartOptions(a, b, ps) {
    var prop = null, i, t;
    if (!b) {
        return a;
    }
    if (!a) {
        return d3c_clone(b);
    }
    
    ps = ps || [];
    for (prop in b) {
        if (b.hasOwnProperty(prop)) {
            ps.push(prop);
            if (b[prop] === null || (typeof b[prop]) !== 'object') {
                a[prop] = b[prop];
            } else if (prop === 'series') {
                if (!(a[prop] instanceof Array) && b[prop] instanceof Array) {
                    t = a[prop];
                    a[prop] = [];
                    i = b[prop].length;
                    while (i--) {
                        if (t[b[prop][i].type + 'Series']) {
                            a[prop][i] = d3c_mergeChartOptions(d3c_clone(t[b[prop][i].type + 'Series']), b[prop][i], ps);
                        } else {
                            a[prop][i] = d3c_clone(b[prop][i]);
                        }
                    }
                } else if(a[prop] instanceof Array && !(b[prop] instanceof Array)) {
                    i = a[prop].length;
                    while (i--) {
                        t = a[prop];
                        if (b[prop][t.type + 'Series']) {
                            a[prop][i] = d3c_mergeChartOptions(a[prop][i], b[prop][t.type + 'Series'], ps);
                        }
                    }
                }
                
            } else if (prop === 'xAxis' && !a[prop]) {
                a[prop] = d3c_clone(DefaultXAxisOptions);
                a[prop] = d3c_mergeChartOptions(a[prop], b[prop], ps);
            } else if (prop === 'yAxis' || prop === 'bands' || prop === 'ranges' || prop === 'data' || prop === 'targets') {
                if (!a[prop]) {
                    if (prop === 'yAxis') {
                        a[prop] = d3c_clone(DefaultYAxisOptions);
                    } else if (prop === 'bands') {
                        // TODO ...  
                        a[prop] = d3c_clone(DefaultBandsOptions[ps[ps.length - 1]] || {});
                    } else if (prop === 'ranges') {
                        a[prop] = d3c_clone(DefaultRangesOptions[ps[ps.length - 1]] || {});
                    } else if (prop === 'targets') {
                        if (ps.length >= 2 && ps[ps.length - 2] === 'series') {
                            a[prop] = d3c_clone(DefaultTargetsOptions[a.type + 'Series'] || {});
                        }
                    }
                }
                if (!a[prop]) {
                    a[prop] = d3c_clone(b[prop]);
                } else if (!(a[prop] instanceof Array) && b[prop] instanceof Array) {
                    t = a[prop];
                    a[prop] = [];
                    i = b[prop].length;
                    while (i--) {
                        a[prop][i] = d3c_clone(t);
                    }
                    d3c_mergeChartOptions(a[prop], b[prop], ps);
                } else {
                    a[prop] = d3c_mergeChartOptions(a[prop], b[prop], ps);
                }
            } else {
                a[prop] = d3c_mergeChartOptions(a[prop], b[prop], ps);
            }
            
            ps.pop();
        }
    }
    
    return a;
}

/**
 * Create a d3c path object, call push function to add paths, and call toString function return entire path string.
 * 
 * @returns
 */
function d3c_path() {
    var paths = [], i = 0;
    
    function path() {
        return path.toString();
    }
    
    path.push = function (_type, coordinates) {
        paths.push(_type);
        i = 1;
        while (i < arguments.length) {
            paths.push(arguments[i]);
            i++;
        }
        return path;
    };
    
    path.toString = function () {
        return paths.join(' ');
    };
    
    return path;
}

/**
 * Create a d3c symbol object
 * 
 * @returns
 */
function d3c_symbol() {
    var s = d3.svg.symbol();
    
    function symbol() {
        return s();
    }
    
    symbol.type = function () {
        if (!arguments.length) {
            return s.type();
        } else {
            s.type(arguments[0]);
        }
        return symbol;
    };
    
    symbol.size = function () {
        if (!arguments.length) {
            return s.size();
        } else {
            s.size(arguments[0]);
        }
        return symbol; 
    };
    
    return symbol;
}

/**
 * Calculate proper scale domain according to specified values.
 * 
 * @param axisOpts
 * @param rangesOpts
 * @param values
 * @returns
 */
function d3c_calculateScaleDomain(axisOpts, rangesOpts, values) {
    function getScale(_v) {
        var t = Math.abs(_v), i = -1;
        if (t === 1) {
            return 0;
        } else if (t > 1) {
            while (t > 1) {
                t = t / 10;
                i++;
            }
            return Math.pow(10, i);
        } else if (t < 1) {
            while (t < 1) {
                t = t * 10;
                i++;
            }
            return Math.pow(10, -i);
        }
    }
    
    var extent = d3.extent(values), scale = getScale(extent[0]), i = 0;
    if (axisOpts.tick.scale && axisOpts.tick.scale.min !== undefined) {
        extent[0] = axisOpts.tick.scale.min;
    } else {
        extent[0] = scale === 0 ? 0 : (scale > 1 ? (extent[0] - extent[0] % scale) - scale : Math.floor((extent[0] - scale) / scale) * scale);
    }
    if (axisOpts.tick.scale && axisOpts.tick.scale.max !== undefined) {
        extent[1] = axisOpts.tick.scale.max;
    } else {
        extent[1] = scale === 0 ? 0 : (scale > 1 ? (extent[1] - extent[0] % scale) + scale : Math.floor((extent[0] + scale) / scale) * scale);
    }
    
    if (axisOpts.bands) {
        for (i in axisOpts.bands) {
            extent[0] = axisOpts.bands[i].x1 < extent[0] ? axisOpts.bands[i].x1 : extent[0];
            extent[1] = axisOpts.bands[i].x2 > extent[1] ? axisOpts.bands[i].x2 : extent[1];
        }
    }
    
    if (rangesOpts) {
        for (i in rangesOpts) {
            extent[0] = rangesOpts[i].x1 < extent[0] ? rangesOpts[i].x1 : extent[0];
            extent[1] = rangesOpts[i].x2 > extent[1] ? rangesOpts[i].x2 : extent[1];
        }
    }
    
    if (axisOpts.reverse === true) {
        i = extent[0];
        extent[0] = extent[1];
        extent[1] = i;
    }
    return extent;
    
}

//function d3c_convertBandsOpts(_bandsOpts, _scale, _domainExtent, _originBounds) {
//    return d3c_each(_bandsOpts, function (_d) {
//        _d.x1 = _scale((_d.x1 === undefined) ? _domainExtent[0] : _d.x1) - _originBounds.x;
//        _d.x2 = _scale((_d.x2 === undefined) ? _domainExtent[1] : _d.x2) - _originBounds.x;
//        _d.y1 = 0;
//        _d.y2 = _originBounds.height;
//        return _d;
//    });
//}
//
//function d3c_convertRangesOpts(_rangesOpts, _scale, _domainExtent, _originBounds) {
//    return d3c_each(_rangesOpts, function (_d) {
//        _d.x1 = _scale((_d.x1 === undefined) ? _domainExtent[0] : _d.x1) - _originBounds.x;
//        _d.x2 = _scale((_d.x2 === undefined) ? _domainExtent[1] : _d.x2) - _originBounds.x;
//        _d.y1 = d3c_radian(_d.y1, _originBounds.height);
//        _d.y2 = d3c_radian(_d.y2, _originBounds.height);
//        return _d;
//    });
//}

/**
 * Create marker group according to specified marke options.
 * 
 * @param parentUpdate
 * @param markerOpts
 * @param sizeRef
 * @param chartContext
 * @param borderFunctor
 * @returns
 */
function d3c_createMarker(parentUpdate, markerOpts, sizeRef, chartContext, borderFunctor) {
    var
    size = d3c_adaptNumberOpt(markerOpts.size, sizeRef),
    paths = d3c_symbol().type(markerOpts.type).size(size * size),
    markerUpdate = parentUpdate.selectAll(CN.FN.marker).data([markerOpts]);
    markerUpdate.enter().append('path').attr('class', CN.marker);
    markerUpdate.attr('d', paths());
    d3c_applyBorderStyle(markerUpdate, markerOpts.border, markerOpts, chartContext, borderFunctor);
    return markerUpdate;
}

/**
 * Create label group according to specified label options.
 * 
 * @param parentUpdate
 * @param labelOpts
 * @param text
 * @param chartContext
 * @returns
 */
function d3c_createLabel(parentUpdate, labelOpts, text, chartContext) {
    var
    labelUpdate = parentUpdate.selectAll(CN.FN.label).data([labelOpts]);
    labelUpdate = (labelUpdate.enter().append('g').attr('class', CN.label), labelUpdate),
    border = labelUpdate.selectAll(CN.FN.border).data([labelOpts]),
    border = (border.enter().append('rect').attr('class', CN.border), border),
    textUpdate = labelUpdate.selectAll('text').data([labelOpts.text]);
    textUpdate = (textUpdate.enter().append('text').text(text || labelOpts.text), textUpdate),
    bbox = null, textAnchor = labelOpts.font && (labelOpts.font.textAnchor || labelOpts.font['text-anchor']);
    
    d3c_applyBorderStyle(border, labelOpts.border, labelOpts, chartContext);
    d3c_applyFontStyle(textUpdate, labelOpts.font, chartContext).attr('dy', '.8em');
    
    bbox = d3c_bbox(labelUpdate.node());
    border.attr({'x': (textAnchor === 'middle' ? -(bbox.width / 2) : (textAnchor === 'end' ? -bbox.width : 0)), 'y': 0, 'width': bbox.width, 'height': bbox.height});
    
    return labelUpdate;
}

/**
 * Create range according to specified options.
 * 
 * @param rangeUpdate
 * @param opts
 * @param scale
 * @param originBounds
 * @param chartContext
 * @returns
 */
function d3c_createRange(rangeUpdate, opts, scale, originBounds, chartContext) {
    var
    domain = scale.domain(),
    range = scale.range(),
    x1 = opts.x1 ? opts.x1 : domain[0],
    x2 = opts.x2 ? opts.x2 : domain[1],
    y1 = opts.y1 ? d3c_adaptNumberOpt(opts.y1, originBounds.height) : 0,
    y2 = opts.y2 ? d3c_adaptNumberOpt(opts.y2, originBounds.height) : originBounds.height,
    r = opts.round,
    type = (opts.type === 'line') ? 'line' : ((r > 0 && (x1 === domain[0] || x2 === domain[1])) ? 'path': 'rect'),
    leftRound = (r > 0 && x1 === domain[0] && y1 === 0 && y2 === originBounds.height),
    rightRound = (r > 0 && x2 === domain[1] && y1 === 0 && y2 === originBounds.height),
    marker = null,
    label = null,
    labelBBox = null,
    rangeBorder = rangeUpdate.selectAll(CN.FN.border).data([opts]);
    rangeBorder.enter().append(type).attr('class', CN.border);
    
    x1 = scale(x1);
    x2 = scale(x2);
    if (type === 'line') {
        rangeBorder.attr({'x1': x1, 'x2': x2, 'y1': y1, 'y2' : y2});
    } else if (type === 'rect') {
        rangeBorder.attr({'x': x1, 'y': y1, 'width': x2 - x1, 'height': y2 - y1});
    } else if (type === 'path') {
        var path = (leftRound ? ('M' + x1 + ' ' + (y1 + r) + ' a' + r + ',' + r + ' 0 0,1 ' + r + ',' + (-r)) : (' M' + x1 + ' ' + y1 + ' l' + r + ' ' + 0))
                + ' L' + (x2 - r) + ' ' + y1
                + (rightRound ? (' a' + r + ',' + r + ' 0 0,1 ' + r + ',' + r) : (' l' + r + ' ' + 0 + ' l' + 0 + ' ' + r))
                + ' L' + x2 + ' ' + (y2 - r)
                + (rightRound ? (' a' + r + ',' + r + ' 0 0,1 ' + (-r) + ',' + r) : (' l' + 0 + ' ' + r + ' l' + (-r) + ' ' + 0))
                + (leftRound ? (' L' + (x1 + r) + ' ' + y2 + ' a' + r + ',' + r + ' 0 0,1 ' + (-r) + ',' + (-r)) : (' L' + x1 + ' ' + y2 + ' l' + 0 + ' ' + (-r)))
                + ' Z';
        rangeBorder.attr('d', path);
    }
    d3c_applyBorderStyle(rangeBorder, opts.border, opts, chartContext);
    
    if (opts.marker && opts.marker.enabled !== false) {
        marker = d3c_createMarker(rangeUpdate, opts.marker, originBounds.height, chartContext);
        d3c_translate(marker, x1, (opts.markerPosition === 'below') ?  y2 : y1);
    }
    
    if (opts.label && opts.label.enabled !== false) {
        label = d3c_createLabel(rangeUpdate, opts.label, (opts.label.text ? opts.label.text : (x2 ? ('[' + x1 + ',' + x2 + ']') : x1)), chartContext);
        labelBBox = label.node().getBBox();
        var y = 0;
        if (marker) {
            // Label position is relative to marker.
            y += (opts.markerPosition === 'below') ? y2 : y1;
            y += (opts.labelPosition === 'below') ? opts.marker.size / 2 : (-opts.marker.size - labelBBox.height);
        } else {
            // No marker, label position is relative to top or bottom of gadget
            y = (opts.labelPosition === 'below') ? y2 : y1 - labelBBox.height;
        }
        d3c_translate(label, x1, y);
    }
    
    return rangeUpdate;
}

/**
 * Create ranges.
 * 
 * @param _rangesUpdate
 * @param _scale
 * @param _originBounds
 * @param _context
 */
function d3c_createRanges(rangesUpdate, scale, originBounds, context) {
    rangesUpdate.each(function (rangeOpts, i) {
        return d3c_createRange(d3.select(this), rangeOpts, scale, originBounds, context);
    });
    return rangesUpdate;
}

/**
 * Create band.
 * 
 * @param bandUpdate
 * @param opts
 * @param scale
 * @param originBounds
 * @param context
 * @returns
 */
function d3c_createBand(bandUpdate, opts, scale, originBounds, context) {
    return d3c_createRange(bandUpdate, opts, scale, originBounds, context);
}

/**
 * Create bands.
 * 
 * @param bandsUpdate
 * @param opts
 * @param scale
 * @param originBounds
 * @param context
 * @returns
 */
function d3c_createBands(bandsUpdate, scale, originBounds, context) {
    return d3c_createRanges(bandsUpdate, scale, originBounds, context);
}

/**
 * The function create a border according to options, but not set border bounds.
 * 
 * @param group
 * @param opts
 * @param chartContext
 * @param functor
 * @returns
 */
function d3c_createBorder(group, opts, chartContext, functor) {
    var border = group.selectAll(CN.FN.border).data([opts]);
    border.enter().append('rect').attr('class', CN.border);
    d3c_applyBorderStyle(border, opts.border, opts, chartContext, functor);
    return border;
}

/**
 * Return format function.
 * 
 * @param _value
 * @param _pattern
 * @returns
 */
function d3c_format(_value, _pattern) {
    // TODO ... Will be implemented futrue.
    return _value;
}
/**
 * Label class extends from Element class.
 */

var Label = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.label,
    _fRender: function (g) {
        var
        _this = this;
        context = this.ChartContext,
        opts = this.options,
        paddingOpts = d3c_adaptMargin(opts.padding),
        format = opts.format,
        xOffset = opts.xOffset || 0,
        yOffset = opts.yOffset || 0,
        bbox = null,
        borderUpdate = null,
        textUpdate = null,
        d3Sel = this.d3Sel = g || this.eContainer.d3Sel.append('g').attr('class', CN.label);
        
        d3Sel.each(function (d, i) {
            var 
            g = d3.select(this),
            text = opts.text || d;
            
            if (!g.attr('class')) {
                g.attr('class', _this.fClassNames());
            }
            if (opts.enabled === false) {
                return this;
            };
            
            if (opts.fill && opts.border) {
                borderUpdate = d3c_createBorder(g, opts, context);
            }
            
            textUpdate = g.selectAll('text').data([opts]);
            textUpdate.enter().append('text');
            textUpdate.text(typeof format === 'function' ? format.call(this, text) : d3c_format(text, format));
            textUpdate.call(d3c_applyFontStyle, opts.font, context).attr({'x': xOffset, 'y': yOffset, 'dy': '.8em'});
            bbox = g.bbox(true);
            
            if (borderUpdate) {
                borderUpdate.attr({'x': xOffset, 'y': yOffset, 'width': paddingOpts.left + bbox.width + paddingOpts.right, 'height': paddingOpts.top + bbox.height + paddingOpts.bottom});
            }
            
            d3c_translate(textUpdate, paddingOpts.left, paddingOpts.top);
            
            if (opts.anchor === 'middle') {
                textUpdate.attr('x', xOffset -bbox.width / 2);
                if (borderUpdate) {
                    borderUpdate.attr('x', xOffset -(paddingOpts.left + bbox.width + paddingOpts.right) / 2);
                }
            } else if (opts.anchor === 'end') {
                textUpdate.attr('x', xOffset -bbox.width);
                if (borderUpdate) {
                    borderUpdate.attr('x', xOffset -(paddingOpts.left + bbox.width + paddingOpts.right));
                }
            }
            
            if (opts.rotation) {
                g.call(d3c_rotate, opts.rotation, opts.rotationAnchor);
            }
        });
        
        return this;
    },
    fLabelFromat: function () {
        if (!arguments.length) {
            return this.options.format;
        } else {
            this.options.format = arguments[0];
            return this.fApplyChange(this.fLabelFormat);
        }
    }
});
/**
 *
 */

var DefaultLedLabelOptions = {
    value : 0,
    width : 0,
    digitCount : 3,
    negative : false,
    decimals : 0,
    gap: 130,
    fill: 'black',
    fillOpacity: 0.15
};

var LedLabel = d3c_extendClass(null, Element, {
        value : null,
        digits : [0],
        _scale : null,
        _dispUpdate : null,
        _fRender : function (g) {
            var
            i = 0,
            opts = this.options,
            width = opts.width,
            digitCount = opts.digitCount,
            gap = opts.gap,
            _scale = this._scale,
            d3Sel = (this.d3Sel = this.d3Sel || g || this.eContainer.d3Sel.append('g'));
            
            if(!d3Sel.attr('class')) {
                d3Sel.attr('class', CN.ledLabel)
            }
            
            this.digits = new Array(digitCount);
            for (i = 0; i < digitCount; i++) {
                this.digits[i] = 0;
            }  
            
            _scale = this._scale = width / (gap * digitCount + 50);
            // var height= 200 * _scale;

            var disp = d3Sel.selectAll(".digit").data(this.digits);
            this._dispUpdate = (disp.enter().append("g").attr("class", "digit"), d3.transition(disp));
            this._dispUpdate.attr("transform", function (d, i) {
                return "translate(" + (width - gap * _scale * i - 80 * _scale) + ", " + (20 * _scale) + ")";
            })
            .call(d3c_led_drawDigit, _scale);
            if (opts.fill) {
                this._dispUpdate.style({'fill': d3c_adaptFill.call(this._dispUpdate, opts.fill, this.chartContext).value, 'fill-opacity': opts.fillOpacity || 1e-6});
            }
            return this.fValue(opts.value || 0);
        },
        fValue : function (val) {
            var 
            opts = this.options,
            decimals = opts.decimals,
            negative = opts.negative,
            digits = this.digits;
            
            if (!arguments.length) {
                return opts.value;
            }
            opts.value = val;

            var v = Math.round(Math.abs(val) * Math.pow(10, decimals));
            this._dispUpdate.each(function (d, i) {
                var g = d3.select(this);

                if (!negative && val < 0) {
                    digits[i] = -1;
                    d3c_led_litDigit(g, 10, false);
                    return;
                }

                digits[i] = v % 10;
                d3c_led_litDigit(g, digits[i], (i == decimals));
                if (v < 10 && i >= decimals) {
                    if (negative && v == -1 && val < 0 && i > decimals) {
                        digits[i] = -1;
                        d3c_led_litDigit(g, 10, false);
                        val = -val;
                    } else {
                        v = -1;
                    }
                } else {
                    v = Math.floor(v / 10);
                }
            });
            
            // Enable or disable 
            this._dispUpdate.selectAll('.off').style('fill-opacity', opts.fillOpacity || 1e-6);
            this._dispUpdate.selectAll('.on').style('fill-opacity', 1);
            return this;
        },
        fDigitCount : function (x) {
            if (!arguments.length) {
                return this.options.digitCount;
            } else {
                this.options.digitCount = x;
                this.digits = new Array(this.options.digitCount);
                for (var i = 0; i < this.options.digitCount; i++) {
                    this.digits[i] = 0;
                }  
                return this.fApplyChange(this.fDiditCount);
            }
        },
        fDecimals : function (x) {
            if (!arguments.length) {
                return this.options.decimals;
            } else {
                this.options.decimals = x;
                return this.fApplyChange(this.fDecimals);
            }
        },
        fWidth : function (x) {
            if (!arguments.length) {
                return this.options.width;
            } else {
                this.options.width = x;
                return this.fApplyChange(this.fWdith);
            }
        },
        fNegative : function (x) {
            if (!arguments.length) {
                return this.options.negative;
            } else {
                this.options.negative = x;
                return this.fApplyChange(this.fNegative);
            }
        },
        fGap : function (x) {
            if (!arguments.length) {
                return this.options.gap;
            } else {
                this.options.gap = x;
                return this.fApplyChange(this.fGap);
            }
        }
    });

function d3c_led_drawDigit(element, scale) {
    var ll = 40 * scale;
    var aa = 10 * scale;
    var bb = 10 * scale;
    var cc = 2 * scale;
    var rr = 10 * scale;
    var a = d3c_led_drawSegment(element, 0, 0, ll, aa, bb, cc, 0);
    var b = d3c_led_drawSegment(element, 35 * scale, 42 * scale, ll, aa, bb, -cc, 100);
    var c = d3c_led_drawSegment(element, 21 * scale, 126 * scale, ll, aa, bb, -cc, 100);
    var d = d3c_led_drawSegment(element, -28 * scale, 168 * scale, ll, aa, bb, cc, 0);
    var e = d3c_led_drawSegment(element, -62 * scale, 126 * scale, ll, aa, bb, -cc, 100);
    var f = d3c_led_drawSegment(element, -48 * scale, 42 * scale, ll, aa, bb, -cc, 100);
    var g = d3c_led_drawSegment(element, -14 * scale, 84 * scale, ll, aa, bb, cc, 0);
    var dot = element.append("circle")
        .attr("cx", 32 * scale)
        .attr("cy", 175 * scale)
        .attr("r", rr)
        .attr("class", "off")
        .style("stroke", "none");
    return [a, b, c, d, e, f, g, dot];
}

function d3c_led_drawSegment(e, cx, cy, l, a, b, c, angle) {
    return e.append("path")
    .attr("d", "M" + (cx + l) + " " + cy + "L" + (cx + l - a + c) + " " + (cy - b) + "L" + (cx - l + a + c) + " " + (cy - b) + "L" + (cx - l) + " " + (cy) + "L" + (cx - l + a - c) + " " + (cy + b) + "L" + (cx + l - a - c) + " " + (cy + b))
    .attr("transform", function () {
        return "rotate(" + angle + " " + cx + " " + cy + ")";
    })
    .attr("class", "off")
    .style("stroke", "none");
}

function d3c_led_litDigit(digit, val, dot) {
    var cond = [];
    switch (val) {
    case 1:
        cond = [0, 1, 1, 0, 0, 0, 0];
        break;
    case 2:
        cond = [1, 1, 0, 1, 1, 0, 1];
        break;
    case 3:
        cond = [1, 1, 1, 1, 0, 0, 1];
        break;
    case 4:
        cond = [0, 1, 1, 0, 0, 1, 1];
        break;
    case 5:
        cond = [1, 0, 1, 1, 0, 1, 1];
        break;
    case 6:
        cond = [1, 0, 1, 1, 1, 1, 1];
        break;
    case 7:
        cond = [1, 1, 1, 0, 0, 0, 0];
        break;
    case 8:
        cond = [1, 1, 1, 1, 1, 1, 1];
        break;
    case 9:
        cond = [1, 1, 1, 1, 0, 1, 1];
        break;
    case 0:
        cond = [1, 1, 1, 1, 1, 1, 0];
        break;
    case 10:
        cond = [0, 0, 0, 0, 0, 0, 1];
        break;
    default:
        cond = [0, 0, 0, 0, 0, 0, 0];
    }

    digit.selectAll("*").each(function (d, i) {
        d3.select(this).attr("class", (i < 7 && cond[i]) || (i == 7 && dot) ? "on" : "off");
    });
}
/**
 * 
 */
function Chart(node, _chartContext, _options, _theme) {
//    var args = arguments;
    // Initialize private variable set.
    this._p = {};
    
    // Init this object.
    if (this.fInit) {
//        args[0] = {d3Sel : args[0]};
        this.fInit.apply(this, arguments);
    }
    return this;
}
d3c_extendClass(Chart, Element, {
    _CLASS_NAMES : CN.chart,
    themeOpts : null,
    eTitle : null,
    eLegend : null,
    eXAxis : null,
    eYAxis : [],
    ePlot : null,
    eSeries : [],
    defs : null,
    innerBounds : null,
    outerBounds : null,
    fInit : function (_chartContext, _options, _theme) {
        this._super.fInit.call(this,
                {},
                _chartContext,
                _options,
                _theme);
        
        this.chartContext.eContainer = this.eContainer;
        this.chartContext.options = this.options;
        this.chartContext.themeOpts = this.themeOpts = _theme;
        this.chartContext.eChart = this;
    },
    _fRender : function (selection) {
        var 
        _this = this,
        context = this.chartContext,
        p = this._p,
        chart = this,
        opts =  this.chartContext.jointOpts = chart.jointOpts = d3c_mergeChartOptions(d3c_mergeChartOptions(d3c_clone(DefaultOptions), this.themeOpts), this.options),
        chartOpts = (opts && opts.chart) ? opts.chart : {},
        titleOpts = chartOpts.title || {}, 
        titlePos = chartOpts.title.position,
        titleBBox = null,
        titleX = null,
        titleY = null,
        legendOpts = chartOpts.lengend || {},
        plotOpts = chartOpts.plot || {},
        svgSel = null,
        remainBounds = this.innerBounds,
        selType = null;
        
        selType = typeof selection;
        if (selType === 'string') {
            this.eContainer.d3Sel = d3.select(selection);
        } else if (selType === 'function') {
            this.eContainer.d3Sel = selType();
        } else {
            this.eContainer.d3Sel = selection;
        }
        this.chartContext.chartId = this.eContainer.d3Sel.attr('id');
        
        // Compute chart width and height.
        chartOpts.width = chartOpts.width || parseInt(this.eContainer.d3Sel.attr('width'), 0);
        chartOpts.height = chartOpts.height || parseInt(this.eContainer.d3Sel.attr('height'), 0);
        
        // Render chart. 
        // Create chart object(svg).
        this.chartContext.svgSelection = svgSel = p.svg = this.eContainer.d3Sel.append('svg');
        svgSel.attr('class', this.chartContext.chartId + ' ' + CN.svg + ' ' + this.fClassNames());
        svgSel.attr({
            'width': chartOpts.width,
            'height': chartOpts.height
        });
            
        // 1 Compute chart outer and inner bounds.
        chart.outerBounds = {
                x: 0,
                y: 0,
                width: chartOpts.width,
                height: chartOpts.height
            };
        chart.innerBounds = d3c_clone(chart.outerBounds);

        chart.d3Sel = chart.d3Sel || svgSel.selectAll(CN.FN.chart)
                    .data([chartOpts]).enter().append('g');
        chart.d3Sel.attr('class', CN.chart);

        var margin = d3c_adaptMargin(chartOpts.margin);
        chart.innerBounds.x += margin.left;
        chart.innerBounds.width -= (margin.left + margin.right);
        chart.innerBounds.y += margin.top;
        chart.innerBounds.height -= (margin.top + margin.bottom);

        remainBounds = this.innerBounds;
            
//            if (chartOpts.background || chartOpts.border) {
//                var chartBorder = selection.append('rect').attr('class',
//                        'chart-border');
//                d3c_applyOptions(chartOpts, chartBorder, chartContext);
//                if (chartOpts.border && chartOpts.border.enabled) {
//                    d3c_applyOptions(chartOpts.border, chartBorder,
//                            chartContext);
//                }
//                chartBorder.attr({
//                    'x': innerBounds.x,
//                    'y': innerBounds.y,
//                    'width': innerBounds.width,
//                    'height': innerBounds.height
//                });
//
//                var borderWidth = chartBorder.attr('stroke-width') ||
//                        chartBorder.style('stroke-width');
//                innerBounds.x += borderWidth;
//                innerBounds.width -= borderWidth * 2;
//                innerBounds.y += borderWidth;
//                innerBounds.height -= borderWidth * 2;
//            }
//
//            var padding = d3c_adaptMargin(chartOpts.padding);
//            if (padding) {
//                innerBounds.x += padding.left;
//                innerBounds.width -= (padding.left + padding.right);
//                innerBounds.y += padding.top;
//                innerBounds.height -= (padding.top + padding.bottom);
//            }

        // 2 Add title
        
        titleOpts.rotation = titleOpts.rotation ? titleOpts.rotation:
            ((titlePos === 'top' || titleOpts === 'bottom') ? 0: -90); 
        chart.eTitle = new Title(chart, chart.chartContext, titleOpts);
        if (titleOpts.enabled) {
            chart.title.fRender(chart.d3Sel);
            titleBBox = chart.title.getBBox();
            if (titlePos === 'top') {
                titleX = remainBounds.x;
                titleY = remainBounds.y;
                remainBounds.y += titleBBox.height;
                remainBounds.height -= titleBBox.height;
            } else if (titlePos === 'bottom') {
                titleX = remainBounds.x;
                titleY = remainBounds.y - titleBBox.height;
                remainBounds.height -= titleBBox.height;
            } else if (titlePos === 'left') {
                titleX = remainBounds.x;
                titleY = remainBounds.y;
                remainBounds.x += titleBBox.width;
                remainBounds.width -= titleBBox.width;
            } else if (titlePos === 'right') {
                titleX = remainBounds.x + remainBounds.width - titleBBox.width;
                titleY = remainBounds.y;
                remainBounds.width -= titleBBox.width;
            }
            chart.title.fX(titleX).fY(titleY);
        }
        
        // 3 Add legend
        // As default, for axis chart, legend item should show each series info,for non-axis chart, legend item should display category info.
        
        d3c_merge(chartOpts.legend, remainBounds);
        chart.eLegend = new Legend(chart, chart.chartContext, legendOpts);
        if (legendOpts.enabled) {
            chart.eLegend.fRender(chart.d3Sel);
            
            // TODO... adjust legend group bounds.
        }
            
        // 4 Add chart area
        // 4.1 parse all series to classify series type, some series need axis, some not.
        
//        // 4.1 Add y axis        
//        var
//        seriesMap = d3c_getAxisSeries(opts.plot.series);
//        minMaxY = d3c_calculateScaleDomain(opts.yAxis[0], null, d3c_getSeriesMinMax(seriesMap, 0)),
//        yAxis0Scale = d3.scale.linear();
//        yAxis0Scale.domain(minMaxY);
//        yAxis0Scale.range([remainBounds.height, 0]);
//        if (opts.yAxis[0] || opts.yAxis[0].enabled !== false) {
//            eYAxis[0] = new Axis(_this, context, opts.yAxis[0]);
//            eYAxis[0].fScale(yAxis0Scale);
//            var
//            yaxis = chart.d3Sel.selectAll(CN.FN.yAxis + CN.FN.axis).data([opts.yAxis[0]]),
//            yaxisUpdate = (yaxis.enter().append('g').attr('class', CN.yAxis + ' ' + CN.axis), yaxis),
//            axisHeight = remainBounds.height;
//            axisUpdate.call(d3c_translate, remainBounds.x, remainBounds.y);
//            eYAxis[0].fRender(yaxisUpdate);
//        }
//        
//        // 4.2 Add x axis
//        var
//        yaxisBBox = yaxisUpdate.bbox(true),
//        xaxisDomain = [],
//        xRange = [0, remainBounds.width - yaxisBBox.width],
//        xaxisScale = d3.scale.ordinal();
//        xaxisScale.range(xRange);
//        if (opts.categoryType === 'datetime') {
//            xaxisDomain = [new Date().setTime(opts.category[0]), new Date().setTime(opts.category[opts.category.length - 1])];
//            xaxisScale.domain(xaxisDomain);
//        } else  {
//            xaxisDomain = [opts.category[0], opts.category[opts.category.length - 1]];
//            xaxisScale.domain(xaxisDomain);
//        }
//        
//        if (opts.xAxis || opts.xAxis.enabled !== false) {
//            eXAxis[0] = new Axis(_this, context, opts.xAxis);
//            eXAxis[0].fScale(xaxisScale);
//            var
//            xaxis = chart.d3Sel.selectAll(CN.FN.xAxis + CN.FN.axis).data([opts.xAxis]),
//            xaxisUpdate = (xaxis.enter().append('g').attr('class', CN.xAxis + ' ' + CN.axis), xaxis);
//            xaxisUpdate.call(d3c_translate, remainBounds.x + yaxisBBox.width, remainBounds.y + remainBounds.height);
//            eXAxis.fRender(xaxisUpdate);
//        }
//        
//        // Adjust position of y axis and x axis
        
        
        
        
        // 4.3 Add plot & series
        
        d3c_merge(chartOpts.plot, remainBounds); // set plot bounds.
        chart.ePlot = new Plot(chart, chart.chartContext, plotOpts);
        chart.ePlot.fRender(chart.d3Sel);
        this.eSeries = chart.ePlot.eSeries;
        
        // 5 Transition

        chart._super._fRender.apply(chart, arguments);
        
        return this;
    },
    fTheme: function () {
        if (!arguments.length) {
            return this.theme;
        } else {
            this.theme = arguments[0];
            return this.fApplyChanged(this.fTheme);
        }
    },
    fWidth: function () {
        if (!arguments.length) {
            // Get width.
            return (this.options && this.options.chart.width) ? this.options.chart.width
                   : (isRendered ? this.getBBox().width
                           : undefined);
        } else if (this.options && this.options.chart.width !== arguments[0]) {
            // Set width
            this.options.chart.width = arguments[0];
            return this.fApplyChanged(this.fWidth);
        }
    },
    fHeight: function () {
        if (!arguments.length) {
            // Get height.
            return (this.options && this.options.chart.height) ? this.options.chart.height
                   : (isRendered ? this.getBBox().height
                           : undefined);
        } else if (this.options && this.options.chart.height !== arguments[0]) {
            // Set height
            this.options.chart.height = arguments[0];
            return this.fApplyChanged(this.fHeight);
        }
    },
    // Set/get title.
    // Set and create/recreate title with title options parameter, get title
    // object without parameter.
    fTitle: function () {
        if (!arguments.length) {
            return this.eTitle;
        } else {
        // Set title options and create/recreate title.
        // TODO...
            return this.fApplyChanged(this.fTitle);
        }
    },
    /**
     * Add(insert)/get chart series.
     * <p>
     * Add series :
     * <p>
     * the first parameter is array of number to define insert index, null
     * array means append operator instead of insert operator, the second parameter
     * is array of series options object.
     * <p>
     * Get series :
     * <p>
     * parameter is array of number to indicate returned index of series, null
     * array means all series will be returned.
     */
    fSeries : function () {
        var type = null, i, returns = [], s;
        if (!arguments.length) {
            return this.eSeries;
        }

        if (typeof arguments[0] === 'string') {
            // The argument is specified series type and all series type equals to the value will be returned.
            type = arguments[0];
            s = (this.isRendered) ? this.eSeries : this.options.chart.plot.series;
            i = s.length;
            while (i--) {
                if (s[i].type === type) {
                    returns.push(s[i]);
                }
            }
            return returns;
        } else if (arguments[0] instanceof Array) {
            if (arguments[1]) {
                // Add/insert series
                // TODO...
                return this.fApplyChange(this.fSeries);
            } else {
                // Get series
                if (arguments[0].lenght === 0) {
                    return this.eSeries;
                }
                else {
                    var selected = [];
                    for (var index in arguments[0]) {
                        if (this.eSeries[index]) {
                            selected.push(this.eSeries[index]);
                        }
                    }
                    return selected.reverse();
                }
            }
        }
        return this;
    }
});

function d3c_getSeriesMinMax(seriesMap, yAxisKey, valueKey) {
    var arr = [];
    for (var s in seriesMap.get(yAxisKey)) {
        arr = d3.merge([arr, d3c_seriesValues(s.data, valueKey)]);
    }
    arr = [d3.min(arr), d3.max(arr)];
    
}

function d3c_getAxisSeries(seriesOpts) {
    var
    series = null,
    sMap = d3.map();
    for (var s in seriesOpts) {
        series = seriesOpts[s];
        if (d3c_isAxisSeries(series.type)) {
            sMap.set(series.axisIndex || 0, series);
        } else {
            sMap.set('noaixs', series);
        }
    }
}

function d3c_isAxisSeries(seriesType) {
    switch(seriesType) {
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
    case 'bubble':
    case 'gantt':
        return true;
    }
    return false;
}
   /**
 * Title class
 */

var Title = d3c_extendClass(null, Label, {
    _CLASS_NAMES: CN.title,
    _fRender: function () {
        var opts = this.options,
            x = opts.x,
            y = opts.y,
            w = opts.width,
            h = opts.height,
            m = opts.margin,
            vAlign = opts.vAlign,
            hAlign = opts.hAlign,
            bbox = null,
            dx = null,
            dy = null;
        if (!opts.enabled) {
            return this;
        }
        
        this.d3Sel = this.eContainer.d3Sel.append('g').attr('class', this.fClassNames());
        bbox = this._super.fRender.apply(this.d3Sel, arguments).fGetBBox();
        m = d3c_adaptMargin(m);
        bbox = d3c_plusOfMargin2BBox(bbox, m);
        
        if (w) {
            if (bbox.width < w) {
                if (hAlign === 'left') {
                    dx = x + m.left;
                } else if (hAlign === 'middle') {
                    dx = (w - bbox.width) / 2 - m.left;
                } else if (hAlign === 'right') {
                    dx = w - bbox.width - m.right;
                }
            }    
        } else {
            w = bbox.width;
        }
        
        if (h) {
            if (bbox.height < h) {
                if (vAlign === 'top') {
                    dy = y + m.top;
                } else if (vAlign === 'middle') {
                    dy = (h - bbox.height) / 2 - m.top;
                } else if (vAlign === 'bottom') {
                    dy = h - bbox.height - m.bottom;
                } 
            }    
        } else {
            h = bbox.height;
        }
        
        if (dx || dy) {
            // Adjust title position.
            d3c_translate(this.d3Sel, dx || x, dy || y);
        }
    }
});/**
 * 
 */

var Axis = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.axis,
    scale: null,
    tickValues: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.scale = d3.scale.linear();
    },
    _fRender: function (g) {
        var
        _this = this,
        p = this._p,
        context = this.chartContext,
        opts = this.options,
        labelOpts = opts.label,
        axisLineOpts = opts.axisLine,
        orient = opts.orient,
        tickOpts = opts.tick,
        scaleOpts = tickOpts.scaleOpts,
        tickNumbers = tickOpts.scale.stepNumber || 10,
        labelFormat = labelOpts && labelOpts.format,
        tickMajorSize = tickOpts.major.size,
        outerTickSize = tickMajorSize,
        tickMinorSize = tickOpts.minor.size,
        tickPadding = tickOpts.padding,
        tickSubdivide = tickOpts.minor.count || 3, 
        scale = this.scale,
        tickValues = this.tickValues,
        hasMinorTicks = false;
        
        this.d3Sel = g;
        g.each(function(d, i) {
            var
            g = d3.select(this).attr('class', _this.fClassNames());
            
            if (opts.enabled === false) return;
            
            // Set scale range according to width and height settings.
            if (orient === 'top' || orient === 'bottom') {
                scale.range([0,  opts.width]);
            } else {
                scale.range([opts.height, 0]);
            }
            
            // Stash a snapshot of the new scale, and retrieve the old snapshot.
            var
            scale0 = this.__scale__ || scale, 
            scale1 = this.__scale__ = scale.copy();
            
            // Do not set offset here, since all children element of axis depend
            // on coordinate of axis, it is better the container set offset of
            // axis group rather here
//            if (opts.xOffset !== 0 || opts.yOffset !== 0) {
//                d3c_translate(g, opts.xOffset, opts.yOffset);
//            }
            
            // Ticks, or domain values for ordinal scales.
            var
            majorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.major.stroke, context).value, 'stroke-opacity': tickOpts.major.strokeOpacity, 'stroke-width': tickOpts.major.strokeWidth},
            ticks = (tickValues === null) ? (scale1.ticks ? scale1.ticks.apply(scale1, [tickNumbers]) : scale1.domain()) : tickValues,
            tick = g.selectAll(CN.FN.tick + CN.FN.major).data(ticks, scale1),
            tickEnter = tick.enter().insert('g', '.domain').attr('class', CN.tick + ' ' + CN.major).style('opacity', 1e-6),
            tickExit = d3.transition(tick.exit()).style('opacity', 1e-6).remove(),
            tickUpdate = d3.transition(tick).style('opacity', 1),
            tickTransform = null,
            tickLabelFormat = String;
            
            if (labelFormat && p.labelFormat == labelFormat) {
                tickLabelFormat = p.labelFormat;
            } else if (typeof labelFormat === 'function') {
                tickLabelFormat = p.labelFormat = labelFormat;
            } else {
                if (typeof labelFormat === 'string') {
                    tickLabelFormat = p.labelFormat = scale1.tickFormat ? scale1.tickFormat.apply(scale1, [tickNumbers], labelFormat) : String; // String doesn't support format pattern now.
                } else {
                    tickLabelFormat = p.labelFormat = scale1.tickFormat ? scale1.tickFormat.apply(scale1, [tickNumbers]) : String; // String doesn't support format pattern now.
                }
            }
            
            if (tickOpts.minor && tickOpts.minor.enabled !== false ) {
                var
                minorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.minor.stroke, range).value, 'stroke-opacity': tickOpts.minor.strokeOpacity, 'stroke-width': tickOpts.minor.strokeWidth},
                subticks = d3c_axisSubdivide(scale, ticks, tickSubdivide),
                subtick = g.selectAll(CN.FN.tick + CN.FN.minor).data(subticks, String),
                subtickEnter = subtick.enter().insert('line', '.tick').attr('class', CN.tick + ' ' + CN.minor).style(minorStrokeStyle),
                subtickExit = d3.transition(subtick.exit()).style({'stroke-opacity' : 1e-6}).remove(),
                subtickUpdate = d3.transition(subtick).style(minorStrokeStyle);
                hasMinorTicks = true;
            }
            
            // Domain.
            var
            range = d3c_scaleRange(scale1),
            path = g.selectAll(CN.FN.domain).data([0]),
            pathUpdate = (path.enter().append('path').attr('class', CN.domain).style('fill', 'none'), d3.transition(path));
            
            tickEnter.append('line').style('fill', 'none');
            tickEnter.append('text');
            
            var
            lineEnter = tickEnter.select('line'),
            lineUpdate = tickUpdate.select('line');
            text = tick.select('text').text(tickLabelFormat),
            line = tick.select('line').style(majorStrokeStyle),
            textEnter = tickEnter.select('text');
            textUpdate = tickUpdate.select('text'),
            textBBox = null,
            majorOffset = null,
            minorOffset = null,
            labelOffset = null,
            axisPath = null;
            
            d3c_adaptPositions(opts);
            
            majorOffset = d3c_axisTickOffset(tickOpts.major, tickMajorSize, orient);
            minorOffset = d3c_axisTickOffset(tickOpts.minor, tickMinorSize, orient);
            labelOffset = d3c_axisLabelOffset(labelOpts, orient, tickOpts.major.style, tickOpts.major.size, tickPadding);
            axisPath = d3c_axisPath(orient, tickOpts.major.style, outerTickSize, range);
            if (orient === 'top' || orient === 'bottom') {
                tickTransform = d3_svg_axisX;
                lineEnter.attr('y1', majorOffset[0]).attr('y2', majorOffset[1]);
                textEnter.attr('y', labelOffset[0]);
                lineUpdate.attr('x2', 0).attr('y1', majorOffset[0]).attr('y2',  majorOffset[1]);
                textUpdate.attr('x', 0).attr('y', labelOffset[0]);
                text.attr('dy', labelOffset[1]).style('text-anchor', 'middle');
                if (hasMinorTicks) {
                    subtickEnter.attr('y1', minorOffset[0]).attr('y2', minorOffset[1]);
                    subtickUpdate.attr('x2', 0).attr('y1', minorOffset[0]).attr('y2',  minorOffset[1]);
                }
                
                pathUpdate.attr("d", axisPath);
            } else if (orient === 'left' || orient === 'right') {
                tickTransform = d3_svg_axisY;
                lineEnter.attr('x1', majorOffset[0]).attr('x2', majorOffset[1]);
                textEnter.attr('x', labelOffset[0]);
                lineUpdate.attr('x1', majorOffset[0]).attr('x2', majorOffset[1]).attr('y2', 0);
                textUpdate.attr('x', labelOffset[0]).attr('y', 0);
                text.attr('dy', labelOffset[1]).style('text-anchor', (d3c_adaptPosition(orient, labelOpts.position) === 'left' ? 'end' : 'start'));
                if (hasMinorTicks) {
                    subtickEnter.attr('x1', minorOffset[0]).attr('x2', minorOffset[1]);
                    subtickUpdate.attr('x1', minorOffset[0]).attr('x2', minorOffset[1]).attr('y2', 0);
                }
                pathUpdate.attr('d', axisPath);
            }
            
            // Apply tick label style
            if (labelOpts) {
                d3c_applyFontStyle(text, labelOpts.font, context);
                if (labelOpts.rotation) {
                    d3c_rotate(textEnter, labelOpts.rotation, labelOpts.rotationAnchor);
                }
            }
            textBBox = text.bbox();
            
            // Apply axis line style
            if (axisLineOpts && axisLineOpts.enabled !== false) {
                pathUpdate.style(d3c_toCssStyle(axisLineOpts));
            }
            
            // For ordinal scales:
            // - any entering ticks are undefined in the old scale
            // - any exiting ticks are undefined in the new scale
            // Therefore, we only need to transition updating ticks.
            if (scale1.rangeBand) {
              var dx = scale1.rangeBand() / 2, x = function(d) { return scale1(d) + dx; };
              tickEnter.call(tickTransform, x);
              tickUpdate.call(tickTransform, x);
            }

            // For quantitative scales:
            // - enter new ticks from the old scale
            // - exit old ticks to the new scale
            else {
              tickEnter.call(tickTransform, scale0);
              tickUpdate.call(tickTransform, scale1);
              tickExit.call(tickTransform, scale1);
              if (hasMinorTicks) {
                  subtickEnter.call(tickTransform, scale0);
                  subtickUpdate.call(tickTransform, scale1);
                  subtickExit.call(tickTransform, scale1);
              }
            }
        });
        
        return this;
    },
    fScale: function () {
        if (!arguments.length) {
            return this.scale;
        } else {
            this.scale = arguments[0];
            return this.fApplyChange(this.fScale);
        }
    },
    fScaleDomain: function (){
        if (!arguments.length) {
            return this.scale.domain();
        } else {
            this.scale.domain(arguments[0]);
            return this.fApplyChange(this.fScaleDomain);
        }
    },
    fTickValues: function () {
        if (!arguments.length) {
            return this.tickValues;
        } else {
            this.tickValues = arguments[0];
            return this.fApplyChange(this.fTickValues);
        }
    }
//    fScaleRange: function () {
//        if (!arguments.length) {
//            return this.scale.range();
//        } else {
//            this.scale.range(arguments[0]);
//            return this.fApplyChange(this.fScaleRange);
//        }
//    }
});

function d3c_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
}

function d3c_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3c_scaleExtent(scale.range());
}

function d3c_axisTickOffset(tickOpts, tickSize, orient) {
    if ( orient === 'top' || orient === 'bottom') {
        return [(tickOpts.style === 'cross') ? -tickSize : 0,
                (tickOpts.style === 'above') ? -tickSize : ((!tickOpts.style && orient === 'top') ? -tickSize : tickSize)];
    } else {
        return [(tickOpts.style === 'cross') ? -tickSize : 0,
                (tickOpts.style === 'left') ? -tickSize : ((!tickOpts.style && orient === 'left') ? -tickSize : tickSize)];    
    }
}

function d3c_adaptPositions(opts, orient) {
    if (opts.label) {
        opts.label.position = d3c_adaptPosition(opts.orient, opts.label.position);
    }
    opts.tick.major.style = d3c_adaptPosition(opts.orient, opts.tick.major.style);
    if (opts.tick.minor) {
        opts.tick.minor.style = d3c_adaptPosition(opts.orient, opts.tick.minor.style);    
    }
}

function d3c_adaptPosition(orient, position) {
    if (position === 'corss') {
        return position;
    }
    
    if (orient === 'top') {
        return position === 'left' ? 'below' : (position === 'right' ? 'top' : position);
    } else if (orient === 'bottom') {
        return position === 'right' ? 'above' : (position === 'left' ? 'below' : position);
    } else if (orient === 'left') {
        return position === 'above' ? 'right' : (position === 'below' ? 'left' : position);
    } else if (orient === 'right') {
        return position === 'below' ? 'left' : (position === 'above' ? 'right' : position);
    } else {
        return position;
    }
}

function d3c_axisLabelOffset(opts, orient, tickStyle, tickSize, tickPadding) {
    var _tickStyle = d3c_adaptPosition(orient, tickStyle);
    if (opts.position === 'same') {
        opts.position = _tickStyle;
    } else if (opts.position === 'opposite') {
        opts.position = (_tickStyle === 'cross') ? ((orient === 'top') ? 'below' : (orient === 'bottom' ? 'above' : orient === 'left' ? 'right' : 'left'))
                : ((_tickStyle === 'below') ? 'above' : (_tickStyle === 'above' ? 'below' : _tickStyle === 'left' ? 'right' : 'left'));
    } 
    
    if (opts.position === 'cross') {
        opts.position = (orient === 'top') ? 'above' : (orient === 'bottom' ? 'below' : orient === 'left' ? 'left' : 'right');
    }
    
    if (orient === 'bottom' || orient === 'top') {
        if (opts.position === 'above') {
            return [((_tickStyle !== 'below') ? -Math.max(tickSize, 0) : 0) - tickPadding, '0em']; 
        } else {
            return [((_tickStyle !== 'above') ? Math.max(tickSize, 0) : 0) + tickPadding, '.8em'];
        }
    } else if (orient === 'left' || orient === 'right') {
        if (opts.position === 'left') {
            return [((_tickStyle !== 'right') ? -Math.max(tickSize, 0) : 0) - tickPadding, '.32em']; 
        } else {
            return [((_tickStyle !== 'left') ? Math.max(tickSize, 0) : 0) + tickPadding, '.32em'];
        }
    } 
}

//function d3c_axisPath(orient, tickStyle, outerTickSize, range) {
//    if (orient === 'top') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize + ' V' + (-outerTickSize);
//        } else if (tickStyle === 'below') {
//            return 'M ' + range[0] + ',' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize;
//        } else {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V0' + ' H' + range[1] + ' V' + (-outerTickSize);
//        }
//    } else if (orient === 'bottom') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize + ' V' + (-outerTickSize);
//        } else if (tickStyle === 'above') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V0' + ' H' + range[1] + ' V' + (-outerTickSize);
//        } else {
//            return 'M ' + range[0] + ',' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize;
//        }
//    } else if (orient === 'left') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H' + outerTickSize + ' H0' + ' H' + range[1] + ' H' + outerTickSize + ' H' + (-outerTickSize);
//        } else if (tickStyle === 'right') {
//            return 'M ' + range[0] + ',' + outerTickSize + ' H0' + ' V' + range[1] + ' H' + outerTickSize;
//        } else {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H0' + ' V' + range[1] + ' H' + (-outerTickSize);
//        }
//    } else if (orient === 'right') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H' + outerTickSize + ' H0' + ' V' + range[1] + ' H' + outerTickSize + ' V' + (-outerTickSize);
//        } else if (tickStyle === 'left') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H0' + ' V' + range[1] + ' H' + (-outerTickSize);
//        } else {
//            return 'M ' + range[0] + ',' + outerTickSize + ' H0' + ' V' + range[1] + ' H' + outerTickSize;
//        }
//    }
//}

function d3c_axisPath(orient, tickStyle, outerTickSize, range) {
    if (orient === 'top' || orient === 'bottom') {
        return 'M' + range[0] + ',0' + ' H' + range[1]; 
    } else if (orient === 'left' || orient === 'right') {
        return 'M' + range[0] + ',0' + ' V' + range[1];
    } 
}

function d3_svg_axisX(selection, x) {
    selection.attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });
}

function d3_svg_axisY(selection, y) {
    selection.attr("transform", function(d) { return "translate(0," + y(d) + ")"; });
}

function d3c_axisSubdivide(scale, ticks, m) {
    var subticks = [];
    if (m && ticks.length > 1) {
        var extent = d3c_scaleExtent(scale.domain()), i = -1, n = ticks.length, d = (ticks[1] - ticks[0]) / ++m, j, v;
        while (++i < n) {
            for (j = m; --j > 0; ) {
                if ((v = +ticks[i] - j * d) >= extent[0]) {
                    subticks.push(v);
                }
            }
        }
        for (--i, j = 0; ++j < m && (v = +ticks[i] + j * d) < extent[1]; ) {
            subticks.push(v);
        }
    }
    return subticks;
}

var Legend = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.legend,
    fRender: function () {
        // TODO ...
    }
});
var Plot = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.plot,
    eSeries: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.eSeries = [];
    },
    _fRender: function () {
        var
        chartContext = this.chartContext,
        opts = this.options,
        x = opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        i = 0,
        series = null,
        border;
        
        if (opts.layout.type === 'mixed') {
            // All series will be painted at same position without considering overlay.
        } else if ( opts.layout.type === 'grid') {
            // All series will be painted at specified cells of grid.
        }
        
        this.d3Sel = this.d3Sel || this.eContainer.d3Sel.append('g').datum(opts).attr({'x': x, 'y': y, 'class': this.fClassNames()});
        d3c_translate(this.d3Sel, x, y);
        border = this.d3Sel.append('rect').attr('class', CN.border).attr({'x': 0, 'y': 0, 'width': w, 'height': h}).datum(opts.border);
        d3c_applyBorderStyle(border, opts.border, opts, chartContext);
        
        i = opts.series.length;
        while (i--) {
            serieOpts = opts.series[i];
            serieOpts.x = x;
            serieOpts.y = y;
            serieOpts.width = w;
            serieOpts.height = h;
            
            // Adjust series fill with color palette setting.
            if (this.chartContext.options.chart.colorPalette) {
                var len = this.chartContext.options.chart.colorPalette.length;
                serieOpts.fill = serieOpts.fill || this.chartContext.options.chart.colorPalette[i % len];
            }
            
            this.eSeries.push(series =  d3c_createSeries.call(this, this, this.chartContext, serieOpts));
            series.fRender();
        }
    }
});

/**
 * 
 * 
 * This class references implementation of {@link http://iop.io/js/iopctrl.js}
 *  
 */

var DefaultDialSeriesOptions = {
    type: 'dial',
    startAngle: -90, // 
    endAngle: 90,
    // fill:'',
    fillOpacity: 0,
    border: {
        enabled: false,
        stroke: 'white',
        strokeOpacity: 0,
        strokeWidth: 0
    },
    dialArc: {
        enabled: true,
        radius: '80%', // percent value of min value of container's width and height.
        innerRadius: '70%', // Same with radius, 
//        fill: 'white',
        fillOpacity: 0,
        border: {
            enabled: false,
            stroke: 'white',
            strokeOpacity: 1e-6,
            strokeWidth: 0
        }
    },
    value: {
        enabled: false,
        font: {
        },
//      fill:,
        fillOpacity: 0,
        border: {
            
        }
    },
    ranges: [
//             {
//          name:,
//        startValue:,
//        endValue:,
//        innerRadius:'30%', // percent value of dial radius.
//        radius:'70%',   // percent value of dial radius.
//        fill,
//          fillOpacity,
//        border:{}
//    }
],
    indicator: {
        fill: 'red',
        fillOpacity: 1,
        body: {
            headRadius: '80%',
            headSize: '1%',
            pivotSize: '5%',
            tailRadius: '20%',
            tailSize: '2%',
            fill: 'red',
            fillOpacity: 1,
            border: {
                
            }
        },
//        headMarker: {
//            enabled: false,
//            type: 'arrow',//
//            size: 4,
//            fill: 'black',
//            fillOpacity: 1,
//            border: {}
//        },
//        tailMarker: {
//            enabled: false,      
//            type: 'circle' ,//
//            size: 4,
//            fill:'black',
//            fillOpacity:1,
//            border:{}
//        },
        pivotMarker: {
            enabled: true,
            type: 'circle',
            size: '5%', // percent of radius
            fill: 'black',
            fillOpacity: 1,
            border: {
                stroke: 'red',
                strokeWidth: '5%'
            }
        }
    }
};

// Register dial series default options.
DefaultSeriesOptions.dialSeries = DefaultDialSeriesOptions;

// Register dial series creator.
d3c_registerSeriesCreator('dial', function (_container, _chartContext, _opts) {
    // Copy corresponding axis.
    _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
    return new DialSeries(_container, _chartContext, _opts);
});

var DialSeries = d3c_extendClass(null, Element, {
    type: 'dial',
    _CLASS_NAMES: CN.dialSeries + ' ' + CN.series,
    eAxis: null,
    dialArc: null,
    indicatorUpdate: null,
    valueLabel: null,
    ranges: [],
    cx: 0,
    cy: 0,
    pPointerUpdate: null,
    pRange: null,
    pExtent: null,
    pInvert: null,
    pComp: null,
    pCursorArc: null,
    pCursorUpdate: null,
    pCurrentValue: null,
    pCurrentRad: null,
    pLastEvent: null,
    pOnValueChanged: null,
    pLastAngle: null,
    arcFactor: 0.5,
    _fRender: function () {
        var 
        _this = this,
        chartContext = this.chartContext,
        opts = this.options,
        indicatorOpts = opts.indicator,
        valueOpts = opts.value,
        rangesOpts = opts.ranges,
        x = opts.x,
        y = opts.y,
        width = opts.width,
        height = opts.height,
        radius = (opts.dialArc.radius = d3c_adaptNumberOpt(opts.dialArc.radius, d3.extent([width / 2, height / 2])[0])), 
        innerRadius = (opts.dialArc.innerRadius = d3c_adaptNumberOpt(opts.dialArc.innerRadius || opts.radius, radius)),
        cx = (this.cx = width / 2),
        cy = (this.cy = height / 2),
        d3Sel = null,
        eAxis = this.eAxis;
        
        // Save radius and inner radius to options.
        opts.dialArc.radius = radius;
        opts.dialArc.innerRadius = innerRadius;
        
        // Create axis. 
        eAxis = this.eAxis = new ArcAxis(this, chartContext, opts).fX(cx).fY(cy);
        this.eAxis.fScale().range([d3c_radian(opts.startAngle), d3c_radian(opts.endAngle)]);
        
        this.pRange = d3c_dial_scaleRange(eAxis.fScale());
        this.pExtent = d3c_dial_scaleExtent(eAxis.fScale());
        this.pInvert = (this.pRange[0] > this.pRange[1]) ? true : false;
        this.pComp = 2 * Math.PI - Math.abs(this.pRange[1] - this.pRange[0]);
        this.pComp = this.pComp < 0 ? 0 : this.pComp;
                
        // Create dial selection.
        d3Sel = this.d3Sel = this.d3Sel || this.eContainer.d3Sel.append('g').datum(opts).attr('class', this.fClassNames());
        d3c_translate(d3Sel, x || 0, y || 0);
        
        // Render dial border and background.
        var border = d3Sel.append('circle').attr('class', CN.border).attr({'cx': cx, 'cy':
            cy, 'r': radius}).style({'fill-opacity': 1e-6});
        d3c_applyBorderStyle(border, opts.border, opts, chartContext);
        
        // Render dialArc.
        var 
        arc = d3Sel.selectAll(CN.FN.dialArc).data([opts]),
        arcUpdate = (arc.enter().append('g').attr('clsss', CN.dialArc), d3.transition(arc));
        
        this.dialArc = arcUpdate;
        d3c_translate(arcUpdate, cx, cy);
        arcUpdate.append('path').attr('class', 'lane').style('fill-opacity', 1e-6).attr('d', d3.svg.arc().
                startAngle(this.pExtent[0]).endAngle(this.pExtent[1]).innerRadius(innerRadius).outerRadius(radius));
        this.pCursorArc = d3.svg.arc().startAngle(this.pRange[0]).endAngle(this.pRange[1]).innerRadius(innerRadius).outerRadius(radius);
        arcUpdate.append('path').attr('class', 'cursor').style('fill-opacity', 1e-6).attr('d', this.pCursorArc);
        this.pCursorUpdate = arcUpdate.selectAll('.cursor');
        d3c_applyBorderStyle(arcUpdate.selectAll('path'), opts.dialArc.border, opts.dialArc, chartContext);
        
        // Create ranges
        var
        b = d3Sel.append('g').attr('class', CN.ranges).selectAll(CN.FN.range).data(rangesOpts),
        rangesUpdate = (b.enter().append('g').attr('class', CN.range), d3.transition(b)),
        rangesExit = d3.transition(b.exit()).style("fill-opacity", 1e-6).remove();

        // Render axis
        eAxis.fRender();
        
        // Render ranges until axis is rendered to get right scale domain for range rendering. 
        d3c_translate(rangesUpdate, cx, cy).each(function (rangeOpts, i){
            var rangePath = d3.select(this).append('path').
                attr('class', CN.range + ' ' + (rangeOpts.name || i)).
                attr('d', d3.svg.arc().startAngle(d3c_dial_convert(eAxis.fScale(), rangeOpts.startValue)).
                          endAngle(d3c_dial_convert(eAxis.fScale(), rangeOpts.endValue)).
                          innerRadius((rangeOpts.innerRadius = d3c_adaptNumberOpt(rangeOpts.innerRadius, radius))).
                          outerRadius((rangeOpts.radius = d3c_adaptNumberOpt(rangeOpts.radius, radius))));
            // Set border
            d3c_applyBorderStyle(rangePath, rangeOpts.border, rangeOpts, chartContext);
        });
        
        // Render value
        
        // Compose indicator and render indicator
        this.pPointerUpdate = (function(){
            var
            indicator = d3Sel.selectAll(CN.FN.indicator).data([indicatorOpts]),
            indicatorUpdate = (indicator.enter().append('g').attr('class', CN.indicator), d3.transition(indicator)),
            ib = indicatorOpts.body,
            ih = indicatorOpts.headMarker,
            ip = indicatorOpts.pivotMarker,
            it = indicatorOpts.tailMarker,
            pointerUpdate,
            paths = d3c_path(),
            bodyNode = null,
            headNode = null,
            tailNode = null,
            pivotNode = null;
            
            function borderFunctor(_borderOpts, chartContext) {
                (_borderOpts && _borderOpts.strokeWidth) ? _borderOpts.strokeWidth = (_borderOpts.strokeWidth = d3c_adaptNumberOpt(_borderOpts.strokeWidth, radius)) : null;
                return _borderOpts;
            };
            
            ib.headRadius = d3c_adaptNumberOpt(ib.headRadius, radius);
            ib.headSize = d3c_adaptNumberOpt(ib.headSize, radius);
            ib.pivotSize = d3c_adaptNumberOpt(ib.pivotSize, radius);
            ib.tailRadius = d3c_adaptNumberOpt(ib.tailRadius, radius);
            ib.tailSize = d3c_adaptNumberOpt(ib.tailSize, radius);
            
            // Create pointer group.
            pointerUpdate = d3c_translate(indicatorUpdate, cx, cy).append('g').attr('class', CN.pointer);
            if (indicatorOpts.fill) {
                pointerUpdate.style({'fill': indicatorOpts.fill || 'red', 'fill-opacity': indicatorOpts.fillOpacity || 1e-6});    
            }
            
            // render pointer body
            paths.push('M', -ib.pivotSize / 2, 0);
            paths.push('L', -ib.headSize / 2, -ib.headRadius);
            paths.push('L', ib.headSize / 2, -ib.headRadius);
            paths.push('L', ib.pivotSize / 2, 0);
            paths.push('L', ib.tailSize / 2, ib.tailRadius);
            paths.push('L', -ib.tailSize / 2, ib.tailRadius);
            paths.push('Z');
            bodyNode = pointerUpdate.append('path').datum(ib).attr('class', 'body').attr('d', paths());;
            d3c_applyBorderStyle(bodyNode, ib.border, ib, chartContext);
            
            // render pivot
            if (ip && ip.enabled) {
                ip.size = d3c_adaptNumberOpt(ip.size, radius);
                paths = (typeof ip.type === 'function') ? ip.type.call(_this, ip) : d3c_symbol().type(ip.type).size(ip.size * ip.size);
                pivotNode = pointerUpdate.append('path').datum(ip).attr('class', 'pivot').attr('d', paths());
                d3c_applyBorderStyle(pivotNode, ip.border, ip, chartContext, borderFunctor);
            }
            
            // render head
            if (ih && ih.enabled) {
                ih.size = d3c_adaptNumberOpt(ih.size, radius);
                paths = (typeof ih.type === 'function') ? ih.type.call(_this, ih) : d3c_symbol().type(ih.type).size(ih.size * ih.size);
                headNode = pointerUpdate.append('path').datum(ih).attr('class', 'head').attr('d', paths());
                d3c_translate(headNode, 0, -ib.headRadius);
                d3c_applyBorderStyle(headNode, ih.border, ih, chartContext, borderFunctor);
            }
            
            // render tail
            if (it && it.enabled) {
                it.size = d3c_adaptNumberOpt(it.size, radius);
                paths = (typeof it.type === 'function') ? it.type.call(_this, it) : d3c_symbol().type(it.type).size(it.size * ih.size);
                tailNode = pointerUpdate.append('path').datum(it).attr('class', 'tail').attr('d', paths());
                d3c_translate(tailNode, 0, ib.tailRadius);
                d3c_applyBorderStyle(tailNode, it.border, it, chartContext, borderFunctor);
            }
            
//            this.pPointerUpdate.append("path").attr("d", "M0 " + 0.2 * radius + " L 0 " + -1.05 * radius + "");
//            this.pPointerUpdate.append("circle").attr("r", 0.03 * radius);
            
            return pointerUpdate;
            
        })();
        
        
        d3c_rotate(this.pPointerUpdate, 180 * this.pRange[0] / Math.PI, 'auto');
        
        //this.fMovePointer(d3c_dial_invert(eAxis.fScale(), this.pRange[0]), 1000);
        this.fMovePointer(d3c_seriesValues(opts.data, 0)[0], 1000);
    },
    fMovePointer: function(_value, _td) {
        var _this = this, defTD = 1000;
        // Save value to options.
        d3c_seriesValues(_this.options, 0, [_value]);
        if(_value == _this.pCurrentValue) return;

        var rad = d3c_dial_convert(_this.eAxis.fScale(), _value);
        var startRad = (_this.pCurrentRad === null || _this.pCurrentRad === undefined || isNaN(_this.pCurrentRad)) ?  _this.pRange[0] : _this.pCurrentRad;
        
        _this.pCursorUpdate.transition()
            .duration(_td || defTD)
            .delay(0)
            .ease('cubic-out')
            .attrTween("d", function() {
                
                return function(step) {
                    _this.pCurrentRad = startRad + (rad - startRad) * step;
                    _this.pCurrentValue = d3c_dial_invert(_this.eAxis.fScale(), _this.pCurrentRad);
                    
//                    var now = new Date().getTime();
//                    if(pOnValueChanged && (step==1 || (pLastEvent || 0) + minEventInterval < now)) {
//                        pOnValueChanged(pCurrentValue, step==1);
//                        pLastEvent=now;
//                    }
                    
                    if(_this.pComp != 0) {
                        _this.pPointerUpdate.attr("transform", "rotate(" + 180 * _this.pCurrentRad / Math.PI + ")");
                    }
                    return _this.pCursorArc.endAngle(_this.pCurrentRad)();
                };
            })
            .each(function() {
                if(_this.pComp == 0) {
                    d3.transition(_this.pPointerUpdate)
                        .duration(_td || defTD)
                        .delay(0)
                        .ease('cubic-out')
                        .attr("transform", "rotate(" + 180 * rad / Math.PI + ")");
                }
            });
    },
    fAxisOpts: function() {
        if (!arguments) {
             return this.options.axis;
        } else {
            this.options.axis = arguments[0];
            return this.fApplyChange(this, fAxisOpts);
        }
    },
    fData: function() {
        if (!arguments) {
            return this.options.data;
        } else {
            this.options.data = arguments[0];
            return this.fApplyChange(this, fData);
        }
    }
}); 

var ArcAxis = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.axis,
    scale: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.scale = d3.scale.linear();
    },
    _fRender: function () {
        var 
        opts = this.options,
        axisOpts = opts.axis,
        labelOpts = axisOpts.label,
        tickOpts = axisOpts.tick,
        scaleOpts = tickOpts.scale,
        chartContext = this.chartContext,
        scale = this.scale,
        x = opts.x,
        y = opts.y,
        radius = opts.dialArc.radius,
        innerRadius = opts.dialArc.innerRadius,
        orient = axisOpts.orient,
        tickMajorSize = (tickOpts.major.size = d3c_adaptNumberOpt(tickOpts.major.size, radius)),
        tickMinorSize = (tickOpts.minor.size = d3c_adaptNumberOpt(tickOpts.minor.size, radius)),
        tickPadding = (tickOpts.padding = d3c_adaptNumberOpt(tickOpts.padding, radius)),
        tickNumbers  = opts.axis.tick.scale.stepNumber,
        tickValues = null,
        axisLabelFormat = axisOpts.format,
        tickSubdivide = tickOpts.minor.count || 3, 
        startRad = d3c_radian(opts.startAngle),
        endRad = d3c_radian(opts.endAngle),
        normalize = axisOpts.label.normalize,
        extent = null,
        d3Sel = null;
        
        // Create scale
        var value = d3c_seriesValues(opts.data, 0);
        value = value.length ? value[0] : 0;
        if (scaleOpts.min === undefined && scaleOpts.max === undefined) {
            scaleOpts.min = value / 10;
            scaleOpts.max = value + value - scaleOpts.min;
        }
        scaleOpts.min = (scaleOpts.min === undefined) ? value - Math.abs(scaleOpts.max - value) : scaleOpts.min;
        scaleOpts.max = (scaleOpts.max === undefined) ? value + Math.abs(value - scaleOpts.min) : scaleOpts.max;
        
        this.scale.domain([scaleOpts.min, scaleOpts.max]).range([startRad, endRad]);
        extent = d3c_dial_scaleExtent(scale);
        tickNumbers = (!tickNumbers && scaleOpts.stepInterval) ? ((extent[1] - extent[0]) / scaleOpts.stepInterval) : (tickNumbers || 10);
        
        // Create selection.
        var
        a = this.eContainer.d3Sel.selectAll(d3c_classFilterNames(this.fClassNames())).data([opts]),
        axisUpdate = (a.enter().append('g').attr('class', this.fClassNames()), d3.transition(a));
        d3Sel = this.d3Sel = this.d3Sel || d3c_translate(axisUpdate, x, y);
        
        // Create axis
        (function(){
            var ticks = tickValues ? tickValues : (scale.ticks ? scale.ticks.apply(scale, [tickNumbers]) : scale.domain()),
                    tickLabelFormat = axisLabelFormat ? axisLabelFormat : (scale.tickFormat ? scale.tickFormat.apply(scale, [tickNumbers]) : String);
            ticks = tickNumbers < 3 ? d3.extent(ticks) : ticks; 
            
            var subticks = d3c_dial_axisSubdivide(scale, ticks, tickSubdivide),
                subtick = d3Sel.selectAll(CN.FN.tick + CN.FN.minor).data(subticks, String),
                minorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.minor.stroke, chartContext).value, 'stroke-opacity': tickOpts.minor.strokeOpacity, 'stroke-width': tickOpts.minor.strokeWidth},
                subtickEnter = subtick.enter().insert('line', CN.FN.tick).attr('class', CN.tick + ' ' + CN.minor).style(minorStrokeStyle),
                subtickExit = d3.transition(subtick.exit()).style({'stroke-opacity' : 1e-6}).remove(),
                subtickUpdate = d3.transition(subtick).style(minorStrokeStyle);
             
            var tick = d3Sel.selectAll(CN.FN.tick + CN.FN.major).data(ticks, String),
                majorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.major.stroke, chartContext).value, 'stroke-opacity': tickOpts.major.strokeOpacity, 'stroke-width': tickOpts.major.strokeWidth},
                tickEnter = tick.enter().insert('g', CN.FN.domain).attr('class', CN.tick + ' ' + CN.major),
                tickExit = d3.transition(tick.exit()).style('stroke-opacity', 1e-6).remove(),
                tickUpdate = d3.transition(tick),
                tickTransform = null;
            
            var path = d3Sel.selectAll(CN.FN.domain).data([0]),
                pathUpdate = (path.enter().append('path').attr('class', CN.domain), d3.transition(path));
            
            var scale1 = scale.copy(), scale0 = this.__chart__ || scale1;
            this.__chart__ = scale1;
            tickEnter.append('line').style(majorStrokeStyle);
            tickEnter.append('text');
            var tickLineEnter = tickEnter.select('line'),
                tickLineUpdate = tickUpdate.select('line').style(majorStrokeStyle),
                text = tick.select('text').text(tickLabelFormat),
                textEnter = tickEnter.select('text'),
                textUpdate = tickUpdate.select('text'),
                textTransform,
                t,
                majorY,
                minorY,
                labelY,
                labelFillStyles = {'fill': d3c_adaptFill(axisOpts.label.fill, chartContext).value, 'fill-opacity': axisOpts.label.fillOpacity || 1e-6};
            
            if (axisOpts.label.fill) {
                textEnter.style(labelFillStyles);
                textUpdate.style(labelFillStyles);
            }
            d3c_applyFontStyle(textEnter, axisOpts.label.font, chartContext);
            d3c_applyFontStyle(textUpdate, axisOpts.label.font, chartContext);
            
            switch (orient) {
            case 'out': {
                majorY = d3c_dial_axisTickYValues(tickOpts.major, tickMajorSize, 0);
                minorY = d3c_dial_axisTickYValues(tickOpts.minor, tickMinorSize, 0);
                // Calculate label y coordinate and adjust label position property of label options.
                labelY = d3c_dial_axisLabelYVaue(labelOpts, orient, tickOpts.major.style, tickOpts.major.size, tickPadding, 0);
                
                tickTransform = d3c_dial_axisTransform;
                tickLineEnter.attr('y1', majorY[0]).attr('y2', majorY[1]);
                tickLineUpdate.attr('y1', majorY[0]).attr('x2', 0).attr('y2', majorY[1]);
                subtickEnter.attr('y1', minorY[0]).attr('y2', minorY[1]);
                subtickUpdate.attr('y1', minorY[0]).attr('x2', 0).attr('y2', minorY[1]);
                pathUpdate.attr('fill-opacity', 1e-6).attr('d', d3.svg.arc().startAngle(extent[0]).endAngle(extent[1]).innerRadius(innerRadius).outerRadius(radius));
                
                if (normalize) {
                    textTransform = (labelOpts.position === 'above') ? d3c_dial_textTransformNormalizeOut : d3c_dial_textTransformNormalizeIn;
                    textEnter.call(textTransform, scale0, labelY);
                    textUpdate.call(textTransform, scale1, labelY);
                    text.attr('class', 'unselectable').attr('dy', '0em');
                } else {
                    textEnter.attr('y', labelY);
                    textUpdate.attr('x', 0).attr('y', labelY);
                    text.attr('class', 'unselectable').attr('dy', labelOpts.position === 'above' ? '1.3em' : '.5em').style('text-anchor', 'middle');
                }

                break;
            }
            case 'in': {
                t = radius - innerRadius,
                majorY = d3c_dial_axisTickYValues(tickOpts.major, tickMajorSize, t);
                minorY = d3c_dial_axisTickYValues(tickOpts.minor, tickMinorSize, t);
                // Calculate label y coordinate and adjust label position property of label options.
                labelY = d3c_dial_axisLabelYVaue(labelOpts, orient, tickOpts.major.style, tickMajorSize, tickPadding, t);
                
                tickTransform = d3c_dial_axisTransform;
                tickLineEnter.attr('y1', majorY[0]).attr('y2', majorY[1]);
                tickLineUpdate.attr('y1', majorY[0]).attr('x2', 0).attr('y2', majorY[1]);
                subtickEnter.attr('y1', minorY[0]).attr('y2', minorY[1]);
                subtickUpdate.attr('y1', minorY[0]).attr('x2', 0).attr('y2', minorY[1]);
                pathUpdate.attr('fill-opacity', 1e-6).attr('d', d3.svg.arc().startAngle(extent[0]).endAngle(extent[1]).innerRadius(innerRadius).outerRadius(radius));
                
                if(normalize) {
                    textTransform = (labelOpts.position === 'above') ? d3c_dial_textTransformNormalizeOut : d3c_dial_textTransformNormalizeIn;
                    textEnter.call(textTransform, scale0, labelY),
                    textUpdate.call(textTransform, scale1, labelY),
                    text.attr('class', 'unselectable');
                } else {
                    textEnter.attr('y', labelY);
                    textUpdate.attr('x', 0).attr('y', labelY);
                    text.attr('class', 'unselectable').attr('dy', labelOpts.position === 'above' ? '1.3em' : '.5em').style('text-anchor', 'middle');
                }
                break;
            }
            }
            
            var r = radius;
            if (scale.rangeBand) {
                var dx = scale1.rangeBand() / 2,
                    x = function (d) {
                        return scale(d) + dx;
                    };
                tickEnter.call(tickTransform, x, r);
                tickUpdate.call(tickTransform, x, r);
            } else {
                tickEnter.call(tickTransform, scale0, r);
                tickUpdate.call(tickTransform, scale1, r);
                tickExit.call(tickTransform, scale1, 4);
                subtickEnter.call(tickTransform, scale0, r);
                subtickUpdate.call(tickTransform, scale1, r);
                subtickExit.call(tickTransform, scale1, r);
            }

            // Remove hidden label.
            ticks[0] = (tickOpts.showStartTickLabel === false) ? text.remove : ticks[0]; 
            ticks[ticks.length - 1] = (tickOpts.showEndTickLabel === false) ? null : ticks[ticks.length - 1];
            text.data(ticks, String).exit().remove();
            
        })();
    },
    fScale: function () {
        if (!arguments.length) {
            return this.scale;
        } else {
            this.scale = arguments[0];
            return this.fApplyChange(this.fScale);
        }
    }
});

function d3c_dial_extent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
}
function d3c_dial_scaleExtent(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3c_dial_extent(scale.range());
}
function d3c_dial_scaleRange(scale) {
    var extent = d3c_dial_scaleExtent(scale);
    var range = scale.range();
    return range[0] < range[range.length - 1] ? [ extent[0], extent[1] ] : [ extent[1], extent[0] ];
}
function d3c_dial_convert(scale, x) {
    var d = scale(x);
    isNaN(d) ? d = d3c_dial_scaleRange(scale)[0] : d;
    return scale.rangeBand ? d + scale.rangeBand() / 2 : d;
}
function d3c_dial_invert(scale, x) {
    if(scale.invert) return scale.invert(x);

    var l = scale.domain().length;
    var range = d3c_dial_scaleRange(scale);
    var band = (range[1] - range[0]) / l;
    var index = Math.floor((x - range[0]) / band);
    return scale.domain()[index < l ? index : l-1];

}
var d3c_dial_axisDefaultOrient = "out", d3c_dial_axisOrients = {
    'in': 1,
    'out': 1
};

function d3c_dial_axisTransform(selection, x, r) {
    selection.attr("transform", function(d) {
        return "translate(" + r * Math.sin(x(d)) + "," + -r * Math.cos(x(d)) + ") rotate("+ 180 / Math.PI * x(d) +")";
    });
}
function d3c_dial_textTransformNormalizeOut(selection, x, dr) {
    selection.attr("transform", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            return "rotate("+ -180 / Math.PI * a + ")" + "translate(" + -dr * Math.sin(a) + "," + dr * Math.cos(a) + ")";
        })
        .style("text-anchor", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            a = a < -Math.PI ? a += 2*Math.PI : a > Math.PI ? a -= 2*Math.PI : a;
            return a > -19*Math.PI/20 && a < -Math.PI/20 ? "end" : a < 19*Math.PI/20 && a > Math.PI/20 ? "start" : "middle";
        })
        .style("baseline-shift", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            return -80 * Math.pow(Math.sin(Math.abs(a/2)), 2) + "%";
        });
}

function d3c_dial_textTransformNormalizeIn(selection, x, dr) {
    selection.attr("transform", function(d) {
        var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
        return "rotate("+ -180 / Math.PI * a + ")" + "translate(" + -dr * Math.sin(a) + "," + dr * Math.cos(a) + ")";
        })
        .style("text-anchor", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            a = a < -Math.PI ? a += 2*Math.PI : a > Math.PI ? a -= 2*Math.PI : a;
            return a > -7*Math.PI/8 && a < -Math.PI/8 ? "start" : a < 7*Math.PI/8 && a > Math.PI/8 ? "end" : "middle";
        })
         .style("baseline-shift", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            return -100 * Math.pow(Math.cos(Math.abs(a/2)), 3) + "%";
        });
}

function d3c_dial_axisSubdivide(scale, ticks, m) {
    var subticks = [];
    if (m && ticks.length > 1) {
        var extent = d3c_dial_extent(scale.domain()), i = -1, n = ticks.length, d = (ticks[1] - ticks[0]) / ++m, j, v;
        while (++i < n) {
            for (j = m; --j > 0; ) {
                if ((v = +ticks[i] - j * d) >= extent[0]) {
                    subticks.push(v);
                }
            }
        }
        for (--i, j = 0; ++j < m && (v = +ticks[i] + j * d) < extent[1]; ) {
            subticks.push(v);
        }
    }
    return subticks;
}

function d3c_dial_axisTickYValues(_tickOpts, _tickSize, _offset) {
    return [(_tickOpts.style === 'cross') ? _offset - _tickSize : _offset,
             (_tickOpts.style === 'above') ? (_offset - _tickSize) : (_offset + _tickSize)];
}

function d3c_dial_axisLabelYVaue(_labelOpts, _orient, _tickStyle, _tickSize, _tickPadding, _offset) {
    var opts = _labelOpts;
    if (opts.position === 'same') {
        opts.position = _tickStyle;
    } else if (opts.position === 'opposite') {
        opts.position = (_tickStyle === 'below') ? 'above' : 'below';
    } 
    if (opts.position === 'cross') {
        opts.position = (_orient === 'in') ? 'below' : 'above';
    }
    
    if (opts.position === 'above') {
        return -Math.max(_tickSize, 0) - _tickPadding + (_orient === 'in' ? _offset : 0);
    } else  { // Should be below
        return Math.max(_tickSize, 0) + _tickPadding + (_orient === 'in' ? _offset : 0);
    } 
}/**
 * 
 */
var DefaultLinearSeriesOptions = {
    type : 'linear',
//    x : 0,
//    y : 0,
//    width : 0,
//    height : 0,
    round: 0, // round radius of four corners.
    axisIndex: 0,
//    fill : '',
    fillOpaticy : 1e-6,
    border : {},
    axisIndex: 0
//    ,
//    data: { // Array
//        value: 0,
//        markerPosition: 'below', // below or above
//        marker: {
//            enabled: true,
//            type: 'circle',
//            size: 10,
//            fill: 'white',
//            fillOpacity: 1,
//            border: {
//                
//            },
//            
//            markerPosition: 'below',
//            marker: {
//                
//            }
//        },
//        labelPosition: 'below',
//        label: {
//            enabled: true,
//            text:'',
//            font:{
//                fill: 'black',
//                fillOpacity: 1,
//                textAnchor: 'middle', // start/middle/end
//            },
//            fill: 'white',
//            fillOpacity: 1e-6,
//            border: {},
//        }
//    ,
//    line : {
//        enabled: false,
//        stroke: 'yellow',
//        strokeWidth:1,
//        strokeOpacity:1
//    }
//    }
//    ,
//    ranges : { // Array
//        enabled: true,
//        type: 'line', // line or range
////        x1: 0,
////        x2: 0,
//        //y1: 0,
//        //y2: 0,
//        fill: 'black',
//        fillOpacity: 1,
//        border: {},
//        labelPosition: 'below', // above, below
//        label: {
//            enabled: false,
//        },
//        markerPosition: 'below', // above, below
//        marker: { // Only enabled for line band.
//            enabled: false,
//            type: 'circle',
//            size: 5,
//            border: {},
//            fill: 'white',
//            fillOpacity: 0
//        }
//    }
};

//Register dial series default options.
DefaultSeriesOptions.linearSeries = DefaultLinearSeriesOptions;

// Register dial series creator.
d3c_registerSeriesCreator('linear', function (_container, _chartContext, _opts) {
    // Copy corresponding axis.
    _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
    return new LinearSeries(_container, _chartContext, _opts);
});

var LinearClassNames = {
    linearSeries: 'linearSeires',
    border: 'border',
    bar: 'bar',
    ranges: 'ranges',
    range: 'range',
    pointer: 'pointer',
    marker: 'marker',
    axis: 'axis',
    tick: 'tick',
    major: 'major',
    minor: 'minor',
    label: 'label',
    title: 'title',
    subTitle: 'sutTitle'
}

var LinearSeries = d3c_extendClass(null, Element, {
    type: 'linear',
    _CLASS_NAMES: CN.linearSeries + ' ' + CN.series,
    eAxis: null,
    fInit: function () {
      this._super.fInit.apply(this, arguments);
    },
    _fRender : function () {
        var
        p = this._p,
        context = this.chartContext,
        opts = this.options,
        dataOpts = opts.data,
        rangesOpts = opts.ranges,
        axisOpts = opts.axis,
        bandsOpts = axisOpts.bands,
        x = opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        hasBands = bandsOpts && bandsOpts.length,
        hasRanges = rangesOpts && rangesOpts.length,
        gadgetBounds = {'x': x, 'y': y, 'width': w, 'height': h},
        d3Sel = null,
        eAxis = null,
        domain = d3c_calculateScaleDomain(axisOpts, rangesOpts, opts.data.map(function(d){return d.value;})),
        extent = d3.extent(domain),
        scale = d3.scale.linear().domain(domain).range([0, w]),
        bbox = null;
        
        // Create root selection.
        d3Sel = this.d3Sel = (this.d3Sel || this.eContainer.d3Sel.append('g').datum(opts).attr('class', this.fClassNames()));
        d3c_translate(d3Sel, x, y);
        
        d3Sel.attr('display', 'none');
        
        // 1. First render.
        // Render linear bar.
        p.sGadgetBorder = d3Sel.append('rect').attr('class', CN.border).attr({'x': gadgetBounds.x, 'y': gadgetBounds.y, 'width': gadgetBounds.width, 'height': gadgetBounds.height});
        opts.round ? p.sGadgetBorder.attr({'rx': opts.round, 'ry': opts.round}) : null;
        d3c_applyBorderStyle(p.sGadgetBorder, opts.border, opts, context);
        
        // Create bands group and render bands.
        if (hasBands) {
            p.sBands = d3Sel.selectAll(CN.FN.band).data(bandsOpts);
            p.sBandsUpdate = (p.sBands.enter().append('g').attr('class', CN.band), d3.transition(p.sBands));
            d3c_each(bandsOpts, function(_bandOpts) {
                _bandOpts.round = opts.round;
                return _bandOpts;
            });
            d3c_translate(p.sBandsUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createBands(p.sBandsUpdate, scale, gadgetBounds, context);
        }
        
        // Create ranges group and render ranges
        if (hasRanges) {
            p.sRanges = d3Sel.selectAll(CN.FN.range).data(rangesOpts);
            p.sRangesUpdate = (p.sRanges.enter().append('g').attr('class', CN.range), d3.transition(p.sRanges));
            d3c_translate(p.sRangesUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createRanges(p.sRangesUpdate, scale, gadgetBounds, context);
        }
        
        // Render axis.
        axisOpts.x = 0;
        axisOpts.y = (axisOpts.orient === 'top') ? 0 : h;
        axisOpts.width = w;
        eAxis = this.eAxis = new Axis(this, context, axisOpts);
        eAxis.fScale(scale);
        var axisUpdate = d3Sel.selectAll('.axis').data([axisOpts]).enter().append('g');
        d3c_translate(axisUpdate, 0, axisOpts.y);
        eAxis.fRender(axisUpdate);
        
        // Render data pointers
        p.sPointers = d3Sel.selectAll(CN.FN.pointer).data(dataOpts);
        p.sPointersUpdate = (p.sPointers.enter().append('g').attr('class', CN.pointer), d3.transition(p.sPointers));
        p.sPointersUpdate.each(function (pointerOpts, i) {
            var
            pointer = d3.select(this).call(d3c_createMarker, pointerOpts.marker, h, context),
            x = scale(pointerOpts.value),
            y = (pointerOpts.markerPosition === 'below') ? gadgetBounds.y + gadgetBounds.height : gadgetBounds.y,
            label;
            
            d3c_translate(pointer, x, y);
            if (pointerOpts.label && pointerOpts.label.enabled !== false) {
                label = d3c_createLabel(pointer, pointerOpts.label, pointerOpts.value, context);
                d3c_translate(label, 0, (pointerOpts.labelPosition === 'below') ? pointerOpts.marker.size / 2 : - (label.bbox().height + pointerOpts.marker.size / 2));
//                label.select('text').attr('dy', (data.position === 'below') ? '.3em' : '.7em');
            };
            
            // Create line
            if (pointerOpts.line && pointerOpts.line.enabled !== false) {
                var line = pointer.selectAll('line').data([pointerOpts.line]);
                line.enter().insert('line', CN.FN.marker).attr({'x1': 0, 'y1': 0, 'x2': 0, 'y2': (pointerOpts.markerPosition === 'below') ? -gadgetBounds.height : gadgetBounds.height});
                d3c_applyBorderStyle(line, pointerOpts.line, {}, context);
            } else {
                pointer.selectAll('line').remove();
            }
        });
        
        // 2. Compute bounds of plot bar.
        // Adjust border bounds and redraw axis, linear bar and data pointers.
        bbox = d3Sel.node().getBBox();
        gadgetBounds.x = bbox.x < 0 ? gadgetBounds.x + Math.abs(bbox.x) : gadgetBounds.x;
        gadgetBounds.width = bbox.width > gadgetBounds.width ? gadgetBounds.width - gadgetBounds.x - (bbox.width - gadgetBounds.width) : gadgetBounds.width;
        gadgetBounds.y = bbox.y < 0 ? gadgetBounds.y + Math.abs(bbox.y) : gadgetBounds.y;
        gadgetBounds.height = bbox.height > gadgetBounds.height ? gadgetBounds.height - gadgetBounds.y - (bbox.height - gadgetBounds.height) : gadgetBounds.height;
        
        // Re-render axis, linear bar and data pointers.
        p.sGadgetBorder.attr({'x': gadgetBounds.x, 'y': gadgetBounds.y, 'width': gadgetBounds.width, 'height': gadgetBounds.height});
        
        // adjust axis.
        eAxis.fOptions().x = gadgetBounds.x; 
        eAxis.fOptions().y = (axisOpts.orient === 'top') ? gadgetBounds.y : gadgetBounds.y + gadgetBounds.height;
        eAxis.fOptions().width = gadgetBounds.width;
        scale.range([gadgetBounds.x, gadgetBounds.x + gadgetBounds.width]);
        eAxis.fRedraw();
        d3c_translate(axisUpdate, eAxis.fOptions().x, eAxis.fOptions().y);
        
        // adjust pointers.
        p.sPointersUpdate.each(function (pointerOpts, i) {
            d3c_translate(d3.select(this), scale(pointerOpts.value), (pointerOpts.markerPosition === 'below') ? gadgetBounds.y + gadgetBounds.height : gadgetBounds.y);
            d3.select(this).select('line').attr({'x1': 0, 'y1': 0, 'x2': 0, 'y2': (pointerOpts.markerPosition === 'below') ? -gadgetBounds.height : gadgetBounds.height});
        });
        
        // adjust bands.
        if (hasBands) {
            p.sBands = d3Sel.selectAll(CN.FN.band).data(bandsOpts);
            p.sBandsUpdate = (p.sBands.enter().append('g').attr('class', CN.band), d3.transition(p.sBands));
            d3c_each(bandsOpts, function(_bandOpts) {
                _bandOpts.round = opts.round;
                return _bandOpts;
            });
            d3c_translate(p.sBandsUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createBands(p.sBandsUpdate, scale, gadgetBounds, context);
        }
        // adjust ranges.
        if (hasRanges) {
            p.sRanges = d3Sel.selectAll(CN.FN.range).data(rangesOpts);
            p.sRangesUpdate = (p.sRanges.enter().append('g').attr('class', CN.range), d3.transition(p.sRanges));
            d3c_translate(p.sRangesUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createRanges(p.sRangesUpdate, scale, gadgetBounds, context);
        }
        this.fTransition();
    },
    fTransition: function () {
        var scale = this.eAxis.fScale(),
            opts = this.eAxis.options;
        this.d3Sel.attr('display', 'block');
        this.fPointer().each(function (_d, i) {
            var
            _this = d3.select(this),
            tran = _this.attr('transform'),
            xy = tran && _this.attr('transform').match(/([\+-]?[0-9\.]+)/g);
            
            if (xy && xy.length > 1) {
                _this.call(d3c_translate, scale(0), parseInt(xy[1])).transition().duration(1000).call(d3c_translate, scale(_d.value), parseInt(xy[1]));
            }
        });
    },
    fPointer: function(i) {
        if (arguments.length && d3c_isNumber(arguments[0])) {
            return this._p.sPointers && d3.select(this._p.sPointers[0][arguments[0]]);
        }
        return this._p.sPointers;
    },
    fMovePointer: function (i, _pointValue) {
        var pointerUpdate =this.fPointer(i),
            transXY = d3c_translate(pointerUpdate);
        if (transXY.length) {
            pointerUpdate.transition().duration(1000).call(d3c_translate, this.eAxis.fScale()(_pointValue), transXY[0].y);
        }
    }
});/**
 * 
 */

var DefaultBulletSeriesOptions = {
    type : 'bullet',
//    x : 0,
//    y : 0,
//    width : 0,
//    height : 0,
    margin: {
        top: 10,
        bottom:10,
        left:10,
        right:10
    },
    orient : 'horizontal', //Horizontal or vertical.
//    title:{ // Other is same with label
////        enabled: true,
//        x: 0,
//        y: 0,
//        anchor:'end', 
//    },
//    subtitle:{
////        enabled: true,
//        x: 0,
//        y: 0,
//        anchor:'end'
//    },
//    fill : '',
    fillOpacity : 1e-6,
//    border : {},
    axisIndex : 0
//    ranges : [{
//        
//    }],
//    data : [{
//        value: 0,
//        size: '30%', // The measure size in bullet, it may be percent value relative to bullet width or absolute number.
////        fill:
//        fillOpacity: 1,
////        border : {}
//        labelPosition: 'outside', // Indicate the value label shows in measure bar or inside or outside
//        label: {} 
//    ,
//    line : {
//        enabled: false,
//        stroke: 'yellow',
//        strokeWidth:1,
//        strokeOpacity:1
//    }
//    }], // Array
//    targets : [{ // properties are same with data
//        value: 0,
//        size: '60%',
//        width: 5,
////      fill:
//        fillOpacity: 1,
////        border : {},
//    }], 
};

//Register dial series default options.
DefaultSeriesOptions.bulletSeries = DefaultBulletSeriesOptions;
DefaultTargetsOptions.bulletSeries = { // properties are same with data
    size: '60%',
    width: 5,
    fill: 'black',
    fillOpacity: 1
};
DefaultRangesOptions.bulletSeries = {
    type: 'range', // line or range
    fill: 'black',
    fillOpacity: 1
};

// Register dial series creator.
d3c_registerSeriesCreator('bullet', function (_container, _chartContext, _opts) {
    // Copy corresponding axis.
    _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
    return new BulletSeries(_container, _chartContext, _opts);
});

var BulletSeries = d3c_extendClass(null, Element, {
    type: 'bullet',
    _CLASS_NAMES: CN.bulletSeries + ' ' + CN.series,
    scale: null,
    eAxis: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.scale = d3.scale.linear();
        return this;
    },
    _fRender: function (g) {
        var
        _this = this,
        p = this._p,
        context = this.chartContext,
        opts = this.options,
        titleOpts = opts.title,
        subtitleOpts = opts.subtitle,
        rangesOpts = opts.ranges,
        measuresOpts = opts.data,
        targetsOpts = opts.targets,
        axisOpts = opts.axis,
        axisOrient = axisOpts.orient,
        margin = d3c_adaptMargin(opts.margin),
        seriesOrient = opts.orient,
        x =  opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        domain = d3c_calculateScaleDomain(axisOpts, rangesOpts, opts.data.map(function(d){return d.value;})),
        extent = d3.extent(domain),
        scale = this.scale.domain(domain),
        isVertical = (seriesOrient === 'vertical'),
        isReverse = axisOpts.reverse,
        d3Sel = null;
        
        g = d3Sel = this.d3Sel = g || (function(){
            var sel = _this.eContainer.d3Sel.selectAll(d3c_classFilterNames(_this.fClassNames())).data([opts]);
            sel.enter().append('g').attr('class', _this.fClassNames());
            return sel;
        })();
     // Stash a snapshot of the new scale, and retrieve the old snapshot.
        
        g.each(function(d, i){
            var
            bbox = null,
            bounds = {'x': 0, 'y': 0, 'width': w || 0, 'height': h || 0},
            
            g = d3.select(this);
            g.attr('class') ? null : g.attr('class', this.fClassNames());

            // Process margin
            bounds.x = margin.left;
            bounds.y = margin.top;
            bounds.width -= (margin.left + margin.right);
            bounds.height -= (margin.top + margin.bottom);
            
            var
            titles = g.selectAll(CN.FN.title).remove().data([titleOpts, subtitleOpts]),
            titleUpdate = (titles.enter().append('g').attr('class', CN.title), titles.transition()),
            titleExit =  d3.transition(titles.exit()).style('opacity', 1e-6).remove(),
            title = null,
            subtitle = null,
            previousText;
            
            titleUpdate.each(function(d, i) {
                var g = d3.select(this);
                if (d && d.enabled !== false) {
                    d.anchor = isVertical ? 'middle' : (isReverse ? 'start' : 'end');

                    if (i === 0) {
                        // title.
                        title = new Label(_this, context, d);
                        g.attr('class', CN.title + ' '+ CN.major);
                        title.fRender(g);
                    } else {
                        // subtitle.
                        subtitle = new Label(_this, context, d);
                        g.attr('class', CN.title + ' '+ CN.minor);
                        subtitle.fRender(g);    
                    }
                }
            });
            
            bbox = titleUpdate.bbox(true);

            // Adjust bounds.
            if (isVertical) {
                bounds.y += isReverse ? 0 : bbox.height;
                bounds.height = bbox.height;
            } else {
                bounds.x += isReverse ? 0 : bbox.width;
                bounds.width -= bbox.width; 
            }
            
            // Set title translate.
            titleUpdate.each(function(d, i) {
                var sel = d3.select(this);
                if (isVertical) {
                    d3c_translate(sel, bounds.x + bounds.width / 2,  (bounds.y + (isReverse ? bounds.height : 0) + (previousText ? previousText.bbox().height : 0)));
                } else {
                    d3c_translate(sel, bounds.x + (isReverse ? bounds.width : 0) , bounds.y + (previousText ? previousText.bbox().height : 0));
                }
                previousText = sel;
            });
            
            function renderSeries(bounds, duration) {
                // Render plot.
                var
                series = g.selectAll(CN.FN.seriesPlot).data([opts]),
                seriesUpdate = (series.enter().append('g').attr('class', CN.seriesPlot).call(d3c_translate, bounds.x, bounds.y), series),
                plot = d3c_createBorder(seriesUpdate, opts, context).attr({'width': bounds.width, 'height': bounds.height}),
                b = d3c_copy(bounds);
                b.x = 0;
                b.y = 0;
                
                duration = duration || 1000;
                
                d3c_translate(plot, b.x, b.y);
                
                // Set scale range.
                scale.range(seriesOrient === 'vertical' ? [b.height, 0] : [0, b.width]);
                
                // Render ranges.
                if (rangesOpts && rangesOpts.length) {
                    var
                    rangesUpdate = seriesUpdate.selectAll(CN.FN.range).data(rangesOpts);
                    rangesUpdate.enter().append('g').attr('class', CN.range);
                    d3c_createRanges(rangesUpdate, scale, b, context);
                }
            
                // Render data(measures)
                var
                measuresUpdate = seriesUpdate.selectAll(CN.FN.measure).data(measuresOpts);
                measuresUpdate.enter().append('g').attr('class', CN.measure);
                measuresUpdate.sort(function c(a, b){
                    return b.value < a.value ? -1 : b.value > a.value ? 1 : 0;
                });
                p.measures = measuresUpdate;
                measuresUpdate.each(function(opts, i) {
                    var
                    g = d3.select(this),
                    size = d3c_adaptNumberOpt(opts.size || (isVertical ? b.width / 3 : b.height / 3), isVertical ? b.width : b.height),
                    asDot = opts.asDot || false,
                    rect = g.selectAll('rect').data([opts]),
                    rectUpdate = (rect.enter().append('rect'), rect),
                    scaleValue = scale(opts.value);
                    
                    if (isVertical) {
                        g.call(d3c_translate, b.width / 2, isReverse ? 0 : b.height);
                        rectUpdate
                        .attr('x', -size / 2)
                        .attr('y', isReverse ? 0 : -scaleValue)
                        .attr('width', size)
                        .attr('height', asDot ? size : scaleValue);
                    } else {
                        g.call(d3c_translate, isReverse ? b.width : 0, b.height / 2);
                        rectUpdate
                        .attr('x', 0)
                        .attr('y', - size / 2)
                        .attr('width', asDot ? size : 0 )
                        .attr('height', size)
                        .transition().duration(duration)
                        .attr('x', isReverse ? scaleValue - b.width : 0)
                        .attr('y', - size / 2)
                        .attr('width', asDot ? size : (isReverse ? b.width - scaleValue: scaleValue) )
                        .attr('height', size);
                    }
                    d3c_applyBorderStyle(rect, opts.border, opts, context);
                });
            
                // Render targets
                var
                targetsUpdate = seriesUpdate.selectAll(CN.FN.target).data(targetsOpts);
                targetsUpdate.enter().append('g').attr('class', CN.target);
                targetsUpdate.sort(function c(a, b){
                    return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
                });
                p.targets = targetsUpdate;
                targetsUpdate.each(function(opts, i) {
                    var
                    g = d3.select(this),
                    size = d3c_adaptNumberOpt(opts.size || (isVertical ? b.width / 3 : b.height / 3), isVertical ? b.width : b.height),
                    width = opts.width,
                    rect = g.selectAll('rect').data([opts]),
                    rectUpdate = (rect.enter().append('rect'), rect),
                    rangeValue = scale(opts.value)
                    
                    if (isVertical) {
                        g.call(d3c_translate, b.width / 2, isReverse ? 0 : b.height);
                        rectUpdate
                        .attr('x', b.width / 2)
                        .attr('y', isReverse ? rangeValue - width : -rangeValue + width)
                        .attr('width', size)
                        .attr('height', width);
                    } else {
                        g.call(d3c_translate, isReverse ? b.width : 0, b.height / 2);
                        rectUpdate
                        .transition().duration(duration)
                        .attr('x', isReverse ? rangeValue - b.width - width : rangeValue)
                        .attr('y', -size / 2)
                        .attr('width', width)
                        .attr('height', size);
                    }
                    d3c_applyBorderStyle(rect, opts.border, opts, context);
                });
                
                // Render Axis
                var
                eAxis = null,
                axisOrient = isVertical ? (axisOpts.orient === 'top' ? 'right' : (axisOpts.orient === 'bottom' ? 'left' : axisOpts.orient)) 
                        : (axisOpts.orient === 'left' ? 'bottom' : (axisOpts.orient === 'right' ? 'top' : axisOpts.orient));
                axisUpdate = seriesUpdate.selectAll(CN.FN.axis).data([axisOpts]);
                axisUpdate.enter().append('g').attr('class', CN.axis);
                axisUpdate.each(function(d, i){
                    var g = d3.select(this);
                    axisOpts.width = b.width;
                    axisOpts.height = b.height;
                    axisOpts.orient = axisOrient;   
                    eAxis = _this.eAXis = new Axis(_this, context, axisOpts);
                    eAxis.fScale(scale).fRender(g);
                    
                    g.call(d3c_translate, 
                          (axisOrient === 'right') ? b.width : 0,
                          (axisOrient === 'bottom') ? b.height : 0);
                });
                
                return seriesUpdate.bbox(true);
            }
            
            bbox = renderSeries(bounds, 0);
            if (bbox.x < 0 || bbox.y < 0 || bbox.width > bounds.width || bbox.height > bounds.height) {
                bounds.x += bbox.x < 0 ? Math.abs(bbox.x) : 0;
                bounds.y += bbox.y < 0 ? Math.abs(bbox.y) : 0;
                bounds.width = bounds.width * 2 - bbox.width;
                bounds.height = bounds.height * 2 - bbox.height;
                renderSeries(bounds, 1000);
            }
            
        });
        
        this.fTransition(g);
        
        p.scale = scale.copy();
        return this;
    },
    fTransition: function () {
        
    },
    fRedraw: function () {
        this.fRender(this.d3Sel);
    },
    fTarget : function(i) {
        if (arguments.length && d3c_isNumber(arguments[0])) {
            return this._p.targets && d3.select(this._p.targets[0][arguments[0]]);
        }
        return this._p.targets;  
    },
    fMoveTarget: function(i, value) {
        var
        targetUpdate =this.fTarget(i);
        
        if(targetUpdate) {
            var
            rect = targetUpdate.select('rect');
            x = parseInt(rect.attr('x')),
            newX = this.scale(value);
        
            if (x != newX) {
                rect.transition().duration(1000).attr('x', newX);
            }
        }
    },
    fMeasure: function(i) {
        if (arguments.length && d3c_isNumber(arguments[0])) {
            return this._p.measures && d3.select(this._p.measures[0][arguments[0]]);
        }
        return this._p.measures;
    },
    fChangeMeasure: function(i, value) {
        var
        measureUpdate =this.fMeasure(i);
        
        if(measureUpdate) {
            var
            rect = measureUpdate.select('rect');
            w = parseInt(rect.attr('width')),
            newW = this.scale(value);
        
            if (w != newW) {
                rect.transition().duration(1000).attr('width', newW);
            }
        }
    }
});/**
 * 
 */

var DefaultThermometerSeriesOptions = {
        type : 'thermometer',
        type : 'bullet',
//      x : 0,
//      y : 0,
//      width : 0,
//      height : 0,
      margin: {
          top: 10,
          bottom:10,
          left:10,
          right:10
      },
      fill : 'rgb(225, 225, 225)',
      fillOpacity : 1,
      border : {
          stroke: 'black',
          strokeWidth: 1,
          strokeOpacity: 1
      },
      axisIndex : 0,
      ballSize: '50%', // Percent value of thermometer.
      tubeSize: '20%', // Size of tube size.
      topRound : 0, // percentage value of number value, percentage value is relative to tubeSize.
//      data : [{
//          value: 0,
//          size: '30%', // The measure size in bullet, it may be percent value relative to bullet width or absolute number.
////          fill:
//          fillOpacity: 1,
////          border : {}
//          labelPosition: 'outside', // Indicate the value label shows in measure bar or inside or outside
//          label: {} 
//      }], // Array
//      ranges: [{
//          
//      }]
}


//Register dial series default options.
DefaultSeriesOptions.thermometerSeries = DefaultThermometerSeriesOptions;
DefaultRangesOptions.thermometerSeries = {
  type: 'range', // line or range
  fill: 'black',
  fillOpacity: 1
};

//Register dial series creator.
d3c_registerSeriesCreator('thermometer', function (_container, _chartContext, _opts) {
  // Copy corresponding axis.
  _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
  return new ThermometerSeries(_container, _chartContext, _opts);
});

var ThermometerSeries = d3c_extendClass(null, Element, {
    type: 'thermometer',
    _CLASS_NAMES: CN.thermometerSeries + ' ' + CN.series,
    scale: null,
    eAxis: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.scale = d3.scale.linear();
        return this;
    },
    _fRender: function (g) {
        var
        _this = this,
        p = this._p,
        context = this.chartContext,
        opts = this.options,
        dataOpts = opts.data[0],
        labelOpts = dataOpts.label,
        rangesOpts = opts.ranges,
        axisOpts = opts.axis,
        x = opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        domain = null,
        extent = null,
        scale = this.scale,
        d3Sel = null,
        ballSize = d3c_adaptNumberOpt(opts.ballSize, w),
        tubeSize = d3c_adaptNumberOpt(opts.tubeSize, w),
        margin = d3c_adaptMargin(opts.margin),
        eAxis,
        delta0 = Math.acos(tubeSize / ballSize) * ballSize / 2,
        delta = ballSize / 2 - delta0;
        
        axisOpts.reverse = false;
        domain = d3c_calculateScaleDomain(axisOpts, rangesOpts, opts.data.map(function(d){return d.value;})),
        extent = d3.extent(domain),
        scale = this.scale.domain(domain);
        
        g = d3Sel = this.d3Sel = g || (function(){
            var sel = _this.eContainer.d3Sel.selectAll(d3c_classFilterNames(_this.fClassNames())).data([opts]);
            sel.enter().append('g').attr('class', _this.fClassNames());
            return sel;
        })();
        
        g.each(function(d, i){
            var
            bbox = null,
            b = {'x': 0, 'y': 0, 'width': w || 0, 'height': h || 0},
            
            g = d3.select(this);
            g.attr('class') ? null : g.attr('class', _this.fClassNames());

            // Process margin
            b.x = margin.left;
            b.y = margin.top;
            b.width -= (margin.left + margin.right);
            b.height -= (margin.top + margin.bottom);

            // Render label
            if (labelOpts) {
                var lOpts = d3c_clone(labelOpts);
                lOpts.text = dataOpts.value;
                lOpts.anchor = 'middle';
                var
                labelUpdate = g.selectAll(CN.FN.label).data([lOpts]);
                labelUpdate.enter().append('g').attr('class', CN.label);
                
                var label = new Label(_this, context, lOpts);
                label.fRender(labelUpdate);
                labelUpdate.call(d3c_translate, w / 2, b.y + b.height - labelUpdate.bbox().height);
                b.height -= labelUpdate.bbox().height;
            }
            
            function renderSeries(bounds, duration) {
            
                // Render thermometer ball and thermometer bar
                var
                b = bounds,
                tubeHeight = b.height - ballSize + delta,
                tubePath = 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' l' + 0 + ',' + (-tubeHeight) + ' l' + tubeSize + ',' + 0 + ' l' + 0 + ',' + tubeHeight,
                ballPath = 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' a' + ballSize / 2 + ',' + ballSize /2 + ' 0 1, 0 ' +  tubeSize + ',' + 0;
                seriesPlot = g.selectAll('.plotBorder').data([tubePath, ballPath]);
                seriesPlot.enter().append('path').attr('class', 'plotBorder');
                
                
                seriesPlot.each(function(d, i){
                    var
                    g = d3.select(this),
                    plotOpts = {'fill': d3c_thermometer_fillGradient(i == 0 ? 'tube' : 'ball', opts.fill), 'fillOpacity': opts.fillOpacity, 'border': d3c_copy(opts.border)};
                    g.attr('d', d).call(d3c_applyBorderStyle, plotOpts.border, plotOpts, context);
                });
                
                var
                axis = g.selectAll(CN.FN.axis).data([axisOpts]),
                axisUpdate = (axis.enter().append('g').attr('class', CN.axis), axis),
                ranges = axisUpdate.selectAll(CN.FN.range).data(rangesOpts),
                rangesUpdate = ranges.enter().append('g').attr('class', CN.range),
                axisHeight = tubeHeight - axisOpts.yOffset,
                range = [axisHeight, 0];
//                axisUpdate.call(d3c_translate, (w + tubeSize) / 2, bounds.y + bounds.height - ballSize);
                axisUpdate.call(d3c_translate, bounds.x + (bounds.width + tubeSize) / 2 + axisOpts.xOffset, bounds.y + axisOpts.yOffset);
                
                scale.range(range);
                
                // Render ranges
                rangesUpdate.each(function(rangeOpts, i) {
                    var
                    g = d3.select(this),
                    y1 = scale(rangeOpts.x1 || extent[0]),
                    y2 = scale(rangeOpts.x2 || extent[1]),
                    x1 = rangesOpts.y1 || 0,
                    width = rangesOpts.y2 ? (rangesOpts.y2 - x1) : (axisOpts.tick.minor && axisOpts.tick.minor.size) || (axisOpts.tick.major && axisOpts.tick.major.size / 2) || Math.min(5, tubeSize / 5),
                    rect = g.selectAll('rect').data([[y1, y2, width]]),
                    rectUpdate = (rect.enter().append('rect'), rect);
                    rectUpdate
                    .attr('x', 1)
                    .attr('y', y2)
                    .attr('width', width)
                    .attr('height', Math.abs(y2-y1))
                    .call(d3c_applyBorderStyle, rangeOpts.border, rangeOpts, context);
                });
                
                // Render axis
                axisOpts.orient = 'right';
                axisOpts.label.position = 'same';
                axisOpts.tick.major.style = 'right';
                axisOpts.width = b.width;
                axisOpts.height = axisHeight;
                if (axisOpts.tick.minor) {
                    axisOpts.tick.minor.style = 'rgiht'; 
                }
                eAxis = _this.eAxis = new Axis(_this, context, axisOpts);
                eAxis.fScale(scale);
                eAxis.fRender(axisUpdate);
                
                // Render data
                var
                data = dataOpts,
                ballFill = d3c_thermometer_fillGradient('ball', data.fill),
                tubeFill = d3c_thermometer_fillGradient('tube', data.fill),
                tubeUpdate = g.selectAll(CN.FN.scaleTube).data([0]),
                ballUpdate =  g.selectAll(CN.FN.scaleBall).data([0]),
                ballOpts = {'fill': ballFill, 'fillOpacity': data.fillOpacity, 'border': {'strokeOpacity': 0}},
                tubeOpts = {'fill': tubeFill, 'fillOpacity': data.fillOpacity, 'border': {'strokeOpacity': 0}},
                scaleValue = scale(data.value);
                
                tubeUpdate.enter().append('path')
//                .call(d3c_translate, w / 2, b.y + tubeHeight)
                .call(d3c_applyBorderStyle, tubeOpts.border, tubeOpts, context)
                .attr('d', 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' l' + 0 + ',' + 1 + ' l' + tubeSize + ',' + 0 + ' l' + 0 + ',' + 1)
                .transition().duration(duration)
                .attr('d', function(d, i) {
                    console.log(d + ', ' + i);
                    return 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' l' + 0 + ',' + -(b.height - scaleValue) + ' l' + tubeSize + ',' + 0 + ' l' + 0 + ',' + (b.height - scaleValue)
                });
                
                ballUpdate.enter().append('path')
                .call(d3c_applyBorderStyle, ballOpts.border, ballOpts, context)
                .attr('d', ballPath);
            }
            
            renderSeries(b, 5000);
//            bbox = renderSeries(b, 0);
//            if (bbox.x < 0 || bbox.y < 0 || bbox.width > b.width || bbox.height > b.height) {
//                b.x += bbox.x < 0 ? Math.abs(bbox.x) : 0;
//                b.y += bbox.y < 0 ? Math.abs(bbox.y) : 0;
//                b.width = b.width * 2 - bbox.width;
//                b.height = b.height * 2 - bbox.height;
//                renderSeries(b, 1000);
//            }
            
        });
        return this;
    },
    fRedraw: function () {
        this.fRender(this.d3Sel);
    }
});

function d3c_thermometer_fillGradient(type, fill) {
    var fillOpts = {};
    if (type === 'ball') {
        // ball
        fillOpts.type = 'radialGradient';
        fillOpts.parameters = ['50%', '50%', '50%', '50%', '50%'];
        fillOpts.stops = [{
            offset : '0%',
            stopColor : 'rgb(225, 225, 225)',
            stopOpacity : 1
        }, {
            offset : '100%',
            stopColor : fill,
            stopOpacity : 1
        }
        ];
    } else {
        // Tube
        fillOpts.type = 'linearGradient';
        fillOpts.parameters = 'L,R';
        fillOpts.stops = [{
            offset:'0%',
            stopColor:fill,
            stopOpacity:1,
        },{
            offset:'30%',
            stopColor:'rgb(225, 225, 225)',
            stopOpacity:1,
        },{
            offset:'100%',
            stopColor:fill,
            stopOpacity:1,
        }];
    }
    
    return fillOpts;
}

/**
 * New node file
 */
//var SimpleBarOpts = {
//    title:'',
//    subtitle:'',    
//      font:{},
//      subtitleFont:{},
//    fill:,
//    fillOpacity:,
//    border:{},
//    data:[{
//        x:'',
//        y:''
//    }],
//        categoryType: ''
//        categoryLabelFont:{},
//      seriesLabelFont:{},
//      xDataFormat:'',
//      yDataFormat:'',
//}
var SimpleBar = function(_chartContext) {
    var
    chartContext = _chartContext,
    h = null,
    w = null;
   
    function bar(g) {
        g.each(function(d, i){
            var
            g = d3.select(this),
            opts = d,
            data = opts.data,
            width = w || opts.width,
            height = h || opts.height,
            title = opts.title,
            xValue = d3c_seriesValues(data, 'x'),
            yValues = d3c_seriesValues(data, 'y'),
            minMaxY = [d3.min(yValues), d3.max(yValues)],
            y = d3.scale.linear().range([height, 0]);
            y.domain([0, minMaxY[1]]),
            barWidth = width / data.length,
            b = {'x': 0, 'y': 0, 'width': width, 'height': height};
            if (title) {
                var titleUpdate = g.selectAll(CN.FN.title).data([title]);
                titleUpdate.enter().append('text')
                    .attr('class', CN.title)
                    .attr('dy', '.8em')
                    .attr({'x': 0, 'y': 0})
                    .text(title),
                titleBBox = (d3c_applyFontStyle(titleUpdate, opts.font, chartContext), titleUpdate.bbox(true));
            }
            
            var
            subtitle = g.selectAll('.subtitle').data([minMaxY[0]]),
            subtitleLabel = opts.subtitle || (opts.yDataFormat ? opts.yDataFormat(minMaxY[0]) : minMaxY[0]) + ' - ' + (opts.yDataFormat ? opts.yDataFormat(minMaxY[1]) : minMaxY[1]),
            subtitleUpdate = subtitle.enter().append('text')
                .attr('class', '.subtitle')
                .attr('dy', '.8em')
                .attr({'x': 0, 'y': (titleBBox || {'height': height}).height})
                .text(subtitleLabel),
            subtitleBBox = (d3c_applyFontStyle(subtitleUpdate, opts.subtitleFont, chartContext), subtitleUpdate.bbox(true)),
            totalBBox = g.selectAll('.title, .subtitle').bbox(true);
            
            b.x = totalBBox.width;
            b.width -= totalBBox.width; 
            
            var
            barsGroup = g.selectAll('.barGroup').data([data]);
            barsGroup.enter().append('g').attr('class', 'barGroup');
            d3c_translate(barsGroup, b.x, b.y);
            barsGroup.exit().remove();
            barsGroup.each(function(d){
                var barsGroup = d3.select(this);
                barsUpdate = barsGroup.selectAll('.bar').data(d);
                barsUpdate.enter().append('g').attr('class', 'bar');
                barsUpdate.exit().remove;
                barsUpdate.each(function(d, i) {
                    var
                    g = d3.select(this).attr('transform', 'translate(' + (i * barWidth) + ',0)'),
                    dpUpdate = g.selectAll('.dataPoint').data([d]),
                    slUpdate = g.selectAll('.seriesLabel').data([d]);
                    clUpdate = g.selectAll('.categoryLabel').data([d]);
                    
                    dpUpdate.enter().append('rect').attr('class', 'dataPoint');
                    dpUpdate.exit().remove();
                    slUpdate.enter().append('text').attr('class', 'seriesLabel');
                    slUpdate.exit().remove();
                    clUpdate.enter().append('text').attr('class', 'categoryLabel');
                    clUpdate.exit().remove();
                    
                    clUpdate
                    .style('text-anchor', 'middle')
                    .attr("x", barWidth / 2)
                    .attr("y", height)
                    .attr("dy", "-.2em")
                    .text(adaptCategoryData(opts, d.x))
                    .call(d3c_applyFontStyle, opts.categoryLabelFont, chartContext);   
                    
                    var
                    clBBox = clUpdate.node().getBBox(),
                    newH = height - clBBox.height;
                    
                    dpUpdate.attr('y', newH)
                        .attr('height', 0)
                        .attr('width', barWidth - 1)
                        .call(d3c_applyBorderStyle, opts.border, opts, chartContext)
                        .transition().duration(1000)
                        .attr('y', y(d.y))
                        .attr('height', newH - y(d.y))
                        .style('fill', getFill.call(this, opts.fill, chartContext, d.y) );
                     slUpdate
                         .style('text-anchor', 'middle')    
                         .attr('transform', 'translate(' + (barWidth /2 ) + ',' + Math.min((y(d.y)+ 10), newH - 10) + ') rotate(-90)') 
                         .attr("x", 0)
                         .attr("y", 0)
                         .attr("dy", ".3em")
                         .text(opts.yDataFormat ? opts.yDataFormat(d.y) : d.y)
                         .call(d3c_applyFontStyle, opts.seriesLabelFont, chartContext);
                });
            });
            
            
        });
        return this;
    }
    
    bar.width = function() {
        if (!arguments.length) {
            return w;
        } else {
            w = arguments[0];
        }
        return bar;
    };
    
    bar.height = function() {
        if (!arguments.length) {
            return h;
        } else {
            h = arguments[0];
        }
        return bar;
    };
    
    function getFill(fill, context, y) {
        if (fill) {
            if (typeof fill === 'string') { 
                return d3c_adaptFill(fill, context); 
            } else if(typeof fill === 'function') {
                return fill.call(this, y, context);
            } 
        }
        return fill;
    }
    
    function adaptCategoryData(opts, value) {
        var d = value, t;
        if (opts.categoryType === 'date') {
            t = new Date();
            t.setTime(d);
            d = t;
        }
        return opts.xDataFormat ? opts.xDataFormat(d) : d;
    }
    
    return bar;
}

var SimpleBarCharts = function() {
    var
    data,
    x,
    y,
    width,
    height,
    chartContext,
    simpleBar,
    svg;
    
    function sbc(g) {
        svg = g.selectAll('svg').data([0]);
        svg.enter().append('svg')
            .attr('class', 'simpleBarChart')
            .attr({'x':x, 'y': y, 'width': width, 'height': height});
        
        chartContext = chartContext || new ChartContext(svg);
        var
        barCharts = svg.selectAll('.barChart').data(data),
        barHeight = height / data.length;
        barCharts.enter().append('g').attr('class', 'barChart');
        simpleBar = simpleBar || new SimpleBar(chartContext);
        simpleBar.width(width).height(barHeight);
        simpleBar(barCharts);
        barCharts.each(function(d, i){
            d3c_translate(d3.select(this), x, barHeight * i);
        });
    }
    
    sbc.data = function() {
        if (!arguments.length) {
            return data;
        } else {
            data = arguments[0];
        }
        return sbc;
    };
    
    sbc.bounds = function() {
        if (!arguments.length) {
            return {'x': x, 'y': y, 'width' : width, 'height': height};
        } else {
            x = arguments[0].x;
            y = arguments[0].y;
            width = arguments[0].width;
            height = arguments[0].height;
        }
        return sbc;
    };
    
    return sbc;
}/**
 * 
 */
d3charts = {
    ChartGlobal : CHART_GLOBAL,
    ClassNames : CN,
    ChartContext : ChartContext,
    Element : Element,
    LedLabel : LedLabel,
    Label : Label,
    Chart : Chart,
    Title : Title,
	Axis : Axis,
	ArcAxis : ArcAxis,
	Legend : Legend,
	Plot : Plot,
	DialSeries : DialSeries,
	LinearSeries : LinearSeries,
	BulletSeries : BulletSeries,
	ThermometerSeries: ThermometerSeries,
	api : {
	    clone: d3c_clone,
	    merge: d3c_merge,
	    translate: d3c_translate
	},
	SimpleBar: SimpleBar,
	SimpleBarCharts : SimpleBarCharts
};

window.d3charts = window.d3charts || d3charts;

})();