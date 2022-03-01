import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0x7A190410b2403eBb522E164782C4C0631f978108'
);

export default instance;