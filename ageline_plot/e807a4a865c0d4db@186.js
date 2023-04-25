import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Topic Age Range by Country`
)}

function _chart(dataByCountry,d3,color,DOM,width,height,margin,createTooltip,y,getRect,getTooltipContent,axisTop,axisBottom)
{

  let filteredData;
    filteredData = [].concat.apply([], dataByCountry.map(d=>d.values));

  filteredData.forEach(d=> d.color = d3.color(color(d.Country)))

  let parent = this; 
  if (!parent) {
    parent = document.createElement("div");
    const svg = d3.select(DOM.svg(width, height));

    const g = svg.append("g").attr("transform", (d,i)=>`translate(${margin.left} ${margin.top})`);

    const groups = g
    .selectAll("g")
    .data(filteredData)
    .enter()
    .append("g")
    .attr("class", "civ")

    const tooltip = d3.select(document.createElement("div")).call(createTooltip);

    const line = svg.append("line").attr("y1", margin.top-10).attr("y2", height-margin.bottom).attr("stroke", "rgba(0,0,0,0.2)").style("pointer-events","none");

    groups.attr("transform", (d,i)=>`translate(0 ${y(i)})`)

    groups
      .each(getRect)
      .on("mouseover", function(d) {
      d3.select(this).select("rect").attr("fill", d.color.darker())

      tooltip
        .style("opacity", 1)
        .html(getTooltipContent(d))
    })
      .on("mouseleave", function(d) {
      d3.select(this).select("rect").attr("fill", d.color)
      tooltip.style("opacity", 0)
    })

    svg
      .append("g")
      .attr("transform", (d,i)=>`translate(${margin.left} ${margin.top-10})`)
      .call(axisTop)

    svg
      .append("g")
      .attr("transform", (d,i)=>`translate(${margin.left} ${height-margin.bottom})`)
      .call(axisBottom)

    svg.on("mousemove", function(d) {

      let [x,y] = d3.mouse(this);
      line.attr("transform", `translate(${x} 0)`);
      y +=20;
      if(x>width/2) x-= 100;

      tooltip
        .style("left", x + "px")
        .style("top", y + "px")
    })

    parent.appendChild(svg.node());
    parent.appendChild(tooltip.node());
    parent.groups = groups;

  } else {

    const civs = d3.selectAll(".civ")

    civs.data(filteredData, d=>d.Interest)
      .transition()
      // .delay((d,i)=>i*10)
      .ease(d3.easeCubic)
      .attr("transform", (d,i)=>`translate(0 ${y(i)})`)

  }
  return parent

}


function _getTooltipContent(){return(
function(d) {
return `<b>${d.Interest}</b>
<br/>
<b style="color:${d.color.darker()}">${d.Country}</b>
<br/>
${d.min} - ${d.max}
`
}
)}

function _height(){return(
1300
)}

function _y(d3,data,height,margin){return(
d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0,height - margin.bottom - margin.top])
    .padding(0.2)
)}

function _x(d3,data,width,margin){return(
d3.scaleLinear()
      .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
      .range([0, width - margin.left - margin.right - 50])
)}

function _margin(){return(
{top: 30, right: 30, bottom: 30, left: 30}
)}

function _createTooltip(){return(
function(el) {
  el
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("top", 0)
    .style("opacity", 0)
    .style("background", "white")
    .style("border-radius", "5px")
    .style("box-shadow", "0 0 10px rgba(0,0,0,.25)")
    .style("padding", "10px")
    .style("line-height", "1.3")
    .style("font", "11px sans-serif")
}
)}

function _getRect(d3,x,width,y){return(
function(d){
  const el = d3.select(this);
  const sx = x(d.min);
  const w = x(d.max) - x(d.min);
  const isLabelRight =(sx > width/2 ? sx+w < width : sx-w>0);

  el.style("cursor", "pointer")

  el
    .append("rect")
    .attr("x", sx)
    .attr("height", y.bandwidth())
    .attr("width", w)
    .attr("fill", d.color);

  el
    .append("text")
    .text(d.Interest)
    .attr("x",isLabelRight ? sx-5 : sx+w+5)
    .attr("y", 2.5)
    .attr("fill", "black")
    .style("text-anchor", isLabelRight ? "end" : "start")
    .style("dominant-baseline", "hanging");
}
)}

function _dataByInterest(d3,data){return(
d3.nest().key(d=>d.Interest).entries(data)
)}

function _dataByCountry(d3,data){return(
d3.nest().key(d=>d.Country).entries(data)
)}

function _axisBottom(d3,x){return(
d3.axisBottom(x)
    .tickPadding(2)
)}

function _axisTop(d3,x){return(
d3.axisTop(x)
    .tickPadding(2)
)}

function _d3(require){return(
require("d3@5")
)}

function _region_interest2(FileAttachment){return(
FileAttachment("Region_Interest@2.json").json()
)}

function _json(FileAttachment){return(
FileAttachment("Region_Interest@2.json").json()
)}

function _data(json){return(
json.map(d=>{
return {
  ...d,
  start: +d.min,
  end: +d.max
}
}).sort((a,b)=>  a.start-b.start)
)}

function _countries(d3,data){return(
d3.nest().key(d=>d.Country).entries(data).map(d=>d.key)
)}

function _interests(d3,data){return(
d3.nest().key(d=>d.Interest).entries(data).map(d=>d.key)
)}

function _color(d3,countries){return(
d3.scaleOrdinal(d3.schemeSet2).domain(countries)
)}

function _22(html){return(
html`CSS<style> svg{font: 11px sans-serif;}</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Region_Interest@2.json", {url: new URL("./files/2b4f9f6adf0185ad09893deca7b39b5e3d74c0657164ee29d34e6febbd77abef3267d506d34dc8b5dcc707bc8c2aef7374fd0906a7bfa8357da4c77653fede27.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["dataByCountry","d3","color","DOM","width","height","margin","createTooltip","y","getRect","getTooltipContent","axisTop","axisBottom"], _chart);
  main.variable(observer("getTooltipContent")).define("getTooltipContent", _getTooltipContent);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], _y);
  main.variable(observer("x")).define("x", ["d3","data","width","margin"], _x);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("createTooltip")).define("createTooltip", _createTooltip);
  main.variable(observer("getRect")).define("getRect", ["d3","x","width","y"], _getRect);
  main.variable(observer("dataByInterest")).define("dataByInterest", ["d3","data"], _dataByInterest);
  main.variable(observer("dataByCountry")).define("dataByCountry", ["d3","data"], _dataByCountry);
  main.variable(observer("axisBottom")).define("axisBottom", ["d3","x"], _axisBottom);
  main.variable(observer("axisTop")).define("axisTop", ["d3","x"], _axisTop);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("region_interest2")).define("region_interest2", ["FileAttachment"], _region_interest2);
  main.variable(observer("json")).define("json", ["FileAttachment"], _json);
  main.variable(observer("data")).define("data", ["json"], _data);
  main.variable(observer("countries")).define("countries", ["d3","data"], _countries);
  main.variable(observer("interests")).define("interests", ["d3","data"], _interests);
  main.variable(observer("color")).define("color", ["d3","countries"], _color);
  const child1 = runtime.module(define1);
  main.import("checkbox", child1);
  main.import("select", child1);
  main.variable(observer()).define(["html"], _22);
  return main;
}
