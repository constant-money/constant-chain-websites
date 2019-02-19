import React from "react";
import { axios, catchError } from "services/api";
import { API } from "constants/index";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Dialog, TextInputField, toaster } from "evergreen-ui";
import _ from "lodash";
import { ProposalListItem } from "./ProposalListItem";
import { ProposalData } from "./ProposalData";
import { RightContent } from "./RightContent";

const list = [
  {
    value: 1,
    name: "DCB"
  },
  {
    value: 2,
    name: "GOV"
  }
  // {
  //   value: 3,
  //   name: "CMB"
  // }
];

const renderIf = condition => component => (condition ? component : null);

class Proposals extends React.Component {
  state = {
    currentType: 1,
    currentApplicant: {},
    proposals: [],
    amount: ""
  };

  componentDidMount() {
    this.loadCandidatesList(this.state.currentType);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentType !== prevState.currentType) {
      this.loadCandidatesList(this.state.currentType);
    }
  }

  loadCandidatesList = async type => {
    try {
      this.setState({
        isLoadingProposal: true,
        selectedApplicantIndex: null
      });
      const res = await axios.get(`${API.PROPOSAL_LIST}?board_type=${type}`);

      this.setState({
        proposals: _.get(res, "data.Result", [])
      });
    } catch (e) {
      catchError(e);
    }

    this.setState({
      isLoadingProposal: false
    });
  };

  changeType = e => {
    this.setState({ currentType: e.target.value });
  };

  vote = () => {
    const { currentApplicant, amount, currentType } = this.state;
    axios
      .post(API.PROPOSAL_VOTE, {
        BoardType: currentType,
        CandidateID: currentApplicant.ID,
        VoteAmount: Number(amount)
      })
      .then(res => {
        const { data } = res;
        if (data) {
          const { Error: resError } = data;
          if (resError) {
            toaster.warning(resError.Message);
          } else {
            toaster.success("Vote success!");
          }
        }
        this.setState({ isLoading: false, dialogVote: false });
      })
      .catch(e => {
        const { response } = e;
        const { data } = response;
        if (data) {
          const { Error: resError } = data;
          if (resError) {
            toaster.warning(resError.Message);
          }
        }
        this.setState({ isLoading: false, dialogVote: false });
        catchError(e);
      });
  };

  onlyNumber = (value, cb) => {
    if (!Number.isNaN(Number(value))) {
      cb();
    }
  };

  onSelectApplicant = index => this.setState({ selectedApplicantIndex: index });

  render() {
    const {
      currentType,
      proposals,
      amount,
      isLoading,
      dialogVote,
      isLoadingProposal,
      selectedApplicantIndex
    } = this.state;

    return (
      <div className="page user-page proposals-page">
        <Dialog
          isShown={dialogVote}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Vote"
          confirmLabel="Vote"
          isConfirmLoading={isLoading}
          onCloseComplete={() =>
            this.setState({
              dialogVote: false,
              isLoading: false,
              amount: ""
            })
          }
          onConfirm={() => {
            this.setState({ isLoading: true });
            this.vote();
          }}
        >
          <div className="withdraw-dialog">
            <div style={{ margin: "0" }}>
              <TextInputField
                label="Amount"
                placeholder="0.00"
                autoComplete="off"
                width="100%"
                type="text"
                value={amount}
                onChange={e => {
                  this.onlyNumber(e.target.value, () => {
                    this.setState({ amount: e.target.value });
                  });
                }}
              />
            </div>
          </div>
        </Dialog>
        <div className="proposal-list">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-lg-3 left-side">
                <div className="c-card">
                  <div className="title">
                    <span>Proposals</span>
                    <div className="select" style={{ float: "right" }}>
                      <Select
                        disabled={isLoadingProposal}
                        value={currentType}
                        onChange={this.changeType}
                        inputProps={{
                          name: "proposalsType",
                          id: "proposals-type"
                        }}
                      >
                        {list.map(item => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div className="clearfix" />
                  </div>
                  <div className="content">
                    {renderIf(isLoadingProposal)("Loading..")}
                    {renderIf(!isLoadingProposal)(
                      proposals.map((item, index) => (
                        <ProposalListItem
                          key={item.ID}
                          active={index === this.state.selectedApplicantIndex}
                          proposal={item}
                          onClick={this.onSelectApplicant.bind(this, index)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
              <ProposalData
                type={currentType}
                data={proposals[selectedApplicantIndex]}
              />
              <RightContent
                data={proposals[selectedApplicantIndex]}
                onClickVote={() => {
                  this.setState({ dialogVote: true });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Proposals;