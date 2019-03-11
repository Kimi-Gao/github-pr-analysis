import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { prWeight, crWeight, getObjTotalValue } from '@/utils/cr';
import numeral from 'numeral';
import _ from 'lodash'
import styles from './Analysis.less';
import { StackedBar } from '@/components/Charts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const config = {
  pr: {
    tags: ["PR: NEW", "PR: ADDED", "PR: IMPROVED", "PR: FIXED", "Others"],
    colors: ['#0e8a16', '#c2e0c6', '#1c69d3', '#ee0701', '#cccccc']
  },
  cr: {
    tags: ["Comment", "Approve"],
    colors: ['#fbca04', '#2cbd4e']
  }
}

function getRankingListData(data, weight) {
  const rankingListData = [];
  data.forEach((v) => {
    rankingListData.push({
      title: v.State,
      avatar: v.avatar,
      total: getObjTotalValue(_.omit(v, ['State', 'avatar']), weight),
    });
  })
  return _.sortBy(rankingListData, v => v.total).reverse();
}

function getSortedData(data, tags) {
  return _.sortBy(data, v => tags.map(tag => v[tag]).reduce((a, b) => a + b));
}

const Ranking = memo(
  ({ rangePickerValue, prData, crData, isActive, handleRangePickerChange, loading, selectDate }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{ marginTop: 24 }}>
      <div className={styles.salesCard}>
        <Tabs
          // tabBarExtraContent={
          //   <div className={styles.salesExtraWrap}>
          //     <div className={styles.salesExtra}>
          //       <a className={isActive('year')} onClick={() => selectDate('year')}>
          //         <FormattedMessage id="app.analysi.all-day" defaultMessage="Damo 8" />
          //       </a>
          //       <a className={isActive('week')} onClick={() => selectDate('week')}>
          //         <FormattedMessage id="app.analysi.all-week" defaultMessage="Damo 7" />
          //       </a>
          //       <a className={isActive('month')} onClick={() => selectDate('month')}>
          //         <FormattedMessage id="app.analysi.all-month" defaultMessage="Damo 6" />
          //       </a>
          //     </div>
          //     {/* <RangePicker */}
          //     {/* value={rangePickerValue} */}
          //     {/* onChange={handleRangePickerChange} */}
          //     {/* style={{ width: 256 }} */}
          //     {/* /> */}
          //   </div>
          // }
          size="large"
          // tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="app.analysi.test22" defaultMessage="Pull Requests" />}
            key="sales"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <StackedBar
                    // height={500}
                    title={
                      <FormattedMessage
                        id="app.analysi.sales-trend"
                        defaultMessage="PR Trend"
                      />
                    }
                    data={getSortedData(prData, config.pr.tags)}
                    fields={config.pr.tags}
                    colors={config.pr.colors}
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysi.sales-ranking"
                      defaultMessage="PR Score Ranking"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {getRankingListData(prData, prWeight).map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <img className={styles.rankingItemAvatar} src={item.avatar} alt="Avatar" />
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {numeral(item.total).format('0,0')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysi.visits" defaultMessage="Code Review" />}
            key="views"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <StackedBar
                    // height={250}
                    title={
                      <FormattedMessage
                        id="app.analysi.visits-trend"
                        defaultMessage="CR Trend"
                      />
                    }
                    data={getSortedData(crData, config.cr.tags)}
                    fields={config.cr.tags}
                    colors={config.cr.colors}
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysi.visits-ranking"
                      defaultMessage="CR Score Ranking"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {getRankingListData(crData, crWeight).map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <img className={styles.rankingItemAvatar} src={item.avatar} alt="Avatar" />
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span>{numeral(item.total).format('0,0')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default Ranking;
