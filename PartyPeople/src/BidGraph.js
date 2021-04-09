import { max } from "d3-array";
import { scaleLinear, scalePoint } from  "d3-scale";

import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";

class HorizontalBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight * 0.2,
            width: window.innerWidth * 0.2,
        };
    }


    render() {

        const { data, type, width, ratio } = this.props;
		return (
			<ChartCanvas ratio={ratio} width={this.state.width} height={this.state.height}
					margin={{ left: 90, right: 10, top: 20, bottom: 30 }} type={type}
					xExtents={data => [0, 100]}
					data={data}
					xScale={scaleLinear()} 
                    flipXScale={false}
					useCrossHairStyleCursor={false}>
				<Chart id={1}
						yExtents={data.map(d => d.y)}
						yScale={scalePoint()}
						padding={.5}
                        >
                        
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="left" orient="left" />
					<BarSeries yAccessor={d => d.y === '매수' && d.y} xAccessor={d =>  d.y === '매수' && d.x} fill="red" textFill="#fff" swapScales/>
					<BarSeries yAccessor={d => d.y === '매도' && d.y} xAccessor={d =>  d.y === '매도' && d.x} fill="#017de9" textFill="#fff" swapScales/>
					{/* <BarSeries yAccessor={d => d.y === '매도'} xAccessor={d => d.x} fill="blue" textFill="#fff" swapScales/> */}
					{/* <BarSeries yAccessor={d => d.y} xAccessor={d => d.x} fill="red" textFill="#fff" swapScales/> */}
					{/* <BarSeries {...barSeries}/> */}
				</Chart>
			</ChartCanvas>
		);
	}
}

HorizontalBarChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

HorizontalBarChart.defaultProps = {
	type: "svg",
};
HorizontalBarChart = fitWidth(HorizontalBarChart);

export default HorizontalBarChart;