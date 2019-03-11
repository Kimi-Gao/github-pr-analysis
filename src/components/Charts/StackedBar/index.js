import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";

class Stacked extends React.Component {
  render() {
    const { data, height, colors, fields } = this.props;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields,
      // 展开字段集
      key: "key",
      // key字段
      value: "value",
      // value字段
      retains: ["State"] // 保留字段集，默认为除fields以外的所有字段
    });
    return (
      <div>
        <Chart height={height} data={dv} forceFit>
          <Legend />
          <Coord transpose />
          <Axis
            name="State"
            label={{
              offset: 12
            }}
          />
          <Axis name="value" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="State*value"
            color={['key', colors]}
          />
        </Chart>
      </div>
    );
  }
}

export default Stacked;
