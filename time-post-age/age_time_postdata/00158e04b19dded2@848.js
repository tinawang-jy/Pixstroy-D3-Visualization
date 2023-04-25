import define1 from "./7a9e12f9fb3d8e06@498.js";
import define2 from "./a33468b95d0b15b0@808.js";

function _1(md){return(
md`# Does the time of day of the post matter?`
)}

function _key(Swatches,chart){return(
Swatches(chart.scales.color)
)}

function _chart(IndexChart,indices,width){return(
IndexChart(indices, {
  x: d => d.time_span,
  y: d => d.count,
  z: d => d.age_type,
  yLabel: "↑ count in time_span (×)",
  width,
  height: 600
})
)}

function _indices(FileAttachment){return(
FileAttachment("age_time_postdata.csv").csv({typed: true})
)}

function _date(Generators,chart){return(
Generators.input(chart)
)}

function _IndexChart(d3){return(
function IndexChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value for series
  defined, // for gaps in data
  curve = d3.curveLinear, // how to interpolate between points
  marginTop = 20, // top margin, in pixels
  marginRight = 40, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // the x-scale type
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  xFormat, // a format specifier string for the x-axis
  yType = d3.scaleLog, // the y-scale type
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat = "", // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  //formatDate = "%b %-d, %Y", // format specifier string for dates (in the title)
  colors = d3.schemeTableau10, // array of categorical colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));
  const Xs = d3.sort(I.filter(i => D[i]).map(i => X[i])); // for bisection later

  // Compute default y-domain.
  if (yDomain === undefined) {
    const r = I => d3.max(I, i => Y[i]) / d3.min(I, i => Y[i]);
    const k = d3.max(d3.rollup(I, r, i => Z[i]).values());
    yDomain = [1 / k, k];
  }

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange).interpolate(d3.interpolateRound);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(null, yFormat);

  // Construct formats.
  // formatDate = xScale.tickFormat(null, formatDate);

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y((i, _, I) => yScale(Y[i] / Y[I[0]]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .on("touchstart", event => event.preventDefault())
      .on("pointermove", pointermoved);

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove());

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("stroke-opacity", d => d === 1 ? null : 0.2)
          .attr("x2", width - marginLeft - marginRight))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const rule = svg.append("g");

  rule.append("line")
      .attr("y1", marginTop)
      .attr("y2", height - marginBottom - 15)
      .attr("stroke", "currentColor");

  const ruleLabel = rule.append("text")
      .attr("y", height - marginBottom - 15)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("dy", "1em");

  const serie = svg.append("g")
    .selectAll("g")
    .data(d3.group(I, i => Z[i]))
    .join("g");

  serie.append("path")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke", ([z]) => color(z))
      .attr("d", ([, I]) => line(I));

  serie.append("text")
      .attr("font-weight", "bold")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("x", ([, I]) => xScale(X[I[I.length - 1]]))
      .attr("y", ([, I]) => yScale(Y[I[I.length - 1]] / Y[I[0]]))
      .attr("dx", 3)
      .attr("dy", "0.35em")
      .text(([z]) => z)
    .clone(true)
      .attr("fill", ([z]) => color(z))
      .attr("stroke", null);

  function update(time_span) {
    time_span = Xs[d3.bisectCenter(Xs, time_span)];
    rule.attr("transform", `translate(${xScale(time_span)},0)`);
    // ruleLabel.text(formatDate(time_span));
    ruleLabel.text(time_span);
    serie.attr("transform", ([, I]) => {
      const i = I[d3.bisector(i => X[i]).center(I, time_span)];
      return `translate(0,${yScale(1) - yScale(Y[i] / Y[I[0]])})`;
    });
    svg.property("value", time_span).dispatch("input", {bubbles: true}); // for viewof
  }

  function pointermoved(event) {
    update(xScale.invert(d3.pointer(event)[0]));
  }

  update(xDomain[0]);

  return Object.assign(svg.node(), {scales: {color}, update});
}
)}

function _trigger(d3,chart,indices)
{
  d3.select(chart)
    .on("pointerenter", () => d3.select(chart).interrupt())
    .transition()
      .ease(d3.easeCubicOut)
      .duration(2000)
      .tween("time_span", () => {
        const i = d3.interpolateDate(...d3.extent(indices, d => d.time_span).reverse());
        return t => chart.update(i(t));
      });
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["age_time_postdata.csv", {url: new URL("./files/ac7818d5e706c97ba5cc39bb290b1cf4a7e364dce973c9191cacf5bb7d8000ab0b41b9f7a2cc9f63275068ceb7b1107ab1a71215c0f6bbdc355e688643bedb71.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("key")).define("key", ["Swatches","chart"], _key);
  main.variable(observer("chart")).define("chart", ["IndexChart","indices","width"], _chart);
  main.variable(observer("indices")).define("indices", ["FileAttachment"], _indices);
  main.variable(observer("date")).define("date", ["Generators","chart"], _date);
  main.variable(observer("IndexChart")).define("IndexChart", ["d3"], _IndexChart);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  main.import("altplot", child1);
  const child2 = runtime.module(define2);
  main.import("Swatches", child2);
  main.variable(observer("trigger")).define("trigger", ["d3","chart","indices"], _trigger);
  return main;
}
