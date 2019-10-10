import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {getMempoolInfo} from '@/reducers/constant/action';
import {isEmpty} from 'lodash';
import {formatHashStr} from "../services/formatter";
import BrowserDetect from "../services/browserdetect"

class TxsPending extends React.Component {
  static propTypes = {
    // match: PropTypes.object.isRequired,
    actionGetMempoolInfo: PropTypes.func.isRequired,
    mempool: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const {mempool, actionGetMempoolInfo} = this.props;

    this.state = {
      mempool,
    };

    actionGetMempoolInfo();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.mempool.updatedAt !== prevState.mempool.updatedAt) {
      return {mempool: nextProps.mempool};
    }
    return null;
  }

  render() {
    const {mempool} = this.state;

    if (isEmpty(mempool.info)) return null;

    return (
      <div className="c-explorer-page c-explorer-page-chains">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/txs/pending">Pending TXs</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">
                  Pendings TXs {mempool.info.ListTxs.length}
                </div>
                <table className="c-table">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Tx hash</th>
                    <th>Lock time</th>
                  </tr>
                  </thead>
                  <tbody>
                  {mempool.info.ListTxs && mempool.info.ListTxs.length ? mempool.info.ListTxs.map((tx, index) => (
                    <tr>
                      <td>{`${index + 1}`}</td>
                      <td className="c-hash">
                        <Link to={`/tx/${tx.TxID}`}>
                          {formatHashStr(tx.TxID, BrowserDetect.isMobile)}
                        </Link>
                      </td>
                      <td className="c-hash">{new Date(tx.LockTime * 1000).toLocaleString()}</td>
                    </tr>
                  )) : <tr>
                    <td style={{textAlign: 'center'}} colSpan={2}>No transaction</td>
                  </tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    mempool: state.constant.mempool,
  }),
  ({
    actionGetMempoolInfo: getMempoolInfo,
  }),
)(TxsPending);
