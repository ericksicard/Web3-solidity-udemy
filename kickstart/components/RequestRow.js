import React from 'react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Table, Button } from 'semantic-ui-react';

const RequestRow = (props) => {
    const { Row, Cell } = Table;
    const { id, request, address, approversCount } = props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    const onApprove = async () => {
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(id).send({
            from: accounts[0]
        });
    };

    const onFinalize = async () => {
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(id).send({
            from: accounts[0]
        });
    };

    return (
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>{request.approvalCount}/{approversCount}</Cell>
            <Cell>
                {request.complete ? null : (<Button basic color='green' onClick={onApprove}>Approve</Button>)}
            </Cell>
            <Cell>
            {request.complete ? null : (<Button basic color='red' onClick={onFinalize}>Finalize</Button>)}
            </Cell>
        </Row>
    )
};

export default RequestRow