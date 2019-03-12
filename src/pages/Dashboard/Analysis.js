import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { FormattedMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import { getUniqueUser, getPRsLabelCount, getUserPRLabelsByUserName } from '@/utils/pr';
import { getCRTotal } from '@/utils/cr';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SprintOverview = React.lazy(() => import('./SprintOverview'));
const Proportion = React.lazy(() => import('./Proportion'));
const Ranking = React.lazy(() => import('./Ranking'));

@connect(({ chart, loading, setting }) => ({
  chart,
  setting,
  loading: loading.effects['chart/fetch']
}))
class Analysis extends Component {
  state = {
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue } = this.state;
    const { chart, loading, setting } = this.props;
    const {
      sprintOverviewData,
      prData,
      crData
    } = chart;
    const prUserData = prData && getUniqueUser(prData).map(v => {
      const userPRLabels = getUserPRLabelsByUserName(v.id, prData)
      return {
        State: v.id,
        avatar: v.avatar,
        ...userPRLabels
      }
    })
    const crUserData = crData && crData.reviewers && crData.reviewers.map(v => {
      return {
        State: v.name,
        avatar: v.avatar,
        Comment: v.Comment,
        Approve: v.Approve
      }
    })

    const convertToProportionData = PRLabels => Object.keys(PRLabels).map(objKey => {
      return {
        x: objKey.slice(4),
        y: PRLabels[objKey]
      }
    })

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} crData={crData} prData={prData} setting={setting} />
        </Suspense>
        <Suspense fallback={null}>
          <SprintOverview
            loading={loading}
            sprintOverviewData={sprintOverviewData}
          />
        </Suspense>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Proportion
                  title={<FormattedMessage
                    id="app.analysis.the-proportion-of-sales"
                    defaultMessage="Business PR Analysis"
                  />}
                  coreTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="PR Total" />}
                  loading={loading}
                  data={convertToProportionData(getPRsLabelCount(prData))}
                  colors={['#0e8a16', '#c2e0c6', '#1c69d3', '#ee0701', '#cccccc']}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Proportion
                  title={<FormattedMessage
                    id="app.analysis.the-proportion-of-sales"
                    defaultMessage="Code Review Analysis"
                  />}
                  coreTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="CR Total" />}
                  loading={loading}
                  data={getCRTotal(crData.reviewers)}
                  colors={['#fbca04', '#2cbd4e', '#2cbd4e']}
                />
              </Suspense>
            </Col>
          </Row>
        </div>
        <Suspense fallback={null}>
          {!!prUserData && !!crUserData &&
            <Ranking
              rangePickerValue={rangePickerValue}
              prData={prUserData}
              crData={crUserData}
              isActive={this.isActive}
              handleRangePickerChange={this.handleRangePickerChange}
              loading={loading}
              selectDate={this.selectDate}
            />
          }
        </Suspense>
      </GridContent>
    );
  }
}

export default props => (
  <AsyncLoadBizCharts>
    <Analysis {...props} />
  </AsyncLoadBizCharts>
);
