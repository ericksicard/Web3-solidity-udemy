import React from 'react';
import web3 from '../../ethereum/web3';
import { Button, Card, Grid } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign'
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

const CampaignShow = ({address, minimumContribution, balance, requestsCount, approversCount, manager}) => {
    
    const renderCards = () => {

        const items = [
            {
              header: manager,
              meta: 'Address of Manager',
              description: 'The Manager created this campaign and can create requests to withdraw money',
              style: { overflowWrap: 'break-word' }
            },
            {
              header: minimumContribution,
              meta: 'Minimum Contribution (wei)',
              description: 'You must contribute at least this much wei to become an approver',
              style: { overflowWrap: 'break-word' }
            },
            {
              header: requestsCount,
              meta: 'Number of Requests',
              description: 'A request try to withdraw money from a contract. Request must be approve by approvers',
              style: { overflowWrap: 'break-word' }
            },
            {
              header: approversCount,
              meta: 'Number of Approvers',
              description: 'Number of people who has already donated to this campaign',
              style: { overflowWrap: 'break-word' }
            },
            {
              header: web3.utils.fromWei(balance, 'ether'),
              meta: 'Campaign Balance (ether)',
              description: 'The balanace is how much money this campaign has left to spend',
              style: { overflowWrap: 'break-word' }
            }
          ]

          return <Card.Group items={items} />
    };
    
    
    return (
        <Layout>
        <h3>Campaign Details</h3>
        <Grid>
            <Grid.Row>
                <Grid.Column width={10}>                
                    {renderCards()}          
                </Grid.Column>
                <Grid.Column width={6}>
                    <ContributeForm address={address} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Link route={`/campaigns/${address}/requests`}>
                        <a>
                            <Button primary>View Requests</Button>
                        </a>
                    </Link>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        </Layout>        
    );
};

//Enables NEXTjs server-side rendering in a page and allows you to do initial data population 
CampaignShow.getInitialProps = async (props) => {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();
    
    return {
        address: props.query.address,
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
    }
}

export default CampaignShow;