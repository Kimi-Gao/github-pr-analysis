import Octokit from '@octokit/rest'
import config from './config.json'

const octokit = Octokit()

let githubToken
try {
  githubToken = localStorage.getItem('github_token');
  if (!githubToken) {
    githubToken = window.prompt('Please input github token:');
    if (githubToken !== null) {
      localStorage.setItem('github_token', githubToken);
    } else {
      window.alert('Please input valid github token!')
    }
  }
} catch (error) {
  console.error(error)
}

octokit.authenticate({
  type: 'token',
  token: githubToken
})

export async function getPRsByMilestone () {
  const result = {}
  for (let e of config) {
    result[e.name] = (await octokit.issues.listForRepo({
      owner: e.owner,
      repo: e.repo,
      state: e.state,
      milestone: e.milestone,
      per_page: e.per_page
    })).data
  }
  return result
}

export function getAllComments (PRs) {
  let result = []
  let reviewers = []
  let count = 0
  const PRsLength = PRs.length
  return new Promise((resolve, reject) => {
    for (let repoPR of PRs) {
      const repositoryUrl = repoPR.repository_url.split('/')
      const PRConfig = {
        owner: repositoryUrl[repositoryUrl.length - 2],
        repo: repositoryUrl[repositoryUrl.length - 1],
        number: repoPR.number
      }
      Promise.all([
        octokit.pulls.listComments(PRConfig),
        octokit.pulls.get(PRConfig),
        octokit.pulls.listReviews(PRConfig)
      ]).then(res => {
        const data = res[0].data
        const author = res[1].data.user.login
        const listReviewsData = res[2].data
        listReviewsData
          .filter(v => v.user.login !== author)
          .forEach(v => {
            const reviewer = reviewers.find(reviewer => reviewer.name === v.user.login)
            if (reviewer) {
              v.state === 'COMMENTED' && reviewer.commentedCount++
              v.state === 'APPROVED' && reviewer.approvedCount++
            } else {
              reviewers.push({
                name: v.user.login,
                commentedCount: v.state === 'COMMENTED' ? 1 : 0,
                approvedCount: v.state === 'APPROVED' ? 1 : 0,
              })
            }
          })
        data.length && data.forEach(v => {
          result.push({comment: v.body, prUrl: v._links.html.href, prNo: v.pull_request_url.split('/')[v.pull_request_url.split('/').length - 1]})
        });
        count++
        if (count === PRsLength) {
          resolve({
            reviewers,
            result
          })
        }
      })
    }
  })
}
