import React from 'react';
import { Chart, Geom, Axis, Coord, Guide, Shape } from 'bizcharts';
import autoHeight from '../autoHeight';

const { Arc, Html, Line } = Guide;

// const defaultFormatter = val => {
//   switch (val) {
//     case '20':
//       return 'D';
//     case '40':
//       return 'C';
//     case '60':
//       return 'B+';
//     case '80':
//       return 'A+';
//     default:
//       return val;
//   }
// };

const colors = ['#f5222d', '#ff7a45', '#faad14', '#fadb14', '#a0d911', '#52c41a']

const getColor = ({value}) => {
  switch (Math.floor(value / 10)) {
    case 0:
    case 1:
    case 2:
    case 3:
      return colors[0];
    case 4:
      return colors[1];
    case 5:
      return colors[2];
    case 6:
      return colors[3];
    case 7:
      return colors[4];
    case 8:
    case 9:
    case 10:
      return colors[5];
    default:
      return '#2F9CFF';
  }
};

Shape.registerShape('point', 'pointer', {
  drawShape(cfg, group) {
    let point = cfg.points[0];
    point = this.parsePoint(point);
    const center = this.parsePoint({
      x: 0,
      y: 0,
    });
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 2,
        lineCap: 'round',
      },
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 6,
        stroke: cfg.color,
        lineWidth: 3,
        fill: '#fff',
      },
    });
  },
});

@autoHeight()
class Gauge extends React.Component {
  render() {
    const {
      title,
      height,
      percent,
      forceFit = true,
      // formatter = defaultFormatter,
      bgColor = '#F0F2F5',
      style
    } = this.props;
    const cols = {
      value: {
        type: 'linear',
        min: 0,
        max: 100,
        tickCount: 6,
        nice: true,
      },
    };
    const data = [{ value: percent }];
    const color = getColor(data[0]);
      return (
        <Chart height={height} data={data} scale={cols} padding={[-16, 0, 16, 0]} forceFit={forceFit} style={style}>
          <Coord type="polar" startAngle={-9/8 * Math.PI} endAngle={1/8 * Math.PI} radius={0.6} />
          <Axis name="1" line={null} />
          <Axis
            line={null}
            tickLine={null}
            subTickLine={null}
            name="value"
            zIndex={2}
            gird={null}
            label={{
              offset: -13,
              // formatter,
              textStyle: {
                fontSize: 12,
                fill: 'rgba(0, 0, 0, 0.65)',
                textAlign: 'center',
              },
            }}
          />
          <Guide>
            {[0.5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99.5].map(value => {
              return (
                <Line
                  start={[value, 0.905]}
                  end={[value, 0.8]}
                  lineStyle={{
                    stroke: color,
                    lineDash: null,
                    lineWidth: 2,
                  }}
                />
              )
            })}
            <Arc
              zIndex={0}
              start={[0, 0.965]}
              end={[100, 0.965]}
              style={{
              stroke: bgColor,
              lineWidth: 10,
            }}
            />
            <Arc
              zIndex={1}
              start={[0, 0.965]}
              end={[data[0].value, 0.965]}
              style={{
              stroke: color,
              lineWidth: 10,
            }}
            />
            <Html
              position={['50%', '85%']} // 中间文字
              html={() => `
                <div style="width: 300px;text-align: center;font-size: 12px!important;">
                  <!--<p style="font-size: 14px; color: rgba(0,0,0,0.43);margin: 0;">${title}</p>-->
                  <p style="font-size: 28px;font-weight: 500;color: ${color};margin: 0;">
                    ${data[0].value}
                  </p>
                </div>`}
            />
          </Guide>
          <Geom
            line={false}
            type="point"
            position="value*1"
            shape="pointer"
            color={color}
            active={false}
          />
        </Chart>
    );
  }
}

export default Gauge;
