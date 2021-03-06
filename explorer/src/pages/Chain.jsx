import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from '@sindresorhus/class-names';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/pro-regular-svg-icons';
import { getBlocks, getBlockchainInfo } from '@/reducers/constant/action';
import {
  formatBlocksHeight,
  formatHashStr,
  formatProducerStr
} from '../services/formatter';
import BrowserDetect from '../services/browserdetect';

class Chain extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    chainInfo: PropTypes.object.isRequired,
    blocks: PropTypes.object.isRequired,
    actionGetBlocks: PropTypes.func.isRequired,
    actionGetBlockChainInfo: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { match, chainInfo, blocks } = this.props;
    const { chainId } = match.params;
    const rawchainId = chainId - 1;

    this.state = {
      blocks,
      chainId,
      chainInfo,
      rawchainId,
      page: 1
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.blocks[prevState.rawchainId]?.updatedAt !==
      prevState.blocks[prevState.rawchainId]?.updatedAt
    ) {
      return { blocks: nextProps.blocks };
    }
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return { chainInfo: nextProps.chainInfo };
    }
    const pageRegexExeced = /\?page=(\d+)$/.exec(
      nextProps.history.location.search
    );
    if (pageRegexExeced) {
      return { page: parseInt(pageRegexExeced[1], 10) };
    }
    return null;
  }

  componentDidMount() {
    const { rawchainId } = this.state;
    this.loadData(rawchainId);
    this.loadDataInterval = setInterval(() => {
      this.loadData(rawchainId);
    }, 15 * 1000); // reload after 5 minutes
  }

  componentWillUnmount() {
    if (this.loadDataInterval) clearInterval(this.loadDataInterval);
  }

  loadData = rawchainId => {
    const { actionGetBlocks, actionGetBlockChainInfo } = this.props;
    actionGetBlocks(rawchainId);
    actionGetBlockChainInfo();
  };

  isBeacon = chainID => {
    return chainID == 0;
  };

  render() {
    const { chainId, rawchainId, chainInfo, blocks, page } = this.state;

    if (!chainInfo.ChainName || !blocks[rawchainId]) {
      return null;
    }
    const bestBlocks = chainInfo.BestBlocks;
    const chainBlock = bestBlocks[rawchainId];

    const totalPage = Math.ceil(chainBlock.Height / 20);

    let prevPage = page - 1;
    if (prevPage <= 0) prevPage = 1;
    let nextPage = page + 1;
    console.log(nextPage);
    if (nextPage > totalPage) nextPage = totalPage;
    return (
      <div className="c-explorer-page c-explorer-page-chain-details">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li>
                    <NavLink exact activeClassName="nav-active" to="/">
                      Explorer
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact activeClassName="nav-active" to="/chains">
                      Shard lists
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      exact
                      activeClassName="nav-active"
                      to={`/chain/${chainId}`}
                    >
                      {!this.isBeacon(chainId)
                        ? `Shard ${chainId - 1}`
                        : 'Beacon Chain'}
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="heading multiple-line">
                {!this.isBeacon(chainId)
                  ? `Shard ${chainId - 1}`
                  : 'Beacon Chain'}
                <div className="title">Total blocks:</div>
                <Link to={`/block/${chainBlock.Hash}`} className="c-hash">
                  {formatBlocksHeight(chainBlock.Height)}
                </Link>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <table className="c-table c-table-list block-producer">
                  <tbody>
                    <tr>
                      <td>Current block producer</td>
                      <td className="c-hash" title={chainBlock.BlockProducer}>
                        {formatProducerStr(
                          chainBlock.BlockProducer,
                          BrowserDetect.isMobile
                        )}
                      </td>
                    </tr>

                    {!this.isBeacon(chainId) && (
                      <tr>
                        <td>Total TXs</td>
                        <td>
                          {chainBlock.TotalTxs.toLocaleString(
                            navigator.language,
                            { minimumFractionDigits: 0 }
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">Most Recent Blocks</div>
                <div className="block-description">
                  <span>
                    Block #
                    {blocks[rawchainId].list[
                      blocks[rawchainId].list.length - 1
                    ].Height.toLocaleString(navigator.language, {
                      minimumFractionDigits: 0
                    })}
                    {' '}
                    to #
                    {blocks[rawchainId].list[0].Height.toLocaleString(
                      navigator.language,
                      {
                        minimumFractionDigits: 0
                      }
                    )}
                    {' '}
                    (Total of
                    {' '}
                    {blocks[rawchainId].list[0].Height.toLocaleString(
                      navigator.language,
                      {
                        minimumFractionDigits: 0
                      }
                    )}
                    {' '}
                    blocks)
                  </span>
                </div>
                <div className="block-data">
                  <table className="c-table c-table-list">
                    <thead>
                      <tr>
                        <th>Block</th>
                        <th>Hash</th>
                        <th>Producer</th>
                        <th>Txn</th>
                        <th>Time created</th>
                        <th>Duration</th>
                        <th>TxS Fee</th>
                        <th>Rewards</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blocks[rawchainId] &&
                        blocks[rawchainId].list.map(blockchain => (
                          <tr key={blockchain.Hash}>
                            <td>
                              {blockchain.Height.toLocaleString(
                                navigator.language,
                                { minimumFractionDigits: 0 }
                              )}
                            </td>
                            <td className="c-hash">
                              <Link
                                to={
                                  `/block/${blockchain.Hash}${ 
                                  this.isBeacon(chainId) ? '?beacon=true' : ''}`
                                }
                              >
                                {formatHashStr(
                                  blockchain.Hash,
                                  BrowserDetect.isMobile
                                )}
                              </Link>
                            </td>
                            <td>
                              {blockchain.BlockProducer
                                ? formatProducerStr(
                                    blockchain.BlockProducer,
                                    BrowserDetect.isMobile
                                  )
                                : '[Genesis block]'}
                            </td>
                            <td className="c-hash center">
                              <Link to={`/block/${blockchain.Hash}/txs`}>
                                {blockchain.TxHashes
                                  ? blockchain.TxHashes.length
                                  : 0}
                              </Link>
                            </td>
                            <td>
                              {moment
                                .unix(blockchain.Time)
                                .format('DD/MM/YYYY, h:mm:ss A')}
                            </td>
                            <td>{moment(blockchain.Time * 1000).fromNow()}</td>
                            <td className="center">
                              {blockchain.Fee
                                ? `${(blockchain.Fee / 1e9).toLocaleString(
                                    navigator.language,
                                    {
                                      minimumFractionDigits: 2
                                    }
                                  )  } PRV`
                                : '-'}
                            </td>
                            <td className="center">
                              {blockchain.Reward
                                ? `${(blockchain.Reward / 1e9).toLocaleString(
                                    navigator.language,
                                    {
                                      minimumFractionDigits: 2
                                    }
                                  )  } PRV`
                                : '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div>
                    <div className="c-pagination" style={{ display: 'none' }}>
                      <ul>
                        <li
                          className={cn({
                            prev: page !== 1
                          })}
                        >
                          <Link
                            to={`?page=${prevPage}`}
                            onClick={e => {
                              if (page === 1) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </Link>
                        </li>
                        {page - 3 > 0 ? (
                          <li>
                            <Link to="?page=1">1</Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page - 3 > 0 ? (
                          <li>
                            <Link to="?page=2">2</Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page - 3 > 0 ? (
                          <li>
                            <Link
                              to={`?page=${page}`}
                              onClick={e => {
                                e.preventDefault();
                              }}
                            >
                              ...
                            </Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page - 2 > 0 ? (
                          <li>
                            <Link to={`?page=${page - 2}`}>{page - 2}</Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page - 1 ? (
                          <li>
                            <Link to={`?page=${page - 1}`}>{page - 1}</Link>
                          </li>
                        ) : (
                          ''
                        )}
                        <li className="active">
                          <Link
                            to={`?page=${page}`}
                            onClick={e => {
                              e.preventDefault();
                            }}
                          >
                            {page}
                          </Link>
                        </li>
                        {page + 1 <= totalPage ? (
                          <li>
                            <Link to={`?page=${page + 1}`}>{page + 1}</Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page + 2 <= totalPage ? (
                          <li>
                            <Link to={`?page=${page + 2}`}>{page + 2}</Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page + 3 < totalPage ? (
                          <li>
                            <Link
                              to={`?page=${page}`}
                              onClick={e => {
                                e.preventDefault();
                              }}
                            >
                              ...
                            </Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page + 3 < totalPage ? (
                          <li>
                            <Link to={`?page=${totalPage - 1}`}>
                              {totalPage - 1}
                            </Link>
                          </li>
                        ) : (
                          ''
                        )}
                        {page + 3 < totalPage ? (
                          <li>
                            <Link to={`?page=${totalPage}`}>{totalPage}</Link>
                          </li>
                        ) : (
                          ''
                        )}
                        <li
                          className={cn({
                            next: page !== totalPage
                          })}
                        >
                          <Link
                            to={`?page=${nextPage}`}
                            onClick={e => {
                              if (page === totalPage) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
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
    blocks: state.constant.chainBlocks,
    chainInfo: state.constant.chainInfo
  }),
  {
    actionGetBlocks: getBlocks,
    actionGetBlockChainInfo: getBlockchainInfo
  }
)(Chain);
