let margin = {
    top: 60,
    right: 160,
    bottom: 30,
    left: 50
  },
  width = 1100 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

d3.csv("population_prospects.csv", (error, data) => {


  let grouped = {}, types = [];
  data.forEach(d => {
    if (d.type in grouped) {
      grouped[d.type].push([parseInt(d.year), parseInt(d.population)]);
    } else {
      grouped[d.type] = [[parseInt(d.year), parseInt(d.population)]];
    }
    if (!types.includes(d.type)) types.push(d.type);
  });

  let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  let x = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.year)), d3.max(data.map(d => d.year))])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis")
    .call(d3.axisBottom(x)
      .tickValues([1950, 1991, 2020, 2100])
      .tickPadding(10)
      .tickSize(-height)
      .tickFormat(t => t.toString()))
    .select('.domain').remove();

  let yPopulation = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.population)), d3.max(data.map(d => d.population))])
    .range([height, 0]);
  svg.append("g")
    .attr("class", "axis")
    .call(
      d3.axisLeft(yPopulation)
        .ticks()
        .tickSize(-width - 10)
        .tickPadding(10)
        .tickFormat(d => d / 1000)
    ).select('.domain').remove();

  svg.append('g')
    .append("text")
    .attr("x", width * 0.25 - 50)
    .attr("y", -10)
    .attr("font-family", "Ubuntu Mono")
    .attr("fill", "#3288bd")
    .text("estimate");

  svg.append('g')
    .append("text")
    .attr("x", width * 0.75)
    .attr("y", -10)
    .attr("font-family", "Ubuntu Mono")
    .attr("fill", "#d53e4f")
    .text("projection");


  types.forEach(type => {
    svg
      .append("text")
      .attr("x", width + 10)
      .attr("y",
        type === "zero migration" ?
          yPopulation(grouped[type][grouped[type].length - 1][1]) + 15 :
          yPopulation(grouped[type][grouped[type].length - 1][1]))
      .attr("stroke", type.includes("variant") ? "#d53e4f" : "#5D646F")
      .text(type === "estimate" ? "" : type);
    svg
      .append("path")
      .datum(grouped[type])
      .attr("fill", "none")
      .attr("stroke", type === "estimate" ? "#3288bd" : "#d53e4f")
      .attr("stroke-dasharray", type === "estimate" ? 0 : 6, 2)
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => x(d[0]))
        .y(d => yPopulation(d[1]))
      )

  });


});
