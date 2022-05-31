function init() {

    let selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {

        let sampleNames = data.names;

        sampleNames.forEach((sample) => {

            selector

                .append("option")

                .text(sample)

                .property("value", sample);
    
    });

})}

init();

function optionChanged(newSample) {

    buildMetadata(newSample);

    buildCharts(newSample);

}

function buildMetadata(sample) {

    d3.json("samples.json").then((data) => {

        let metadata = data.metadata;

        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

        let result = resultArray[0];

        let PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => 
            
            PANEL.append("h6").text(`${key.toUpperCase()} : ${value}`));

    });

}

function buildCharts(sample) {

    d3.json("samples.json").then((data) => {


        let sampData = data.samples;

        let resultArray1 = sampData.filter(sampleObj => sampleObj.id == sample);

        let result1 = resultArray1[0];

        let otuIDs = result1.otu_ids;

        let otuLabels = result1.otu_labels;

        let sampleValues = result1.sample_values;

        let yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

        let xticks = sampleValues.slice(0,10).reverse();

        let labels = otuLabels.slice(0,10).reverse();

        let trace = [{

            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: 'h'

        }];

        let layout = {

            title: "Top 10 Bacterial Species Identified"
        }

        Plotly.newPlot("bar", trace, layout);

        let bubbleData = [{

            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIDs
            }
        }];

        let bubbleLayout = {

            title: {
                
                text: "Bacteria Cultures per Sample",
                font: {
                    family: "Open Sans",
                    size: 24,
                    color: "#D66E57"
                }
            },

            xaxis: {
                
                title: {
                    
                    text: "OTU ID",
                    font: {
                        family: "Open Sans",
                        size: 24,
                        color: "#D66E57"
                    }
                }
            },

            margin: {

                autoexpand: true
            },

            hovermode: "closest"
        }

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        let metadata2 = data.metadata;

        let resultArray2 = metadata2.filter(sampleObj => sampleObj.id == sample);

        let result2 = resultArray2[0];

        console.log(result2);

        let washes = parseFloat(result2.wfreq);

        washesData = [{

            value: washes,
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]},
                bars: {color: "white"},
                steps: [
                    {range: [0,2], color:"E81212"},
                    {range: [2,4], color:"FF9E00"},
                    {range: [4,6], color:"FFFF00"},
                    {range: [6,8], color:"90FE93"},
                    {range: [8,10], color:"00AB05"},
                    
                ]
            }
        }];

        washesLayout = {
            title: "Belly Button Washing Frequency",
            width: 600,
            height: 500
        };

        Plotly.newPlot("gauge", washesData, washesLayout);


    });
}