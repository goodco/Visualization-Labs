import * as d3 from 'https://unpkg.com/d3?module';

let dt;

const draw = async() => {
    await d3.csv("wealth-health-2014.csv", d3.autoType)
    .then(data => dt = data)
    
    const margin = ({top: 30, right: 30, bottom: 30, left: 30})
    
    const width =  window.innerWidth - 200 - margin.left - margin.right
    ,height = window.innerHeight - 100 - margin.top - margin.bottom

    
    const xScale = d3
        .scaleLog()
        .domain(d3.extent(dt.map(d => d.Income)))
        .range([0, width])
    
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(dt.map(d => d.LifeExpectancy)))
        .range([height, 0])

    const popScale = d3
        .scaleLinear()
        .domain(d3.extent(dt.map(d => d.Population)))
        .range([10, 40])

    const regionScale = d3.scaleOrdinal()
        .domain(new Set(dt.map(d => d.Region)))
        .range(d3.schemeTableau10)

    let svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
          .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    let circles = svg.selectAll("circle")
        .data(dt)
        .enter()
        .append("circle")
            .attr("cx", d => xScale(d.Income))
            .attr("cy", d => yScale(d.LifeExpectancy))
            .attr("r", d => popScale(d.Population))
            .attr("fill", d => regionScale(d.Region))
            .style("opacity", 0.75);

    
    const xAxis = d3.axisBottom()
        .scale(xScale)
    
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "axis x-axis")
        .call(xAxis);
    
        const yAxis = d3.axisLeft()
        .scale(yScale)
    
    svg.append("g")
        .attr("class", "axis x-axis")
        .call(yAxis);

    svg.append("text")
		.attr('x', width)
		.attr('y', height-margin.bottom/2)
		.text("Income")
            .attr("text-anchor","end")
    
    svg.append("text")
        .attr('x', -margin.left/2)
        .attr('y', -margin.top/2)
        .text("Life Expectancy")
            .attr("transform","rotate(180)")
            .attr("writing-mode", "vertical-rl")
            .attr("alignment-baseline","right")
            .attr("text-anchor","end")
    
    let tooltip = d3.select(".tooltip") 


    
    

    circles
        .on("mouseenter", (event, d) => {
            tooltip.style("display", "block")
            const pos = d3.pointer(event, window);
            
            let tooltip_text = `<span> Country: ${d.Country}
                <br>Region: ${d.Region}
                <br>Population: ${d3.format(",")(d.Population)}
                <br>Income: ${d3.format(",")(d.Income)}
                <br>Life Expectancy: ${d3.format('.2')(d.LifeExpectancy)} </span>`
            
            tooltip
                .style("left", pos[0]+30+"px")
                .style("top", pos[1]-30+"px")
                .html(tooltip_text)
        })
        .on("mouseleave", (event, d) => {
            tooltip.style("display", "none")
        });


    let legend_svg = svg.append("g")
        .attr("class", "legend")
        .attr("x", width-200)
        .attr("y", height-225)
        .attr("transform", `translate(${width-200},${height-225})`)
        .attr("height", 200)
        .attr("width", 200)

    legend_svg.selectAll("rect")
        .data(regionScale.domain())
        .enter()
        .append("rect")
            .attr("position", "relative")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", 0)
            .attr("y", (_, i) => (20+5) * i) 
            .style("margin", "5px")
            .style("fill", d => regionScale(d))

    legend_svg.selectAll("label")
        .data(regionScale.domain())
        .enter()
        .append("text")
            .attr("x", 20+5)
            .attr("y", (_, i) => 15+(20+5) * i)
            .text(d => d)
    
    legend_svg.selectAll("line-label")
        .enter()
        .append("text")
            .attr("x",200)
            .attr("y",15+(20+5)*6)
            .attr("text-anchor","end")
            .text(d => d)
}

draw()