import { fakeChartData, getPRsByMilestone, getAllComments } from '@/services/api';

export default {
  namespace: 'chart',

  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    sprintOverviewData: [],
    radarData: [],
    loading: false,
    prData: [],
    crData: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      response.prData = yield call(getPRsByMilestone);
      response.crData = yield call(getAllComments, response.prData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        sprintOverviewData: [],
        radarData: [],
      };
    },
  },
};
