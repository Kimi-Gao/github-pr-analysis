import _ from 'lodash';

export function getCRTotal(reviewers) {
  let commentedCount = 0;
  let approvedCount = 0
  _.forEach(reviewers, r => {
    commentedCount += r.commentedCount;
    approvedCount += r.approvedCount;
  })
  return [
    {
      x: 'Comment',
      y: commentedCount,
    },
    {
      x: 'Approve1',
      y: Math.floor(approvedCount / 2),
    },
    {
      x: 'Approve2',
      y: Math.floor(approvedCount / 2),
    }
  ]
}
