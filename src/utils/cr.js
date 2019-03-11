import _ from 'lodash';
import { getUniqueUser, getUserPRLabelsByUserName } from './pr'

export const prWeight = {
  'PR: NEW': 10,
  'PR: ADDED': 8,
  'PR: IMPROVED': 6,
  'PR: FIXED': 4,
  'Others': 3
}

export const crWeight = {
  'Comment': 2,
  'Approve': 1
}

export function getObjTotalValue(Obj, keyWeight) {
  if (_.isNil(Obj) || _.isEmpty(Obj)) {
    return 0
  }
  return _.reduce(_.map(_.keys(Obj), key => {
    return keyWeight ? Obj[key] * keyWeight[key] : Obj[key]
  }), ((a, b) => a + b))
}

export function getCRTotal(reviewers) {
  let Comment = 0;
  let Approve = 0
  _.forEach(reviewers, r => {
    Comment += r.Comment;
    Approve += r.Approve;
  })
  return [
    {
      x: 'Comment',
      y: Comment,
    },
    {
      x: 'Approve1',
      y: Math.floor(Approve / 2),
    },
    {
      x: 'Approve2',
      y: Math.floor(Approve / 2),
    }
  ]
}

export function getDeveloperStar(prData, crData) {
  if (_.isNil(prData) ||  _.isNil(crData)) {
    return {}
  }
  const userWithScore = _.map(getUniqueUser(prData, crData.reviewers), v => {
    const userPRLabels = getUserPRLabelsByUserName(v.id, prData)
    const userCR = _.find(crData.reviewers, r => r.name === v.id)
    const prScore = getObjTotalValue(userPRLabels, prWeight)
    const crScore = getObjTotalValue(_.omit(userCR, ['name', 'avatar']), crWeight)
    return {
      user: {
        avatar: v.avatar,
        name: v.id
      },
      score: {
        pr: prScore,
        cr: crScore,
        total: prScore + crScore
      }
    }
  })
  return _.maxBy(userWithScore, 'score.total');
}
