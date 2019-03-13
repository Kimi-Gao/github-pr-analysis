import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { ChartCard, Gauge, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import { getFunctionalPRs, getPRsLabelCount } from '@/utils/pr';
import { getDeveloperStar, getObjTotalValue, calculateCodeQualityScore, calculateCodeQualityLevel } from '@/utils/cr';
import numeral from 'numeral';
import _ from 'lodash';
import styles from './Analysis.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, crData, prData, setting }) => {
  const businessPRCount = getFunctionalPRs(prData).length
  const allPRCount = prData.length
  const businessPRRate = numeral(businessPRCount / allPRCount).format('0.0%')
  const PRsLabelCount = getPRsLabelCount(prData)
  const PRsLabelCountTotal = getObjTotalValue(PRsLabelCount)
  const fixedPRRate = ((PRsLabelCount['PR: FIXED'] / PRsLabelCountTotal) * 100).toFixed(1)
  const developerStar = getDeveloperStar(prData, crData)
  const {lastSprintPRFixedRate} = setting
  const targetPRFixedRate = lastSprintPRFixedRate - 3
  const codeQualityScore = calculateCodeQualityScore(fixedPRRate, allPRCount, crData, targetPRFixedRate)
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="app.analysis.total-sales" defaultMessage="Pull Requests" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Merged PR except closed" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={numeral(allPRCount).format('0,0')}
          footer={
            <Field
              label={<FormattedMessage id="app.analysis.day-sales" defaultMessage="Business PR" />}
              value={businessPRRate}
            />
          }
          contentHeight={46}
        >
          <Trend>
            <FormattedMessage id="app.analysis.day" defaultMessage="Business PR" />
            <span className={styles.trendText}>{businessPRCount}</span>
          </Trend>
          <br />
          <Trend style={{ marginRight: 16 }}>
            <FormattedMessage id="app.analysis.week" defaultMessage="Other PR" />
            <span className={styles.trendText}>{allPRCount - businessPRCount}</span>
          </Trend>
          <div className={styles.prMerged}>
            <svg
              className={styles.octIconMerged}
              viewBox="0 0 12 16"
              version="1.1"
              width="12"
              height="16"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z" />
            </svg>
          </div>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={<FormattedMessage id="app.analysis.visits" defaultMessage="Developer Star" />}
          action={
            <Tooltip
              title={<div>PR: NEW: +10<br />PR: ADDED: +8<br />PR: IMPROVED: +6<br />PR: FIXED: +4<br />Others: +3<br />Comment: +2<br />Approve: +1</div>}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={_.get(developerStar, 'user.name')}
          footer={
            <Field
              label={<FormattedMessage id="app.analysis.day-visits" defaultMessage="Total Score" />}
              value={_.get(developerStar, 'score.total')}
            />
          }
          contentHeight={46}
        >
          <img style={{width: 50, height: 50, border: '1px solid #ddd', borderRadius: '50%', float: 'right'}} alt="" src={_.get(developerStar, 'user.avatar')} />
          <br />
          <Trend style={{ marginRight: 16 }}>
            <FormattedMessage id="app.analysis.week" defaultMessage="PR Score" />
            <span className={styles.trendText}>{_.get(developerStar, 'score.pr')}</span>
          </Trend>
          <br />
          <Trend>
            <FormattedMessage id="app.analysis.day" defaultMessage="CR Score" />
            <span className={styles.trendText}>{_.get(developerStar, 'score.cr')}</span>
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
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="PR: FIXED in Business PR" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={`${fixedPRRate}%`}
          footer={
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Trend flag={lastSprintPRFixedRate < fixedPRRate ? 'up' : 'down'} style={{ marginRight: 16 }}>
                <FormattedMessage id="app.analysis.week" defaultMessage="Last Sprint" />
                <span className={styles.trendText}>{lastSprintPRFixedRate}%</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <MiniProgress percent={fixedPRRate} strokeWidth={8} target={targetPRFixedRate} color="#f5222d" />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={<FormattedMessage id="app.analysis.payments" defaultMessage="Code Quality" />}
          action={
            <Tooltip
              title={<div>A+: [80, 100]<br />A&nbsp;&nbsp;: [70, 80)<br />B+: [60, 70)<br />B&nbsp;&nbsp;: [50, 60)<br />C&nbsp;&nbsp;: [40, 50)<br />D&nbsp;&nbsp;: [0, 40)</div>}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={calculateCodeQualityLevel(codeQualityScore)}
          contentHeight={78}
        >
          <Gauge
            title={formatMessage({ id: 'app.monitor.ratio', defaultMessage: 'Score' })}
            height={200}
            percent={codeQualityScore}
            style={{transform: 'scale(1)', position: 'relative', top: 40}}
          />
        </ChartCard>
      </Col>
    </Row>
  )
});

export default IntroduceRow;
