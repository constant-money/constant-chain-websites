import React from "react";
import styled from "styled-components";
import _ from "lodash";

function getLabel(options, value) {
  return (options.find(option => option.value === value) || {}).label;
}

function renderDcbField(key, value, options) {
  if (typeof value === "number" || typeof value === "string") {
    return (
      <Field key={key}>
        <Label>{_.startCase(key)}</Label>
        <Value>{value}</Value>
      </Field>
    );
  }
  if (key === "ListLoanParams") {
    return (
      <fieldset key={key}>
        <legend>List Loan Params</legend>
        {value.map((loan, index) => {
          return (
            <React.Fragment key={index}>
              <Field>
                <Label>Interest Rate</Label>
                <Value>{loan.InterestRate}</Value>
              </Field>
              <Field>
                <Label>Liquidation Start</Label>
                <Value>{loan.LiquidationStart}</Value>
              </Field>
              <Field>
                <Label>Maturity</Label>
                <Value>{loan.Maturity}</Value>
              </Field>
            </React.Fragment>
          );
        })}
      </fieldset>
    );
  }
  if (key === "ListSaleData") {
    return (
      <fieldset key={key}>
        <legend>List Sale Data</legend>
        {value.map((sale, index) => {
          return (
            <React.Fragment key={index}>
              <Field>
                <Label>End block</Label>
                <Value>{sale.EndBlock}</Value>
              </Field>
              <Field>
                <Label>Buying Asset</Label>
                <Value>
                  {getLabel(options.buyingAssetOptions, sale.BuyingAsset)}
                </Value>
              </Field>
              <Field>
                <Label>Buying Amount</Label>
                <Value>{sale.BuyingAmount}</Value>
              </Field>
              <Field>
                <Label>Selling Asset</Label>
                <Value>
                  {getLabel(options.sellingAssetOptions, sale.SellingAsset)}
                </Value>
              </Field>
              <Field>
                <Label>Selling Amount</Label>
                <Value>{sale.SellingAmount}</Value>
              </Field>
            </React.Fragment>
          );
        })}
      </fieldset>
    );
  }
  if (key === "SaleDCBTokensByUSDData") {
    return (
      <fieldset key={key}>
        <legend>Sale DCB Tokens By USD Data</legend>
        <Field>
          <Label>Amount</Label>
          <Value>{value.Amount}</Value>
        </Field>
        <Field>
          <Label>End Block</Label>
          <Value>{value.EndBlock}</Value>
        </Field>
      </fieldset>
    );
  }
  return <div key={key} unhandledfield={key}/>;
}

export function ProposalData({type, data = {}, options}) {
  const proposal = React.useMemo(() => {
    try {
      return JSON.parse(data.Data);
    } catch (e) {
      return {};
    }
  }, [data]);

  return (
    <div className="col-12 col-lg-6">
      <div className="c-card">
        {_.isEmpty(proposal) && (
          <div className="empty">Please select proposal</div>
        )}
        {!_.isEmpty(proposal) && (
          <ProposalWrapper>
            <Title>{data.Name}</Title>
            {Object.entries(proposal).map(([key, value]) => renderDcbField(key, value, options))}
          </ProposalWrapper>
        )}
      </div>
    </div>
  );
}

const ProposalWrapper = styled.div``;

const Field = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.div``;

const Value = styled.div`
  color: #050c33;
  font-size: 16px;
  padding-left: 4px;
  min-height: 24px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #050c33;
`;
