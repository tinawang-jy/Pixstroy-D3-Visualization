import define1 from "./a33468b95d0b15b0@808.js";
import define2 from "./7a9e12f9fb3d8e06@498.js";

function _1(md){return(
md`# Are there correlations between the sporting events, or the entertainment events with dates?`
)}

function _weekday(Inputs){return(
Inputs.select(new Map([
  ["Sunday-based weeks", "sunday"],
]))
)}

function _3(md){return(
md`For comparison, here’s daily festival. Darker green indicates higher festival.`
)}

function _4(Calendar,dji,weekday,width){return(
Calendar(dji, {
  x: d => new Date(d.date),
  y: d => d.festival,
  weekday,
  width
})
)}

function _5(md){return(
md`For comparison, here’s daily sport_event. Darker green indicates higher sport_event.`
)}

function _6(Calendar,dji,weekday,width){return(
Calendar(dji, {
  x: d => new Date(d.date),
  y: d => d.sport_event,
  weekday,
  width
})
)}

function _7(md){return(
md`For comparison, here’s daily overall. Darker green indicates higher overall.`
)}

function _8(Calendar,dji,weekday,width){return(
Calendar(dji, {
  x: d => new Date(d.date),
  y: d => d.overall,
  weekday,
  width
})
)}

function _dji(FileAttachment){return(
FileAttachment("sport_event_festival.csv").csv({typed: true})
)}

function _dateadd(){return(
function dateadd(sdate, delta, ymdh){
 if(!sdate ) return;
    
 if(typeof sdate == 'object') sdate = sdate.toLocaleString();
   
 /(\d{4})[\D](\d{1,2})[\D](\d{1,2})[\D]?\s(\d{1,2}):(\d{1,2}):(\d{1,2})/.exec(sdate);
 var a = [0,0,0,0];
    
 switch(ymdh){
  case 'y':
   a = [delta, -1, 0, 0];
   break;
  case 'm':
   a=[0, delta-1, 0, 0];
   break;
  case 'H':
   a=[0, -1, 0, delta];
   break; 
  default:
   a = [0, -1, delta, 0];
   break;  
 }    
    
 return new Date(parseInt(RegExp.$1)+ a[0], parseInt(RegExp.$2)+a[1], parseInt(RegExp.$3)+a[2], parseInt(RegExp.$4)+a[3], RegExp.$5,RegExp.$6);
}
)}

function _convert2UTCdate(dateadd){return(
function convert2UTCdate(strdate){
  var sdate = new Date(strdate);
  var d1 = dateadd(sdate,1);
  var y = d1.getUTCFullYear();   
  var m = d1.getUTCMonth() ;
  var d = d1.getUTCDate();
  var h = d1.getUTCHours();
  var M = d1.getUTCMinutes();
  var s = d1.getUTCSeconds();
  var utc = Date.UTC(y,m,d,h,M,s);
  var d2 = new Date(utc);
  var localeDateString = d2.toLocaleDateString();
  return new Date(localeDateString);
}
)}

function _Calendar(d3){return(
function Calendar(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  title, // given d in data, returns the title text
  width = 928, // width of the chart, in pixels
  cellSize = 17, // width and height of an individual day, in pixels
  weekday = "monday", // either: weekday, sunday, or monday
  formatDay = i => "SMTWTFS"[i], // given a day number in [0, 6], the day-of-week label
  formatMonth = "%b", // format specifier string for months (above the chart)
  yFormat, // format specifier string for values (in the title)
  colors = d3.interpolatePiYG
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);

  const countDay = weekday === "sunday" ? i => i : i => (i + 6) % 7;
  const timeWeek = weekday === "sunday" ? d3.timeSunday : d3.timeMonday;
  const weekDays = weekday === "weekday" ? 5 : 7;
  const height = cellSize * (weekDays + 2);

  // Compute a color scale. This assumes a diverging color scheme where the pivot
  // is zero, and we want symmetric difference around zero.
  const max = d3.quantile(Y, 0.9975, Math.abs);
  const color = d3.scaleSequential([-max, +max], colors).unknown("none");

  // Construct formats.
  formatMonth = d3.timeFormat(formatMonth);

  // Compute titles.
  if (title === undefined) {
    const formatDate = d3.timeFormat("%B %-d, %Y");
    const formatValue = color.tickFormat(100, yFormat);
    title = i => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
  } else if (title !== null) {
    const T = d3.map(data, title);
    title = i => T[i];
  }

  // Group the index by year, in reverse input order. (Assuming that the input is
  // chronological, this will show years in reverse chronological order.)
  const years = d3.groups(I, i => X[i].getFullYear()).reverse();

  function pathMonth(t) {
    const d = Math.max(0, Math.min(weekDays, countDay(t.getDay())));
    const w = timeWeek.count(d3.timeYear(t), t);
    return `${d === 0 ? `M${w * cellSize},0`
        : d === weekDays ? `M${(w + 1) * cellSize},0`
        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${weekDays * 
  cellSize}`;
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height * years.length)
      .attr("viewBox", [0, 0, width, height * years.length])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key);

  year.append("g")
      .attr("text-anchor", "end")
    .selectAll("text")
    .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
    .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

  const cell = year.append("g")
    .selectAll("rect")
    .data(weekday === "weekday"
        ? ([, I]) => I.filter(i => ![0, 6].includes((new Date(X[i])).gettimeDay()))
        : ([, I]) => I)
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", i => timeWeek.count(d3.timeYear(X[i]), X[i]) * cellSize + 0.5)
      .attr("y", i => countDay((new Date(X[i])).getDay()) * cellSize + 0.5)
      .attr("fill", i => color(Y[i]));

  if (title) cell.append("title")
      .text(title);

  const month = year.append("g")
    .selectAll("g")
    .data(([, I]) => d3.timeMonths(d3.timeMonth(X[I[0]]), X[I[I.length - 1]]))
    .join("g");

  month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

  month.append("text")
      .attr("x", d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);

  return Object.assign(svg.node(), {scales: {color}});
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["sport_event_festival.csv", {url: new URL("./files/98ea2c4884742527463f1fbd1d31fe44604e4325dfc2e9fe2db7f833859ceb5e61ea18dff2945548b32767d1b565062759995ca4b8178e7f0b8156174bf2c4cb.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof weekday")).define("viewof weekday", ["Inputs"], _weekday);
  main.variable(observer("weekday")).define("weekday", ["Generators", "viewof weekday"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Calendar","dji","weekday","width"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["Calendar","dji","weekday","width"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["Calendar","dji","weekday","width"], _8);
  main.variable(observer("dji")).define("dji", ["FileAttachment"], _dji);
  main.variable(observer("dateadd")).define("dateadd", _dateadd);
  main.variable(observer("convert2UTCdate")).define("convert2UTCdate", ["dateadd"], _convert2UTCdate);
  main.variable(observer("Calendar")).define("Calendar", ["d3"], _Calendar);
  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  const child2 = runtime.module(define2);
  main.import("howto", child2);
  return main;
}
