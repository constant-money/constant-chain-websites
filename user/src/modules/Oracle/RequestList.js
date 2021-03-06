import React from "react";
import {connect} from "react-redux";
import dayjs from 'dayjs';
import {
  TablePagination,
  FormControl, CircularProgress,
} from '@material-ui/core';
import {} from "./Oracle.scss"
import Link from "components/Link";
import {getOracleMetadatas} from "../../services/oracle";

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

class RequestList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      oracleMetadatas: [],
      pagination: {},
    }
  }

  componentDidMount() {
    this.onGetOracleMetadatas();
  }

  onGetOracleMetadatas = async (perPage, page) => {
    const {accessToken} = this.props;
    const res = await getOracleMetadatas(accessToken, perPage, page);
    const {Result = [], Error = ""} = res.data;
    if (Error) {
      console.log("get oracle metadata error", Error);
      return;
    }
    let {Records = [], ...pagination} = Result;
    if (Records === null) Records = [];
    this.setState({oracleMetadatas: Records, pagination});
  }

  onChangePage = (page) => {
    const {pagination} = this.state;
    const {Limit = 10} = pagination;
    this.onGetOracleMetadatas(Limit, page + 1);
  }
  onChangeRowsPerPage = (perPage) => {
    console.log(perPage);
    this.onGetOracleMetadatas(perPage, 1);
  }
  // onCreateClick = () => {
  //   this.props.history && this.props.history.push && this.props.history.push('/oracle/create');
  // }

  render() {
    const {oracleMetadatas = [], pagination = {}} = this.state;

    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="hello"
                     style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                  Suggestion Oracle Board
                </div>

                <table className="c-table-portal-home" style={{minWidth: "100%", fontSize: "14px", fontWeight: 500}}>
                  <thead>
                  <tr>
                    <th>User</th>
                    <th>Request</th>
                    <th>Public Key</th>
                    <th>Created At</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {oracleMetadatas && oracleMetadatas.length > 0 ? oracleMetadatas.map((item = {}) => {
                    return (
                      <tr key={`metadata-item-${item.ID}`}>
                        <td>{item.User && (item.User.FirstName + " " + item.User.LastName)}</td>
                        <td>{item.Type.toUpperCase()}</td>
                        <td style={{width: "25%"}}><Link to={`/oracle/${item.ID}/detail`}>
                          {item.PubKeys && item.PubKeys.length > 0 && item.PubKeys.map((key = "", i) => {
                            return (
                              <p key={`p-key-${i}`}>{key}</p>
                            )
                          })}
                        </Link></td>
                        <td>{item.CreatedAt ? dayjs(item.CreatedAt).format('MM-DD-YYYY HH:mm:ss') : ""}</td>
                        <td className={item.Status}>{item.Status}</td>
                      </tr>
                    )
                  }) : <CircularProgress/>}
                  </tbody>
                </table>
                <div style={{textAlign: "right"}}>
                  {oracleMetadatas.length > 0 && pagination && Object.keys(pagination).length > 0 ?
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={pagination.TotalRecord}
                      rowsPerPage={pagination.Limit}
                      page={pagination.Page - 1}
                      SelectProps={{
                        // native: true,
                      }}
                      onChangePage={(e, p) => (this.onChangePage(p))}
                      onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e.target.value)}
                    />
                    : ""}
                </div>
                <div style={{textAlign: "right"}}>
                  <FormControl component="fieldset" style={{fontSize: "14px"}}>
                    <Link className="c-btn c-btn-primary submit" to='/oracle/create'>Make Suggestion</Link>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestList)
