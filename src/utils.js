export const VALID_LABELS = ['PR: NEW', 'PR: ADDED', 'PR: IMPROVED', 'PR: FIXED']
export const ALL_LABELS = [...VALID_LABELS, 'PR: Others']
export const REPOS = ['Apps', 'cn-pay-apps']

export function getUniqueUser (PRs) {
  const uniqueUser = []
  PRs.forEach(v => {
    !uniqueUser.find(user => user.id === v.user.login) &&
      uniqueUser.push({
        id: v.user.login,
        avatar: v.user.avatar_url
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
      for (let [i, label] of userPR.labels.entries()) {
        if (VALID_LABELS.includes(label.name)) {
          PRLabels[label.name]++
          break
        } else {
          if (i + 1 === userPR.labels.length) {
            PRLabels['Others']++
          }
        }
      }
    } else {
      PRLabels['Others']++
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
    for (let label of PR.labels) {
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
    'PR: Others': 0
  }
  repoPRs.forEach(PR => {
    if (PR.labels.length) {
      for (let [i, label] of PR.labels.entries()) {
        if (VALID_LABELS.includes(label.name)) {
          PRLabels[label.name]++
          break
        } else {
          if (i + 1 === PR.labels.length) {
            PRLabels['PR: Others']++
          }
        }
      }
    } else {
      PRLabels['PR: Others']++
    }
  })
  return PRLabels
}
