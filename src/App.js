import React, { Component } from 'react';
import * as utils from './utils'
import * as rest from './rest'
import './App.css';

class App extends Component {
  constructor () {
    super()
    this.state = {
      processing: false,
      allComments: [],
      reviewers: [],
      PRs: {
        apps: {
          merged: [],
          functional: []
        },
        cnPayApps: {
          merged: [],
          functional: []
        }
      }
    }
    this.getPRs()
  }
  getAllComments = async () => {
    this.setState({processing: true})
    const allComments = await rest.getAllComments(utils.getAllPRs(this.state.PRs))
    this.setState({allComments: allComments.result, reviewers: allComments.reviewers, processing: false})
  }
  getPRs = async () => {
    const PRs = await rest.getPRsByMilestone()
    this.setState({PRs: {
      apps: {
        merged: PRs.apps,
        functional: utils.getFunctionalPRs(PRs.apps)
      },
      cnPayApps: {
        merged: PRs.cnPayApps,
        functional: utils.getFunctionalPRs(PRs.cnPayApps)
      }
    }})
  }
  render() {
    return (
      <div className="report">
        <div className="report-pr-repo">
          <h2>Pull Requests: Repo</h2>
          <table border="1">
            <thead>
              <tr>
                <td>Repo</td>
                <td>Merged PR</td>
                <td>Functional PR</td>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>Apps</td>
                  <td>{this.state.PRs.apps.merged.length}</td>
                  <td>{this.state.PRs.apps.functional.length}</td>
                </tr>
                <tr>
                  <td>cn-pay-apps</td>
                  <td>{this.state.PRs.cnPayApps.merged.length}</td>
                  <td>{this.state.PRs.cnPayApps.functional.length}</td>
                </tr>
            </tbody>
          </table>
        </div>
        <div className="report-pr-analysis">
          <h2>Pull Request: merged PR analysis</h2>
          <h3>Apps</h3>
          <table border="1">
            <thead>
              <tr>
                <td>Label</td>
                <td>PR Count</td>
              </tr>
            </thead>
            <tbody>
              {utils.ALL_LABELS.map((v, i) => {
                const key = utils.ALL_LABELS[i]
                const PRsLabelCount = utils.getPRsLabelCount(this.state.PRs.apps.merged)
                return (
                  <tr key={key}>
                    <td>{key.slice(3)}</td>
                    <td>{PRsLabelCount[key]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <h3>cn-pay-apps</h3>
          <table border="1">
            <thead>
              <tr>
                <td>Label</td>
                <td>PR Count</td>
              </tr>
            </thead>
            <tbody>
              {utils.ALL_LABELS.map((v, i) => {
                const key = utils.ALL_LABELS[i]
                const PRsLabelCount = utils.getPRsLabelCount(this.state.PRs.cnPayApps.merged)
                return (
                  <tr key={key}>
                    <td>{key.slice(3)}</td>
                    <td>{PRsLabelCount[key]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="report-pr-assignee">
          <h2>Pull Requests: assignee</h2>
          <table border="1">
            <thead>
              <tr>
                <td>Name</td>
                <td>NEW</td>
                <td>ADDED</td>
                <td>IMPROVED</td>
                <td>FIXED</td>
                <td>Others</td>
              </tr>
            </thead>
            <tbody>
            {!!utils.getAllPRs(this.state.PRs) && utils.getUniqueUser(utils.getAllPRs(this.state.PRs)).map(v => {
              const userPRLabels = utils.getUserPRLabelsByUserName(v.id, utils.getAllPRs(this.state.PRs))
              return (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{userPRLabels['PR: NEW']}</td>
                  <td>{userPRLabels['PR: ADDED']}</td>
                  <td>{userPRLabels['PR: IMPROVED']}</td>
                  <td>{userPRLabels['PR: FIXED']}</td>
                  <td>{userPRLabels['Others']}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        <button onClick={this.getAllComments}>Get all comments</button>
        <div className="report-pr-reviewers">
          <h2>Pull Request: reviewer</h2>
          {this.state.processing && <span>Processing...</span>}
          {!!this.state.reviewers.length && (
            <div>
              <table border="1">
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Commented</td>
                    <td>Approved</td>
                  </tr>
                </thead>
                <tbody>
                {this.state.reviewers.map(v => {
                  return (
                    <tr key={v.name}>
                      <td>{v.name}</td>
                      <td>{v.commentedCount}</td>
                      <td>{v.approvedCount}</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="report-comments-all">
          <h2>Code Review: all comments</h2>
          {this.state.processing && <span>Processing...</span>}
          {!!this.state.allComments.length && (
            <div>
              <table border="1">
                <thead>
                  <tr>
                    <td>Id</td>
                    <td>PR</td>
                    <td>Comment</td>
                  </tr>
                </thead>
                <tbody>
                {this.state.allComments.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td>{i+1}</td>
                      <td><a href={v.prUrl}>{v.prNo}</a></td>
                      <td>{v.comment}</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
