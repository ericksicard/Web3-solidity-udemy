import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

const RequestNew = ({address}) => {

    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [recepient, setRecepient] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChanges = (event, id) => {
        if ( id == 'desc') setDescription(event.target.value)
        if ( id == 'val') setValue(event.target.value)
        if ( id == 'recp') setRecepient(event.target.value)
    }

    const onSubmitHandler = async event => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage('');

        const campaign = Campaign(address);

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
            .createRequest(description, web3.utils.toWei(value, 'ether'), recepient)
            .send({ from: accounts[0] });

            Router.pushRoute(`/campaigns/${address}/requests`);
            
        } catch (err) {
            setErrorMessage(err.message);
        }

        setLoading(false);
    };

    return(
        <Layout>
            
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmitHandler} error={!!errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input 
                        value={description}
                        onChange={ event => handleChanges( event, 'desc' )}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input 
                        value={value}
                        onChange={ event => handleChanges( event, 'val' )}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recepient</label>
                    <Input 
                        value={recepient}
                        onChange={ event => handleChanges( event, 'recp' )}
                    />
                </Form.Field>
                <Message
                    error
                    header='There was some errors with your submission'
                    content={errorMessage}
                />
                <Button primary loading={loading}>Create</Button>
                <Link route={`/campaigns/${address}/requests`}>
                <a>
                    <Button primary >Back</Button>
                </a>
            </Link>
            </Form>
        </Layout>
    )
}

//Enables NEXTjs server-side rendering in a page and allows you to do initial data population 
RequestNew.getInitialProps = async (props) => {
    const { address } = props.query;    
    return { address };
}

export default RequestNew;