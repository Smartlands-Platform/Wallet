import React from 'react';
import { Button, List, Message, Modal } from 'semantic-ui-react';
import { get } from 'lodash';

class ErrorModal extends React.Component {
  render() {
    const error = this.props.errorData;

    if (!error) {
      return null;
    }

    const resultCodes = error.data ? error.data.extras.result_codes.operations : error.response.data.extras.result_codes.operations;
    const resultTransaction = error.data ? error.data.extras.result_codes.transaction : error.response.data.extras.result_codes.transaction;
    let errorCodeText;
    if(!!resultCodes && resultCodes.length === 1){
        errorCodeText = <div>
            Error codes :
            <ul>
                {
                    resultCodes ?
                        resultCodes[0]
                        : null
                }
            </ul>
        </div>
    }else if(!!resultTransaction){
        errorCodeText = <div>
            Error codes :

                    {resultTransaction}

        </div>
    }else{
        errorCodeText = <div>
                    {Error}

        </div>
    }


    const title = error.data ? error.data.title : error.response.data.title;
    return (
          <Modal className="error_modal" open={this.props.open}>
            <Modal.Header style={{ color: 'red' }}>Operation error</Modal.Header>
            <Modal.Content >
              <Modal.Description>
                <Message negative>
                  <Message.Header>There was an error with your transaction.</Message.Header>
                  <p>{title}</p>
                </Message>
                {errorCodeText}
                {/*JSON error:*/}
                {/*<pre>{JSON.stringify(error, null, 2)}</pre>*/}
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => this.props.closeErrorModal()} primary>Close</Button>
            </Modal.Actions>
          </Modal>
    );
  }
}

ErrorModal.propTypes = {
  open: React.PropTypes.bool,
  errorData: React.PropTypes.object,
  closeErrorModal: React.PropTypes.func.isRequired,
};

export default ErrorModal;
