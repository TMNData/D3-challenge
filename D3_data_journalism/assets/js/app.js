var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data

d3.csv("assets/data/data.csv").then(function(healthData) {

    console.log(healthData)

    // Step 1: Parse Data/Cast as numbers
    // ==============================

        healthData.forEach(function(data){
            data.smokes = +data.smokes;
            data.age = +data.age;
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
        });


//     // Step 2: Create scale functions
//     // ==============================
//     // create scales

        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(healthData,d=>d["poverty"])])
            .range([0, width]);

            // console.log("x-axis data");
            // console.log(d3.min(healthData, d=>d["poverty"]));
            // console.log(d3.max(healthData, d=>d["poverty"]));
            // console.log("y-axis data");
            // console.log(d3.min(healthData, d=>d["healthcare"]));
            // console.log(d3.max(healthData, d=>d["healthcare"]));
            // console.log(d3.max(healthData, d=>d["obesity"]));
            // console.log(d3.min(healthData, d=>d["obesity"]));
            // .domain(8, d3.max(healthData, d => +d.poverty))
            // .range([0, width]);

//     var yLinearScale = d3.scaleLinear()
//         .domain([0, d3.max(hairData, d => d.num_hits)])
//         .range([height, 0]);


        var yLinearScale = d3.scaleLinear()
            .domain([3, d3.max(healthData, d=>d["healthcare"])])
            .range([height,0]);
            // .domain(3, d3.max(healthData, d => +d.healthcare))
            // .range([height,0]);


//     // Step 3: Create axis functions
//     // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale)
        var leftAxis = d3.axisLeft(yLinearScale)


        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        chartGroup.append("g")
        .call(leftAxis);

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d["poverty"]))
        .attr("cy", d => yLinearScale(d["healthcare"]))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

        var textsGroup = chartGroup.selectAll("text")
        .data(healthData)
        .enter()
        // We return the abbreviation to .text, which makes the text the abbreviation.
        .append("text")
        .text(function(d) {
          return d.abbr;
        })


        .attr("dx", function(d) {
          return xLinearScale(d["poverty"]);
        })
        .attr("dy", function(d) {
          // When the size of the text is the radius,
          // adding a third of the radius to the height
          // pushes it into the middle of the circle.
          return yLinearScale(d["healthcare"]);
        })
        .attr("class", "stateText")
        .attr("font-size", ".6em")
        .attr("font-color", "black");

        // circlesGroup.append("text").text(d=>d.abbr)
        // .attr("x", d => xLinearScale(d.poverty)-4)
        // .attr("y", d => yLinearScale(d.healthcare)+2)
        // .style("font-size",".6em")
        // .classed("fill-text", true);


        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
        .attr("class", "D3-tip")
        .offset([80, -60])
        .html(function(data) {
            var abbrName = data.abbr;
            var povertyRate = +data.poverty;
            var lacksHealthcare = +data.healthcare;
            return (abbrName + "<br> Poverty Rate: " + povertyRate + "<br> Lacks Healthcare: " + lacksHealthcare);
          });

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    }).catch(function(error) {
        console.log(error);
    });