/* --------------------------------- The Main Step --------------------------------- */
//这是要渲染的数据，可以动态获得
var dataset = [1, 2, 3, 4];

//填充数据，通常要使用d3.layout提供的数据模板进行处理，然后用data()方法去填
var chart = d3.select('#testId')
        .selectAll('p')
        .data(dataset, function(d) { return d; });

//渲染视图，主要是下面2个方法
//data（）之后才可以调用的enter()方法，意思是有数据填充的那部分图表元素，通常去增加`append`元素
chart
.enter()
.append('p')
.text(function(d, i) {
    return [d, i];
})

//data（）之后才可以调用的exit()方法，意思是无法获得数据填充的那部分图表元素，通常要删除`remove`
chart.exit().remove();

/* --------------------------------- COMPLEX EXAMPLES --------------------------------- */

// Sunburst Partition

var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;
    color = d3.scale.category20c();


var svg = d3.select("#Sunburst").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

var partition = d3.layout.partition()
.sort(null)
.size([2 * Math.PI, radius * radius])
.value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

d3.json("https://raw.githubusercontent.com/EmilyQiRabbit/NodeCode/master/blockChain/flareData.json", function(error, root) {
  if (error) throw error;

  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .style("fill-rule", "evenodd")
      .each(stash);

  d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
        ? function() { return 1; }
        : function(d) { return d.size; };

    path
        .data(partition.value(value).nodes)
        .transition()
        .duration(1500)
        .attrTween("d", arcTween);
  });
});

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

d3.select(self.frameElement).style("height", height + "px");