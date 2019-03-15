import moment from 'moment';
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
    // every Pr can only be fixed or non-fixed
    const date = moment(prItem.created_at).format('YYYY-MM-DD');
    // isFixLabel and isOtherLabel is 0 / 1, not boolean
    const isFixLabel = Number(prItem.labels.some(label => label.name === 'PR: FIXED'));
    const isOtherLabel = 1 - isFixLabel;
    return {
      date,
      isFixLabel,
      isOtherLabel
    }
  });

  const organizePRs = _.reduce(simplifiedPRs, (result, value) => {
    const { date, isFixLabel, isOtherLabel } = value;
    if(!result[date]) {
      result[date] = {
        y1: isOtherLabel,
        y2: isFixLabel
      };
    } else {
      const { y1, y2 }  = result[date];
      result[date] = {
        y1: y1 + isOtherLabel,
        y2: y2 + isFixLabel
      };
    }
    return result;
  }, {});

  const res = _.map(organizePRs, (value, key) => ({
    x: new Date(key).getTime(),
    y1: value.y1,
    y2: value.y2
  }))
  res.pop()

  const total = _.map(_.reverse(res), (v, i) => {
    let index = i
    let y1 = 0
    let y2 = 0
    do {
      y1 += res[index].y1
      y2 += res[index].y2
      index--
    } while (index >= 0)
    return {
      x: v.x,
      y1,
      y2
    }
  })

  return total
}
