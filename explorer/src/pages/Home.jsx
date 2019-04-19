import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getBlockchainInfo, checkHash} from '@/reducers/constant/action';
import {Link} from 'react-router-dom';
import {push} from 'connected-react-router';
import {trim} from 'lodash';
import {formatHashStr} from "../services/formatter";
import BrowserDetect from "../services/browserdetect";

class Home extends React.Component {
  static propTypes = {
    actionGetBlockChainInfo: PropTypes.func.isRequired,
    actionCheckHash: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    chainInfo: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const {chainInfo} = this.props;
    const {search} = props;

    this.state = {
      chainInfo,
      searchError: '',
      searchSuccess: '',
      searchUpdateAt: search.updatedAt,
      keyword: '',
    };

    const {actionGetBlockChainInfo} = this.props;
    actionGetBlockChainInfo();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return {chainInfo: nextProps.chainInfo};
    }
    if (nextProps.search.updatedAt !== prevState.searchUpdateAt) {
      const {search} = nextProps;
      if (search.keyword) {
        if (search.success) {
          return {
            searchSuccess: search.success,
            searchUpdateAt: nextProps.search.updatedAt
          };
        }
        return {
          searchError: 'This\'s not Tx hash or Block hash',
          searchUpdateAt: nextProps.search.updatedAt
        };
      }
    }
    return null;
  }

  componentDidUpdate() {
    const {keyword, searchSuccess} = this.state;
    const {dispatch} = this.props;

    if (searchSuccess) {
      switch (searchSuccess) {
        case 'tx':
          dispatch({type: 'CLEAR_SEARCH'});
          dispatch(push(`/tx/${keyword}`));
          return;
        case 'pending':
          dispatch({type: 'CLEAR_SEARCH'});
          dispatch(push(`/tx/pending/${keyword}`));
          return;
        case 'block':
          dispatch({type: 'CLEAR_SEARCH'});
          dispatch(push(`/block/${keyword}`));
          return;
        default:
          console.log('Not match type');
      }
    }
  }

  submitSearch = (e) => {
    const {actionCheckHash} = this.props;

    e.preventDefault();
    const keyword = trim(this.searchInput.value);
    this.setState({keyword});
    actionCheckHash(keyword);
  };

  render() {
    const {chainInfo, searchError} = this.state;
    if (!chainInfo.ChainName) {
      return null;
    }
    const bestBlocks = chainInfo.BestBlocks;
    const activeShards = chainInfo.ActiveShards;

    const totalTxs = Object.keys(bestBlocks)
      .reduce(
        (accumulator, blockIndex) => (
          parseInt(accumulator, 10) + parseInt(bestBlocks[blockIndex].TotalTxs, 10)
        ), 0,
      );

    const totalBlocks = Object.keys(bestBlocks)
      .reduce(
        (accumulator, blockIndex) => (
          parseInt(accumulator, 10) + parseInt(bestBlocks[blockIndex].Height, 10)
        ), 0,
      );

    return (
      <div className="c-explorer-page c-explorer-page-home">
        <div className="container">
          <div className="row">
            <div className="col-12" style={{
              paddingBottom: '20px',
              fontSize: '13px',
            }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="home-top-info-container block">
                <ul className="home-top-info c-list-inline">
                  <li>
                    <Link to="/">
                      <div className="data c-color-black">{chainInfo.ChainName}</div>
                      <div className="title">Network</div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/chains">
                      <div className="data c-color-black">{activeShards}</div>
                      <div className="title">Total shard</div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/#best-blocks">
                      <div className="data c-color-black">{totalBlocks}</div>
                      <div className="title">Total blocks</div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/txs/pending">
                      <div className="data c-color-black">{totalTxs}</div>
                      <div className="title">Total txs</div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content home-search">
                <div className="title">
                  Search
                </div>
                <form onSubmit={this.submitSearch}>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="Block hash, tx hash, account address, ..."
                    ref={(div) => {
                      this.searchInput = div;
                      return null;
                    }}
                  />
                  {searchError && <span className="c-text-error">{searchError}</span>}
                </form>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <Link to="/info">Blockchain advance information - GOV, DCB, CB</Link>
              </div>
            </div>
            <div className="col-12">
              <div className="block content" id="best-blocks">
                <div className="block-heading">
                  Beacon chain
                </div>
                <div className="block-data">
                  <table className="c-table">
                    <thead>
                    <tr>
                      <th>Block hash</th>
                      <th>Height</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr key={-1}>
                      <td><Link to={`/block/${bestBlocks[-1].Hash}?beacon=true`}
                                className="c-hash">{formatHashStr(bestBlocks[-1].Hash, BrowserDetect.isMobile)}</Link></td>
                      <td>{`${bestBlocks[-1].Height}`}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content" id="best-blocks">
                <div className="block-heading">
                  Best blocks
                </div>
                <div className="block-data">
                  <table className="c-table">
                    <thead>
                    <tr>
                      <th>Block hash</th>
                      <th>Shard #</th>
                      <th>Height</th>
                      <th>Total Txs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(bestBlocks)
                      .map(key => {
                        if (key == -1) {
                          return (<></>);
                        }
                        return (
                          <tr key={key}>
                            <td><Link to={`/block/${bestBlocks[key].Hash}`}
                                      className="c-hash">{formatHashStr(bestBlocks[key].Hash, BrowserDetect.isMobile)}</Link>
                            </td>
                            <td><Link to={`/chain/${parseInt(key, 10) + 1}`}>{parseInt(key, 10) + 1}</Link></td>
                            <td><Link to={`/block/${bestBlocks[key].Hash}`}
                                      className="c-hash">{bestBlocks[key].Height}</Link></td>
                            <td>{bestBlocks[key].TotalTxs}</td>
                          </tr>
                        );
                      })}
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

export default connect(
  state => ({
    chainInfo: state.constant.chainInfo,
    search: state.constant.search,
  }),
  dispatch => ({
    actionGetBlockChainInfo: () => dispatch(getBlockchainInfo()),
    actionCheckHash: hash => dispatch(checkHash(hash)),
    dispatch,
  }),
)(Home);
