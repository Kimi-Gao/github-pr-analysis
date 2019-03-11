import React, { memo } from 'react';
import { Card } from 'antd';
import styles from './Analysis.less';
import { Pie } from '@/components/Charts';

const ProportionSales = memo(
  (props) => (
    <Card
      loading={props.loading}
      className={styles.salesCard}
      bordered={false}
      title={props.title}
      bodyStyle={{ padding: 24 }}
      style={{ marginTop: 24 }}
    >
      <Pie
        hasLegend
        subTitle={props.coreTitle}
        total={() => props.data.reduce((pre, now) => now.y + pre, 0)}
        data={props.data}
        // valueFormat={value => <Yuan>{value}</Yuan>}
        height={270}
        lineWidth={4}
        colors={props.colors}
        style={{ padding: '8px 0' }}
      />
    </Card>
  )
);

export default ProportionSales;
