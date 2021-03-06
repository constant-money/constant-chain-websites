import React from 'react';
// import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Link from '@/components/Link';
import bgImage from '@/assets/create-a-proposal.png';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import dayjs from 'dayjs';
import { Dialog, toaster, TextInput } from 'evergreen-ui';
import { isEmpty } from 'lodash';
import { Tabs, Tab } from '@material-ui/core';
import Logo from '@/assets/logo.svg';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      borrows: [],
      borrowsForLender: [],
      active: 0,
      dialogApprove: false,
      dialogDeny: false,
      dialogWithdraw: false,
      currentBorrow: {},
      secretKey: '',
      stats: {},
      statsAll: {},
    };

    this.loadBorrows();
    this.loadBorrows(true);
    this.loadStats();
    this.loadStats(true);
  }

  loadStats = (all = false) => {
    let api = API.STATS;
    if (all) {
      api = API.STATS_ALL;
    }
    axios.get(api).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result) {
          let stats = 'stats';
          if (all) {
            stats = 'statsAll';
          }
          console.log(Result);
          this.setState({ [stats]: Result });
        }
      }
    }).catch((e) => {
      catchError(e);
    });
  }

  loadBorrows = (forLender = false) => {
    let api = API.LOAN_LIST;
    if (forLender) {
      api = API.LOAN_LIST_FOR_LENDER;
    }
    axios.get(api).then((res) => {
      const { data } = res;
      const { Result } = data;
      if (Result && Result.length) {
        let keyName = 'borrows';
        if (forLender) {
          keyName = 'borrowsForLender';
        }
        this.setState({ [keyName]: Result });
      }
    }).catch((e) => {
      catchError(e);
      console.log(e);
    });
  }

  clickAction = (borrow, approve = true) => {
    if (approve) {
      this.setState({ dialogApprove: true, currentBorrow: borrow });
    } else {
      this.setState({ dialogDeny: true, currentBorrow: borrow });
    }
  }

  action = (approve = true) => {
    const { currentBorrow } = this.state;
    const action = approve ? 'a' : 'r';
    axios.post(`${API.LOAN_ACTION}/${currentBorrow.LoanID}/process?action=${action}`).then(() => {
      this.loadBorrows();
      this.loadBorrows(true);
      this.setState({
        dialogApprove: false, dialogDeny: false, dialogWithdraw: false, isLoading: false,
      });
    }).catch((e) => {
      this.setState({
        dialogApprove: false, dialogDeny: false, dialogWithdraw: false, isLoading: false,
      });
      catchError(e);
      toaster.warning('Have a error', e);
    });
  }

  clickWithdraw = (borrow) => {
    this.setState({ dialogWithdraw: true, currentBorrow: borrow });
  }

  withdraw = () => {
    const { currentBorrow, secretKey } = this.state;
    axios.post(`${API.LOAN_ACTION}/${currentBorrow.LoanID}/withdraw?key=a${secretKey}`).then((res) => {
      this.loadBorrows();
      this.loadBorrows(true);
      const { data } = res;
      if (data) {
        const { Error: ResultError, Result } = data;
        if (ResultError) {
          const { Code } = ResultError;
          if (Code && Code < 1) {
            toaster.warning(ResultError.Message);
          }
        }
        if (Result) {
          toaster.success('Withdraw success!');
        }
      }
      this.setState({
        dialogApprove: false, dialogDeny: false, dialogWithdraw: false, isLoading: false, secretKey: '',
      });
    }).catch((e) => {
      this.setState({
        dialogApprove: false, dialogDeny: false, dialogWithdraw: false, isLoading: false, secretKey: '',
      });
      catchError(e);
      toaster.warning('Have a error', e);
    });
  }

  handleTabChange = (e, value) => {
    this.setState({ active: value });
  }

  render() {
    const {
      stats, secretKey, isLoading, borrows, borrowsForLender, active, dialogApprove, dialogDeny, dialogWithdraw, currentBorrow, statsAll,
    } = this.state;
    const hasStats = !isEmpty(stats);
    return (
      <div className="home-page">
        <Dialog
          isShown={dialogApprove}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title={`Approve borrow id: ${currentBorrow.LoanID && currentBorrow.LoanID.substr(0, 5)}...`}
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({ dialogApprove: false, isLoading: false })}
          onConfirm={() => { this.setState({ isLoading: true }); this.action(); }}
        >
          Confirm your approve.
        </Dialog>
        <Dialog
          isShown={dialogDeny}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title={`Deny borrow id: ${currentBorrow.LoanID && currentBorrow.LoanID.substr(0, 5)}...`}
          intent="danger"
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({ dialogDeny: false, isLoading: false })}
          onConfirm={() => { this.setState({ isLoading: true }); this.action(false); }}
        >
          Confirm your deny.
        </Dialog>
        <Dialog
          isShown={dialogWithdraw}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title={`Withdraw borrow id: ${currentBorrow.LoanID && currentBorrow.LoanID.substr(0, 5)}...`}
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({ dialogWithdraw: false, isLoading: false })}
          onConfirm={() => { this.setState({ isLoading: true }); this.withdraw(); }}
        >
          <div>Please input your backup code you were added when create.</div>
          <div>
            <TextInput autoComplete="off" type="password" style={{ display: 'block', margin: '10px 0' }} value={secretKey} onChange={e => this.setState({ secretKey: e.target.value })} />
          </div>
        </Dialog>
        <section className="coin-information">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-8">
                {hasStats ? (
                  <div className="c-card">
                    <div className="hello">
                      {'Hello, '}
                      {stats.Username}
                    </div>
                    <div className="row stats-container">
                      <div className="col-12 col-lg-3 stats">
                        <div className="value">
                          {Number(stats.TotalConstantPending).constant().numberFormat().commarize()}
                          {' '}
                          <sup>CST</sup>
                        </div>
                        <div>Are pending</div>
                      </div>
                      <div className="col-12 col-lg-3 stats">
                        <div className="value">
                          {Number(stats.TotalConstantApproved).constant().numberFormat().commarize()}
                          {' '}
                          <sup>CST</sup>
                        </div>
                        <div>Has been approved</div>
                      </div>
                      <div className="col-12 col-lg-3 stats">
                        <div className="value">
                          {Number(stats.TotalConstantRejected).constant().numberFormat().commarize()}
                          {' '}
                          <sup>CST</sup>
                        </div>
                        <div>Has been rejected</div>
                      </div>
                      <div className="col-12 col-lg-3 stats">
                        {stats.Collaterals && stats.Collaterals.map(collateral => (
                          <div key={collateral.Type} className="value">
                            {Number(collateral.Amount).coinUnitFormat(collateral.Type).numberFormat().commarize()}
                            {' '}
                            <sup>{collateral.Type}</sup>
                          </div>
                        ))}
                        <div>Collaterals</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="c-card" />
                )}
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})` }}>
                  <p>Wanna join the Constant network - the new era of Internet?</p>
                  <Link to="/create" className="c-btn c-bg-green">
                    {'Create a request '}
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="summary">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-3">
                <div className="c-card">
                  <img src={Logo} alt="Logo" style={{ float: 'left', marginRight: 15, marginTop: 5 }} />
                  <div style={{ float: 'left' }}>
                    <div className="title c-color-blue-1000">Borrows requested</div>
                    <div className="description">{statsAll.TotalBorrowsRequested}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="c-card">
                  <img src={Logo} alt="Logo" style={{ float: 'left', marginRight: 15, marginTop: 5 }} />
                  <div style={{ float: 'left' }}>
                    <div className="title c-color-blue-1000">Borrows approved</div>
                    <div className="description">{statsAll.TotalRequestsApproved}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="c-card">
                  <img src={Logo} alt="Logo" style={{ float: 'left', marginRight: 15, marginTop: 5 }} />
                  <div style={{ float: 'left' }}>
                    <div className="title c-color-blue-1000">Constants approved</div>
                    <div className="description">{statsAll.TotalConstantsApproved}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="c-card">
                  <img src={Logo} alt="Logo" style={{ float: 'left', marginRight: 15, marginTop: 5 }} />
                  <div style={{ float: 'left' }}>
                    <div className="title c-color-blue-1000">Constants withdrawn</div>
                    <div className="description">{statsAll.TotalConstantsWithdrawn}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs indicatorColor="primary" className="container tabs-container" value={active} onChange={this.handleTabChange}>
          <Tab label="Your borrows" value={0} classes={{ root: 'tab', selected: 'tab-selected' }} />
          <Tab label="Lender role" value={1} classes={{ root: 'tab', selected: 'tab-selected' }} />
        </Tabs>
        <div className="borrows-container" style={{ display: `${active === 0 ? 'block' : 'none'}` }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card c-card-no-padding">
                  <table className="c-table-portal-home">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Collateral</th>
                        <th>Interest rate</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Status</th>
                        <th width="324">Your decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        borrows && borrows.length ? borrows.map(borrow => (
                          <tr key={borrow.ID}>
                            <td>
                              <Link to={`/loan/${borrow.LoanID}`}>
                                {"0x"}{borrow.LoanID.substr(0, 5)}
                                ...
                              </Link>
                            </td>
                            <td>
                              {parseFloat(borrow.LoanAmount / 100).numberFormat()}
                              {' CST'}
                            </td>
                            <td>
                              {borrow.CollateralAmount.coinUnitFormat(borrow.CollateralType)}
                              {' '}
                              {borrow.CollateralType}
                            </td>
                            <td>
                              {(borrow.InterestRate / 100).numberFormat()}
                              %
                            </td>
                            <td>{dayjs(borrow.CreatedAt).format('MM-DD-YYYY')}</td>
                            <td>{dayjs(borrow.EndDate).format('MM-DD-YYYY')}</td>
                            <td className={`c-status ${borrow.State}`}>{borrow.State}</td>
                            <td>
                              {borrow.State === 'pending' ? 'Waiting for approve from lenders' : ''}
                              {borrow.State === 'approved' ? (
                                <button className="c-a-btn" onClick={() => this.clickWithdraw(borrow)} type="button">Withdraw</button>
                              ) : ''}
                            </td>
                          </tr>
                        )) : <tr><td colSpan={8}><span className="d-block text-center">No data</span></td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="borrows-container" style={{ display: `${active === 1 ? 'block' : 'none'}` }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card c-card-no-padding">
                  <table className="c-table-portal-home">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Collateral</th>
                        <th>Interest rate</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Status</th>
                        <th width="324">Your decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        borrowsForLender && borrowsForLender.length ? borrowsForLender.map(borrow => (
                          <tr key={borrow.ID}>
                            <td>
                              <Link to={`/loan/${borrow.LoanID}`}>
                                {borrow.LoanID.substr(0, 5)}
                                ...
                              </Link>
                            </td>
                            <td>
                              {parseFloat(borrow.LoanAmount / 100).numberFormat()}
                              {' CST'}
                            </td>
                            <td>
                              {borrow.CollateralAmount.coinUnitFormat(borrow.CollateralType)}
                              {' '}
                              {borrow.CollateralType}
                            </td>
                            <td>
                              {(borrow.InterestRate / 100).numberFormat()}
                              %
                            </td>
                            <td>{dayjs(borrow.CreatedAt).format('MM-DD-YYYY')}</td>
                            <td>{dayjs(borrow.EndDate).format('MM-DD-YYYY')}</td>
                            <td className={`c-status ${borrow.State}`}>{borrow.State}</td>
                            {
                              borrow.State === 'pending'
                                ? (
                                  <td>
                                    <button type="button" className="c-a-btn c-a-btn-approve" onClick={() => this.clickAction(borrow)}>Approve</button>
                                    <button type="button" className="c-a-btn c-a-btn-deny" onClick={() => this.clickAction(borrow, false)}>Deny</button>
                                  </td>
                                ) : ''
                            }
                          </tr>
                        )) : <tr><td colSpan={9}><span className="d-block text-center">No data</span></td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
