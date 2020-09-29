import { LCDClient, MnemonicKey, Extension, MsgInstantiateContract, MsgExecuteContract, StdTx, StdFee, StdSignature, StdSignMsg, MsgSend} from '@terra-money/terra.js';

class MyExtension {
    // 여러 메서드를 정의할 수 있음
    constructor() {
        this.lcdClientConfig = {
            URL: 'https://terra.wasmbet.com',
            chainID: 'tequila-0004',
            gasPrices: { ukrw: 178.05 },
            gasAdjustment: 1.5,
        }
        this.isConnected = false;
        this.extension = new Extension();
        this.callback = null;
        this.beforeId = '';

        this.extension.connect();
        
        this.extension.on("onConnect", async({ address }) => {
            this.isConnected = true;
            this.address = address;
        });

        console.log('setExtenstion onPost');
        this.extension.on("onPost", async payload => {
            if (this.beforeId !== payload.id) {
                this.callback(payload);
                this.beforeId = payload.id;
            }
        });
    }

    extension() {
        return this.extension;
    }

    post(msgs, callback) {
        this.callback = callback;
        this.extension.post(msgs, this.lcdClientConfig);
    }
}

console.log('new MyExtension();');
const extension = new MyExtension();

export default extension;