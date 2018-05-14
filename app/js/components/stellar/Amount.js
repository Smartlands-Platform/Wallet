import React, { PropTypes } from 'react';
import Decimal from 'decimal.js';

const AmountComponent = ({ amount, accountId, payment }) => {
  let amountCount = amount;
  const amountStyle = {};
  if (accountId && payment && accountId === payment.from) {
    amountStyle.color = '#2C662D';
  } else if (accountId) {
    amountStyle.color = '#9F3A38';
  }
  const bnAmount = new Decimal(String(amountCount) || (payment && payment.amount));

  return (
      <span style={amountStyle}>{bnAmount.toString()}</span>
  );
};

AmountComponent.propTypes = {
  amount: PropTypes.string,
  accountId: PropTypes.string,
  payment: PropTypes.object,
};

export default AmountComponent;
