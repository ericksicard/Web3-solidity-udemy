import React, { useState } from 'react';
import web3 from '../ethereum/web3';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign'
import { Router } from '../routes';

const ContributeForm = ( props ) => {

    const [contribution, setContribution] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const inputChangeHandler = event => {
        setContribution(event.target.value)
    };

    const onSubmitHandler = async event => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const campaign = Campaign(props.address);

        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(contribution, 'ether')
            })

        } catch (err) {
            setErrorMessage( err.message )
        }

        setLoading(false);
        setContribution('');
        Router.replaceRoute(`/campaigns/${props.address}`);

    };

    return (
        <Form onSubmit={onSubmitHandler} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input 
                    label='ether'
                    labelPosition='right'
                    value={contribution}
                    onChange={inputChangeHandler}
                />
            </Form.Field>
            <Message
                    error
                    header='There was some errors with your submission'
                    content={errorMessage}
            />
            <Button loading={loading} primary>
                Contribute
            </Button>
        </Form>
    )
};

export default ContributeForm;