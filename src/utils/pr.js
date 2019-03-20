import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';

export const VALID_LABELS = ['PR: NEW', 'PR: ADDED', 'PR: IMPROVED', 'PR: FIXED']
export const ALL_LABELS = [...VALID_LABELS, 'PR: Others']
export const REPOS = ['Apps', 'cn-pay-apps']

export function getUniqueUser (PRs, reviewers) {
  const uniqueUser = []
  _.forEach(PRs, v => {
    !uniqueUser.find(user => user.id === v.user.login) &&
    uniqueUser.push({
      id: v.user.login,
      avatar: v.user.avatar_url
    })
  })
  _.forEach(reviewers, r => {
    !uniqueUser.find(user => user.id === r.name) &&
    uniqueUser.push({
      id: r.name,
      avatar: r.avatar
    })
  })
  return uniqueUser
}

export function getUserPRLabelsByUserName (userName, PRs) {
  const PRLabels = {
    'PR: NEW': 0,
    'PR: ADDED': 0,
    'PR: IMPROVED': 0,
    'PR: FIXED': 0,
    'Others': 0
  }
  const userPRs = PRs.filter(PR => userName === PR.user.login)
  userPRs && userPRs.forEach(userPR => {
    if (userPR.labels.length) {
      for (const [i, label] of userPR.labels.entries()) {
        if (VALID_LABELS.includes(label.name)) {
          PRLabels[`${label.name}`]++
          break
        } else if (i + 1 === userPR.labels.length) {
            PRLabels.Others++
          }
      }
    } else {
      PRLabels.Others++
    }
  })
  return PRLabels
}

export function getAllPRs (PRs) {
  if (!PRs.apps.merged.length || !PRs.cnPayApps.merged.length) {
    return
  }
  return [...PRs.apps.merged, ...PRs.cnPayApps.merged]
}

export function getFunctionalPRs (repoPRs) {
  return repoPRs.filter(PR => {
    for (const label of PR.labels) {
      if (VALID_LABELS.includes(label.name)) {
        return true
      }
    }
    return false
  })
}

export function getPRsLabelCount (repoPRs) {
  const PRLabels = {
    'PR: NEW': 0,
    'PR: ADDED': 0,
    'PR: IMPROVED': 0,
    'PR: FIXED': 0,
    // 'PR: Others': 0
  }
  repoPRs.forEach(PR => {
    if (PR.labels.length) {
      for (const [i, label] of PR.labels.entries()) {
        if (VALID_LABELS.includes(label.name)) {
          PRLabels[label.name]++
          break
        }
        // else if (i + 1 === PR.labels.length) {
        //     PRLabels['PR: Others']++
        // }
      }
    }
    // else {
    //   PRLabels['PR: Others']++
    // }
  })
  return PRLabels
}

export function getSprintOverviewData (prData) {
  if(_.isEmpty(prData)) {
    return {};
  }

  const simplifiedPRs = prData.map(prItem => {
    const PRLabels = {
      'PR: NEW': 0,
      'PR: ADDED': 0,
      'PR: IMPROVED': 0,
      'PR: FIXED': 0
    }
    const date = moment(prItem.closed_at).format('YYYY-MM-DD');
    if (prItem.labels.length) {
      for (const [i, label] of prItem.labels.entries()) {
        if (VALID_LABELS.includes(label.name)) {
          PRLabels[label.name] = 1
          break
        }
      }
    }

    return {
      date,
      ...PRLabels
    }
  });

  const organizePRs = _.reduce(_.sortBy(simplifiedPRs, 'date'), (result, value) => {
    const { date } = value;
    if(!result[date]) {
      result[date] = {
        y1: value['PR: NEW'],
        y2: value['PR: ADDED'],
        y3: value['PR: IMPROVED'],
        y4: value['PR: FIXED']
      };
    } else {
      const { y1, y2, y3, y4 }  = result[date];
      result[date] = {
        y1: y1 + value['PR: NEW'],
        y2: y2 + value['PR: ADDED'],
        y3: y3 + value['PR: IMPROVED'],
        y4: y4 + value['PR: FIXED']
      };
    }
    return result;
  }, {});

  const res = _.map(organizePRs, (value, key) => ({
    x: new Date(key).getTime(),
    y1: value.y1,
    y2: value.y2,
    y3: value.y3,
    y4: value.y4
  }))

  const total = _.map(res, (v, i) => {
    let index = i
    let y1 = 0
    let y2 = 0
    let y3 = 0
    let y4 = 0
    do {
      y1 += res[index].y1
      y2 += res[index].y2
      y3 += res[index].y3
      y4 += res[index].y4
      index--
    } while (index >= 0)
    const businessPRTotal = y1 + y2 + y3 + y4
    return {
      x: v.x,
      y1: (y1 / businessPRTotal).toFixed(3) * 100,
      y2: (y2 / businessPRTotal).toFixed(3) * 100,
      y3: (y3 / businessPRTotal).toFixed(3) * 100,
      y4: (y4 / businessPRTotal).toFixed(3) * 100
    }
  })

  const endDate = new Date(_.get(prData, '0.milestone.due_on')).getTime()

  if (_.last(total).x < endDate) {
    total.push({
      x: endDate
    })
  }

  return total
}
