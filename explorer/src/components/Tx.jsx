import React from 'react';
import PropTypes from 'prop-types';
import {formatBlocksHeight, formatConstantValue} from "../services/formatter";

class Tx extends React.Component {
  static propTypes = {
    tx: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTxType = (type) => {
    if (type == 's') {
      return 'Paid Salary';
    }
    if (type == 'n') {
      return 'Transfer constant';
    }
    if (type == 't') {
      return 'Init/Transfer custom token';
    }
    if (type == 'tp') {
      return 'Init/Transfer privacy custom token';
    }
  };

  render() {
    const {tx} = this.props;

    const txCustomTokenData = tx.CustomTokenData;
    const txPrivacyCustomTokenData = tx.PrivacyCustomTokenData;

    return (
      <table className="c-table">
        <tbody>
        <tr>
          <td>Block height</td>
          <td>{tx.BlockHeight == 1 ? "1 [Genesis block]" : formatBlocksHeight(tx.BlockHeight)}</td>
        </tr>
        <tr>
          <td>Tx Version</td>
          <td>{tx.Version}</td>
        </tr>
        <tr>
          <td>Type</td>
          <td>{this.renderTxType(tx.Type)}</td>
        </tr>
        <tr>
          <td>Fee</td>
          <td>{(tx.Fee / 100) > 1 ? (formatConstantValue(tx.Fee / 100)) + " costants" : (formatConstantValue(tx.Fee / 100)) + " constant"} </td>
        </tr>
        <tr>
          <td>Lock time</td>
          <td>{tx.LockTime}</td>
        </tr>
        <tr>
          <td>SigPubKey</td>
          <td className="c-hash" style={{
            wordWrap: 'break-word',
            whiteSpace: 'normal'
          }}>{tx.SigPubKey}</td>
        </tr>
        <tr>
          <td>Sig</td>
          <td className="c-hash" style={{
            wordWrap: 'break-word',
            whiteSpace: 'normal'
          }}>{tx.Sig}</td>
        </tr>
        <tr>
          <td style={{verticalAlign: 'top'}}>Proof (base68ceheck encode)</td>
          <td>
            <textarea disabled={true} rows={10} cols={100}>{tx.Proof}</textarea>
          </td>
        </tr>
        <tr>
          <td style={{verticalAlign: 'top'}}>Metadata</td>
          <td>
            <textarea disabled={true} rows={10} cols={100}>{tx.Metadata == null ? '' : tx.Metadata}</textarea>
          </td>
        </tr>
        <tr>
          <td style={{verticalAlign: 'top'}}>Custom token</td>
          <td>
            <textarea disabled={true} rows={10}
                      cols={100}>{tx.CustomTokenData == null ? '' : tx.CustomTokenData}</textarea>
          </td>
        </tr>

        <tr>
          <td style={{verticalAlign: 'top'}}>Privacy Custom token</td>
          <td>
            <textarea disabled={true} rows={10}
                      cols={100}>{tx.PrivacyCustomTokenData == null ? '' : tx.PrivacyCustomTokenData}</textarea>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default Tx;
