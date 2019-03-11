import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { ChartCard, Gauge, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import { getFunctionalPRs, getPRsLabelCount } from '@/utils/pr';
import numeral from 'numeral';
import styles from './Analysis.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, prData }) => {
  const businessPRCount = getFunctionalPRs(prData).length
  const allPRCount = prData.length
  const businessPRRate = ((businessPRCount / allPRCount) * 100).toFixed(1)
  const PRsLabelCount = getPRsLabelCount(prData)
  const PRsLabelCountTotal = Object.keys(PRsLabelCount).map(tag => PRsLabelCount[tag]).reduce((a, b) => a + b)
  const fixedPRRate = ((PRsLabelCount['PR: FIXED'] / PRsLabelCountTotal) * 100).toFixed(1)
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="app.analysis.total-sales" defaultMessage="Business PR" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={numeral(businessPRCount).format('0,0')}
          footer={
            <Field
              label={<FormattedMessage id="app.analysis.day-sales" defaultMessage="Rate" />}
              value={`${businessPRRate}%`}
            />
          }
          contentHeight={46}
        >
          <Trend>
            <FormattedMessage id="app.analysis.day" defaultMessage="Others" />
            <span className={styles.trendText}>{allPRCount - businessPRCount}</span>
          </Trend>
          <br />
          <Trend style={{ marginRight: 16 }}>
            <FormattedMessage id="app.analysis.week" defaultMessage="Total PR" />
            <span className={styles.trendText}>{allPRCount}</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={<FormattedMessage id="app.analysis.visits" defaultMessage="Developer Star" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total="Kimi"
          footer={
            <Field
              label={<FormattedMessage id="app.analysis.day-visits" defaultMessage="Total Score" />}
              value={numeral(107).format('0,0')}
            />
          }
          contentHeight={46}
        >
          <img style={{width: 50, height: 50, border: '1px solid #ddd', borderRadius: '50%', float: 'right'}} alt="" src="https://avatars0.githubusercontent.com/u/12554487?s=460&v=4" />
          <br />
          <Trend style={{ marginRight: 16 }}>
            <FormattedMessage id="app.analysis.week" defaultMessage="PR Score" />
            <span className={styles.trendText}>39</span>
          </Trend>
          <br />
          <Trend>
            <FormattedMessage id="app.analysis.day" defaultMessage="CR Score" />
            <span className={styles.trendText}>68</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title={
            <FormattedMessage
              id="app.analysis.operational-effect"
              defaultMessage="PR: FIXED"
            />
          }
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={`${fixedPRRate}%`}
          footer={
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Trend style={{ marginRight: 16 }}>
                <FormattedMessage id="app.analysis.week" defaultMessage="Target" />
                <span className={styles.trendText}>51.7%</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <MiniProgress percent={fixedPRRate} strokeWidth={8} target={51.7} color="#f5222d" />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={<FormattedMessage id="app.analysis.payments" defaultMessage="Code Quality" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          contentHeight={120}
        >
          <Gauge
            title={formatMessage({ id: 'app.monitor.ratio', defaultMessage: 'Score' })}
            height={200}
            percent={78}
            style={{transform: 'scale(1)', position: 'relative', top: 36}}
          />
        </ChartCard>
      </Col>
    </Row>
  )
});

export default IntroduceRow;
