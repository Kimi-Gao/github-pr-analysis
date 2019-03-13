import React, { memo } from 'react';
import { Card } from 'antd';
import styles from './Analysis.less';
import { TimelineChart } from '@/components/Charts';

const SprintOverview = memo(
  ({ loading, sprintOverviewData }) => (
    <Card
      loading={loading}
      className={styles.offlineCard}
      bordered={false}
    >
      <div style={{ padding: '0 24px' }}>
        <TimelineChart
          height={400}
          data={sprintOverviewData}
          titleMap={{
            y1: 'PR: non-FIXED',
            y2: 'PR: FIXED',
          }}
        />
      </div>
    </Card>
  )
);

export default SprintOverview;
