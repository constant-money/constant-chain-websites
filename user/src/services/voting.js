import axios from 'axios';
import {API, BOARD_TYPES} from '../constants'

export async function loadUserCandidate(token) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_CANDIDATE_ME,
  };

  const response = await axios(options);
  return response
}

export async function loadCandidates(token, boardType = "") {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.VOTING_CANDIDATE_LIST}${boardType !== "" ? `?board_type=${boardType}` : ""}`,
  };

  const response = await axios(options);
  return response
}

export async function loadCandidateDetail(token, id) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.VOTING_CANDIDATE_DETAIL}/${id}`,
  };

  const response = await axios(options);
  return response
}

export async function loadDcbParams(token) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_DCB_PARAMS,
  };

  const response = await axios(options);
  return response
}

export async function loadProposalBuyingAssets(token) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_PROPOSAL_BUYING_ASSETS,
  };

  const response = await axios(options);
  return response
}

export async function loadProposalSellingAssets(token) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_PROPOSAL_SELLING_ASSETS,
  };

  const response = await axios(options);
  return response
}

export async function loadProposals(token, boardType = "") {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.VOTING_PROPOSAL_LIST}${boardType !== "" ? `?board_type=${boardType}` : ""}`,
  };

  const response = await axios(options);
  return response
}

export async function loadProposalDetail(token, id) {
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: `${API.VOTING_PROPOSAL_DETAIL}/${id}`,
  };

  const response = await axios(options);
  return response
}

export async function voteCandidate(token, boardType, candidate, voteAmount) {
  const data = {
    BoardType: boardType,
    CandidateID: candidate.ID,
    VoteAmount: voteAmount,
  }

  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_CANDIDATE_VOTE,
    data
  };

  const response = await axios(options);
  return response
}

export async function voteProposal(token, boardType, proposal, voteAmount) {
  const data = {
    BoardType: boardType,
    ProposalID: proposal.ID,
    VoteAmount: voteAmount,
  }

  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_PROPOSAL_VOTE,
    data
  };

  const response = await axios(options);
  return response
}

export async function apply(token, address = '', type = '') {
  const data = {
    PaymentAddress: address,
    BoardType: type
  }

  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_CANDIDATE_APPLY,
    data
  };

  const response = await axios(options);
  return response
}

async function createProposal(token, data) {
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    url: API.VOTING_PROPOSAL,
    data
  };

  const response = await axios(options);
  return response
}

export async function createDcbProposal(token, name = '', executeDuration = 0, explanation = '', dcbParams = {}) {
  const {
    ListSaleData,
    MinLoanResponseRequire,
    MinCMBApprovalRequire,
    LateWithdrawResponseFine,
    SaleDCBTokensByUSDData,
    ListLoanParams
  } = (dcbParams) || {};

  const data = {
    Type: BOARD_TYPES.DCB,
    Name: name,
    DCB: {
      DCBParams: {
        TradeBonds: [],
        ListSaleData: ListSaleData ? ListSaleData.map(sale => ({
          SaleID: "123456", // TODO - remove SaleID
          EndBlock: parseInt(sale.EndBlock, 10),
          BuyingAsset: sale.BuyingAsset,
          BuyingAmount: parseInt(sale.BuyingAmount, 10),
          SellingAsset: sale.SellingAsset,
          SellingAmount: parseInt(sale.SellingAmount, 10)
        })) : [],
        MinLoanResponseRequire: parseInt(
          MinLoanResponseRequire,
          10
        ) || 0,
        MinCMBApprovalRequire: parseInt(
          MinCMBApprovalRequire,
          10
        ) || 0,
        LateWithdrawResponseFine: parseInt(
          LateWithdrawResponseFine,
          10
        ) || 0,
        SaleDCBTokensByUSDData: SaleDCBTokensByUSDData && {
          Amount: parseInt(
            SaleDCBTokensByUSDData.Amount,
            10
          ) || 0,
          EndBlock: parseInt(
            SaleDCBTokensByUSDData.EndBlock,
            10
          ) || 0
        },
        ListLoanParams: ListLoanParams ? ListLoanParams.map(loan => ({
          InterestRate: parseInt(loan.InterestRate, 10),
          Maturity: parseInt(loan.Maturity, 10),
          LiquidationStart: parseInt(loan.LiquidationStart, 10)
        })) : []
      },
      ExecuteDuration: parseInt(executeDuration, 10) || 0,
      Explanation: explanation,
      PaymentAddress: "",
      ConstitutionIndex: 0,
    }
  }

  const response = await createProposal(token, data)
  return response
}

