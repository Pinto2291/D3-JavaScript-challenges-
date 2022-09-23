// Get the Data

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then((n) => n.json()).then((n) => {

  const data = n.data;
  
  // FUNCTION to return just the year
  let year = (n) => {
  return parseInt(n.split(/-/)[0])
  }

const minY = d3.min(data, (d) => d[1])
const maxY = d3.max(data, (d) => d[1])

const minX = d3.min(data, (d) => (d[0]));
const maxX = d3.max(data, (d) => (d[0]));

let date1 = new Date (minX)
let date2 = new Date (maxX)

const w = 1000;
const h = 500;
const padding = 30;
const barWidth = parseFloat(((w/data.length).toFixed(2)))

const xScale = d3.scaleTime()
  .domain([date1, date2])
  .range([0, w])

const yScale = d3.scaleLinear()
  .domain([0, maxY])
  .range([h, 0])

let general = d3.select('#data')
  .append('svg')
  .attr('width', w+padding*2)
  .attr('height', h+padding*2)
  .style('background-color', '#fff');

let tooltip = d3.select('#elements')
  .append('div')
  .attr('id', 'tooltip')
  .attr('class', 'tooltip')

general.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => (i*barWidth + 45))
  .attr('y', (d, i) => {return (i = h - d[1]*(h/maxY) + padding)})
  .attr('width', barWidth)
  .attr('height', (d) => d[1]*(h/maxY))
  .attr('class', 'bar')
  .attr('data-date', (d) => d[0])
  .attr('data-gdp', (d) => d[1])
  .on("mouseover", function(e, d) {  // THE MOUSEOVER 
    tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
        tooltip.html(`Year: ${d[0]} <br> and GDP: ${d[1]} Billions`)          
        .attr("data-date", d[0])
        .style('opacity', '1')
        .style("left", "350px")
        .style("top", "200px");
  })
  .on("mouseout", function(e, d){
    tooltip.transition()
           .duration(400)
           .style("opacity", 0);
    tooltip.attr("data-date", d[0]);
  });

  general.selectAll('rect')
  .append('title')
  .text((d, i) => `Element: ${i+1} - value: ${d[1]} - year: ${year(d[0])}`)
  .attr('data-date', (d) => d[0]);

const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
const yAxis = d3.axisLeft(yScale);

general.append('g').attr('transform', 'translate(45, 30)').call(yAxis).attr('id', 'y-axis').attr('class', 'tick');

general.append('g').attr('transform', 'translate(45, 530)').call(xAxis).attr('id', 'x-axis').attr('class', 'tick');

})