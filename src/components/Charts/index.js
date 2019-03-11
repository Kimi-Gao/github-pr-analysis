import React, { Suspense } from 'react';
import numeral from 'numeral';
import ChartCard from './ChartCard';
import Field from './Field';

const getComponent = Component => props => (
  <Suspense fallback="...">
    <Component {...props} />
  </Suspense>
);

const Bar = getComponent(React.lazy(() => import('./Bar')));
const StackedBar = getComponent(React.lazy(() => import('./StackedBar')));
const Pie = getComponent(React.lazy(() => import('./Pie')));
const Radar = getComponent(React.lazy(() => import('./Radar')));
const Gauge = getComponent(React.lazy(() => import('./Gauge')));
const MiniArea = getComponent(React.lazy(() => import('./MiniArea')));
const MiniBar = getComponent(React.lazy(() => import('./MiniBar')));
const MiniProgress = getComponent(React.lazy(() => import('./MiniProgress')));
const WaterWave = getComponent(React.lazy(() => import('./WaterWave')));
const TagCloud = getComponent(React.lazy(() => import('./TagCloud')));
const TimelineChart = getComponent(React.lazy(() => import('./TimelineChart')));

const yuan = val => `¥ ${numeral(val).format('0,0')}`;

const Charts = {
  yuan,
  Bar,
  Pie,
  Gauge,
  Radar,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
};

export {
  Charts as default,
  yuan,
  Bar,
  StackedBar,
  Pie,
  Gauge,
  Radar,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
};
