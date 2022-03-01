import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

const RequestIndex = ({address, requests, requestCount, approversCount}) => {

    const { Header, Row, HeaderCell, Body, Cell } = Table;

    const renderRow = () => {
        const rows = requests.map( (request, idx) => {
            return <RequestRow
                key= {idx} 
                id= {idx}
                request = {request}
                address= {address}
                approversCount= {approversCount}
            />
        });
        return rows;
    }

    return(
        <Layout>
            <h3>Requests</h3>
            <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated='right' style={{ marginBottom: 10 }}>Add Request</Button>
                </a>
            </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recepient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRow()}
                </Body>
            </Table>
            <div>Found {requestCount} requests</div>
        </Layout>
    );
};

//Enables NEXTjs server-side rendering in a page and allows you to do initial data population 
RequestIndex.getInitialProps = async (props) => {
    const { address } = props.query;    
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    // Promise.all resolves in an array when all the promises passed resolved, Array(#) created an array of dimenssion #
    // fill() fills the array with the results from the mapp() 
    const requests =  await Promise.all(
        Array(parseInt(requestCount))
        .fill()
        .map( (el, idx) => {
           return campaign.methods.requests(idx).call();
        })
    );

    return {address, requests, requestCount, approversCount};
}

export default RequestIndex;