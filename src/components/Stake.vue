<template>
    <div class="hidden_overflow nightmode-font nightmode_bg">
	<div class="container">
        <div class="count-block" style="height: 1200px;">
            <div class="head-area">
                <div style="color: white; text-align: center;" v-if="address">SECRET WASMBET</div>
                <div style="color: white; text-align: center;" v-if="!address">
                  <span>The extension wallet is not detected. Mnemonic Wallet</span> 
                  <!-- <span style="text-decoration: underline;" >Creating a local wallet</span> -->
                  <button class="red-button1" style="background-color: #797979" @click="createMmnemonic">Create</button>
                  <button class="red-button1" style="background-color: #797979" @click="importNemonic">Import</button>
                  <button class="red-button1" style="background-color: #797979" @click="setMasterWallet1">setMasterWallet1</button>
                  <button class="red-button1" style="background-color: #797979" @click="setMasterWallet2">setMasterWallet2</button>
                  <button class="red-button1" style="background-color: #797979" @click="setMasterWallet3">setMasterWallet3</button>
                  <button class="red-button1" style="background-color: #797979" @click="setMasterWallet4">setMasterWallet4</button>
                  <!-- <span style="text-decoration: underline;">Creating a local wallet</span> -->
                </div>
                <br>
                <div style="color: white; text-align: center;" v-if="mnemonic">{{mnemonic}}</div>
                <div style="color: white; text-align: center;" v-if="address">{{address}}</div>
            </div>
            <div class="md-layout md-gutter md-alignment-center-center justify-content-center" style="color: white;">
              <div class="md-layout-item" style="text-align: right;">
                <md-switch v-model="priority" class="md-primary">priority - soon</md-switch>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label for="movie">sort - soon</label>
                  <md-select name="movie" id="movie">
                    <md-option value="scarface">capital</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item">
                <button class="red-button" @click="showCreateCasinoDialog = true" >Create Casino</button>
              </div>
            </div>
            <div class="middle-area">
              <div style="height: 600px; overflow: overlay;">
                
                <div v-for="(casino, index) in casinos" :key="index" class="countdown-row1 text-center" style="text-align: center; margin-bottom: 20px;">
                  <div class="my counting-row" style="background-color: #222222; padding: 20px 20px 20px 20px; border-radius: 20px; vertical-align: middle;">
                    <div style="margin-bottom: 10px; color: #d9d9d9; text-align: left;">
                        <span style="font-size: 20px;">{{casino.name}}</span>
                        <span>> {{casino.description}}</span>
                    </div>
                     <div class="md-layout md-gutter" style="color: white; text-align:left; margin-top:5px; font-size:12px;">
                      <div class="md-layout-item">pool</div>
                      <div class="md-layout-item">rate of return</div>
                      <div class="md-layout-item"></div>
                    </div>
                    <div class="md-layout">
                      <div class="md-layout-item">
                        <input type="number" :disabled="true" :value="`${(casino.capital/1000000).toFixed(0)}`">
                      </div>
                      <div class="md-layout-item">
                        <input type="text" :disabled="true" :value="`${100 - casino.house_fee/10000}%`">
                      </div>
                      <div class="md-layout-item">
                        <button class="red-button" @click="$router.push(`/gamble/${casino.address}`);">Gambling</button>
                      </div>
                    </div>
                    <div class="md-layout md-gutter" style="color: white; text-align:left; margin-top:5px; font-size:12px;">
                      <div class="md-layout-item">cumulative betting coin</div>
                      <div class="md-layout-item">founder commission - soon</div>
                      <div class="md-layout-item"></div>
                    </div>
                    <div class="md-layout">
                      <div class="md-layout-item">
                        <input type="number" :value="casino.bet_cumulative_amount/1000000" readonly>
                      </div>
                      <div class="md-layout-item">
                        <input type="text" :value="`${casino.founder_commission_rate/10000}%`" readonly>
                      </div>
                      <div class="md-layout-item">
                        <button class="red-button" v-if="!casino.myStake" @click="clickShowDepositDialog(casino)" >Deposit</button>
                      </div>
                    </div>
                    <template v-if="casino.myStake">
                      <div class="md-layout md-gutter" style="color: pink; text-align:left; margin-top:5px; font-size:12px;">
                        <div class="md-layout-item">my share(rate)</div>
                        <div class="md-layout-item">profit</div>
                        <div class="md-layout-item"></div>
                      </div>
                      <div class="md-layout">
                        <div class="md-layout-item">
                          <input type="text" :value="`${(casino.myStake.ownership_percentage*casino.capital/100000000/1000000).toFixed(2)} (${casino.myStake.ownership_percentage/1000000}%)`" readonly style="color:pink;">
                        </div>
                        <div class="md-layout-item">
                          <input type="text" :value="`${(((casino.myStake.ownership_percentage*casino.capital/100000000) - (casino.myStake.begin_amount))/1000000).toFixed(2)}`" readonly style="color:pink;">
                        </div>
                        <div class="md-layout-item">
                          <button class="red-button" @click="clickShowWithdrawDialog(casino)" style='background-color: #234923;'>Withdraw</button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <md-dialog :md-active.sync="showCreateCasinoDialog">
              <md-dialog-title>Create Casino</md-dialog-title>
              <md-dialog-content  style="width: 400px;">
                <md-field>
                  <label>Casino Name</label>
                  <md-input v-model="createCasinoInput.name"></md-input>
                </md-field>
                <md-field>
                  <label>Casino Description</label>
                  <md-input v-model="createCasinoInput.description"></md-input>
                </md-field>
                <md-field>
                  <label>House Fee</label>
                  <md-input type="number" min="0" max="100" v-model="createCasinoInput.houseFee"></md-input>
                </md-field>
                <md-field>
                  <label>Founder Fee</label>
                  <md-input type="number" min="0" max="100" v-model="createCasinoInput.founderCommissionRate"></md-input>
                </md-field>
                <!-- <md-field>
                  <label>최소 배팅금액</label>
                  <md-input type="number" v-model="createCasinoInput.minBetAmount"></md-input>
                </md-field> -->
                <md-field>
                  <label>Max Bet Rate</label>
                  <md-input type="number" min="0" max="100" v-model="createCasinoInput.maxBetRate"></md-input>
                </md-field>
              </md-dialog-content>
              <md-dialog-actions>
                <md-button class="md-primary" @click="createCasino">Create</md-button>
                <md-button class="md-danger" @click="showCreateCasinoDialog = false">Close</md-button>
              </md-dialog-actions>
            </md-dialog>
            
            <md-dialog :md-active.sync="showDepositDialog">
              <md-dialog-title>Casino Deposit</md-dialog-title>
              <md-dialog-content  style="width: 800px; text-align:left;">
                <div>
                  Deposit
                </div>
                <md-table>
                  <md-table-row>
                    <md-table-head md-numeric>ID</md-table-head>
                    <md-table-head>address</md-table-head>
                    <md-table-head>share</md-table-head>
                    <md-table-head>profit</md-table-head>
                  </md-table-row>

                  
                  <md-table-row v-for="(item, index) in casinoInfo.stake" :key="index">
                    <md-table-head md-numeric>{{index + 1}}</md-table-head>
                    <md-table-head>{{item.address}}</md-table-head>
                    <md-table-head>{{`${(item.ownership_percentage/1000000).toFixed(2)}%`}}</md-table-head>
                    
                    <md-table-head>{{`${(((item.ownership_percentage*casinoInfo.capital/100000000) - (item.begin_amount))/1000000).toFixed(2)}`}}</md-table-head>
                    <!-- <md-table-head>{{`${(((casinoInfo.capital*item.ownership_percentage/1000000/100000000) - item.begin_amount/1000000)*item.ownership_percentage/100000000).toFixed(2)}`}}</md-table-head> -->
                  </md-table-row>

              </md-table>
              <div>
                Deposit Input
              </div>
              <div class="md-layout md-alignment-center-center" style="margin-top: 10px; ">
                <div class="md-layout-item md-size-30">
                  <input type="text" :value="balance" style="width:100%" :disabled="true">
                </div>
                <div class="md-layout-item md-size-30">
                  <input type="text"  v-model="depositCasinoInput.amount" style="width:100%">
                </div>
                 <div class="md-layout-item md-size-30">
                  <button class="red-button" style="width:100%" @click="deposit">Deposit</button>
                </div>
              </div>
              </md-dialog-content>
              <md-dialog-actions>
                <md-button class="md-danger" @click="showDepositDialog = false">Close</md-button>
              </md-dialog-actions>
            </md-dialog>

            <md-dialog :md-active.sync="showWithdrawDialog">
              <md-dialog-title>Casino Withdraw</md-dialog-title>
              <md-dialog-content style="width: 800px;">
                <div>
                  Withdraw
                </div>
                <md-table>
                  <md-table-row>
                    <md-table-head md-numeric>ID</md-table-head>
                    <md-table-head>address</md-table-head>
                    <md-table-head>share</md-table-head>
                    <md-table-head>profit</md-table-head>
                  </md-table-row>

                  <md-table-row v-for="(item, index) in casinoInfo.stake" :key="index">
                    <md-table-head md-numeric>{{index + 1}}</md-table-head>
                    <md-table-head>{{item.address}}</md-table-head>
                    <md-table-head>{{`${(item.ownership_percentage/1000000).toFixed(2)}%`}}</md-table-head>
                    <md-table-head>{{`${(((item.ownership_percentage*casinoInfo.capital/100000000) - (item.begin_amount))/1000000).toFixed(2)}`}}</md-table-head>
                    <!-- <md-table-head>{{`${(((casinoInfo.capital*item.ownership_percentage/1000000/100000000) - item.begin_amount/1000000)*item.ownership_percentage/100000000).toFixed(2)}`}}</md-table-head> -->
                  </md-table-row>
              </md-table>
              <div>
                Withdraw Input
              </div>
              <div class="md-layout md-alignment-center-center" style="margin-top: 10px;" v-if="casinoInfo && casinoInfo.myStake">
                <div class="md-layout-item md-size-25">
                  <input type="text" :value="`${casinoInfo.myStake.ownership_percentage*casinoInfo.capital/1000000000/100000} (${casinoInfo.myStake.ownership_percentage/1000000}%)`" readonly style="width:100%">
                </div>
                 <div class="md-layout-item md-size-25">
                  <button class="red-button" style="width:100%" @click="withdraw">Withdraw</button>
                </div>
              </div>
              </md-dialog-content>
              <md-dialog-actions>
                <md-button class="md-danger" @click="showWithdrawDialog = false">Close</md-button>
              </md-dialog-actions>
            </md-dialog>

            <footer>
                <div class="social-row">
                    <ul>
                        <li>
                            <a target="_blank" href="https://www.facebook.com"><i class="icon-fb"></i></a>
                        </li
                        ><li>
                            <a target="_blank" href="https://twitter.com/"><i class="icon-twitter"></i></a>
                        </li 
                        ><li>
                            <a target="_blank" href="https://plus.google.com/"><i class="icon-gplus"></i></a>
                        </li
                        ><li>
                            <a target="_blank" href="https://www.linkedin.com/"><i class="icon-in"></i></a>
                        </li
                        ><li>
                            <a target="_blank" href="https://www.youtube.com/"><i class="icon-youtube"></i></a>
                        </li
                        ><li>
                            <a target="_blank" href="https://www.behance.net/"><i class="icon-be"></i></a>
                        </li
                        ><li>
                            <a target="_blank" href="https://dribbble.com/"><i class="icon-dribbble"></i></a>
                        </li
                        ><li>
                            <a target="_blank" href="https://in.pinterest.com/"><i class="icon-pinterest"></i></a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    </div>
    <div class="loading-overlay" v-if="loading">
      <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
</div>
</template>

<script>
import "babel-polyfill";
import { Encoding } from "@iov/encoding";

import * as bip39 from "bip39";
import * as SecretJS from "secretjs";

import { GaiaApi } from "@chainapsis/cosmosjs/gaia/api";
import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import { MsgSend } from "@chainapsis/cosmosjs/x/bank";
import { WalletProvider } from "@chainapsis/cosmosjs/core/walletProvider";

export default {
  name: 'app',
  data () {
    return {
      show: true,
      loading: false,
      priority: false,
      showCreateCasinoDialog: false,
      showDepositDialog: false,
      showWithdrawDialog: false,
      wasmbetAddress: 'https://secret.wasmbet.com/',
      address: null,
      cosmosJS: null,
      balance: 0,
      secretJsClient: null,
      codeId: 35,
      mnemonic: '',
      casinos: [],
      casinoInfo: {},
      createCasinoInput: {
        name: '',
        description: '',
        houseFee: '1.5',
        founderCommissionRate: '10',
        minBetAmount: '1',
        maxBetRate: '10',
      },
      depositCasinoInput: {
        amount: 0,
      },
      bettingList: [],
    }
	},
  async mounted() {
    this.contractAddress = this.$route.params.contractAddress;
    this.address = this.$route.params.walletAddress;

    this.terra = new LCDClient(this.lcdClientConfig);

    console.log(this.terra);

    this.ext = new Extension();

    this.ext.connect();

    this.ext.on("onConnect", async({ address }) => {
      this.address = address;
      this.balance = parseInt((await this.terra.bank.balance(address)).get("ukrw").amount.toString())/1000000;
      console.log(this.balance);
      await this.getCasinoList();
    });
  },
  methods: {
    async setMasterWallet1() {
      this.loading = true;
      await this.loadNemonicWallet("build ankle defense elbow love black joke budget party sort grace spawn fortune abuse found color trophy fever fetch survey fat display satisfy give");
      await this.getCasinoList();
      this.loading = false;
    },
    async setMasterWallet2() {
      this.loading = true;
      await this.loadNemonicWallet("phrase because tail because urge sunset dash spy myth tape smooth pill");
      await this.getCasinoList();
      this.loading = false;
    },
    async setMasterWallet3() {
      this.loading = true;
      await this.loadNemonicWallet("author leave multiply episode profit sudden derive layer there three enroll sick");
      await this.getCasinoList();
      this.loading = false;
    },
    async setMasterWallet4() {
      this.loading = true;
      await this.loadNemonicWallet("drastic edge taste excite inspire silent sick matter satisfy diary copper exchange");
      await this.getCasinoList();
      this.loading = false;
    },
    async deposit() {
      if (this.depositCasinoInput.amount > 1) {
        try {
          this.loading = true;
          this.balance -= this.depositCasinoInput.amount;
          await this.secretJsClient.execute(
            this.casinoInfo.address, 
            {
              try_capital_deposit: {},
            }, 
            "",
            [{ amount: `${this.depositCasinoInput.amount*1000000}`, denom: "uscrt" }]
          );
          this.showDepositDialog = false;
          this.loading = false;
          await this.getAmount();
          await this.getCasinoList();
        } catch(e) {
          console.log(e);
          this.loading = false;
        }
      }
    },
    async withdraw() {
      if (confirm('real withdraw?')) {
        try {
          this.loading = true;
          await this.secretJsClient.execute(
            this.casinoInfo.address, 
            {
              try_capital_withdraw: {},
            }, 
            "",
            null
          );
          this.showWithdrawDialog = false;
          this.loading = false;
          await this.getAmount();
          await this.getCasinoList();
        } catch(e) {
          console.log(e);
          this.loading = false;
        }
      }
    },
    clickShowDepositDialog(casino) {
      this.showDepositDialog = true;
      this.setCasino(casino);
    },
    clickShowWithdrawDialog(casino) {
      this.showWithdrawDialog = true;
      this.setCasino(casino);
    },
    setCasino(casino) {
      this.casinoInfo = casino;
      console.log(casino);
    },
    async getCasinoList() {
      const data = await this.secretJsClient.getContracts(this.codeId);
      const casinos = [];
      for (let i=0; i<data.length; i++) {
        let data2 = await this.secretJsClient.queryContractSmart(
          data[i].address,
          { get_casino_stake_info: {} },
        );
        // let data3 = await this.secretJsClient.queryContractSmart(
        //   data[i].address,
        //   { get_stake_info: {} },
        // );
        console.log(data2);
        casinos.push({
          ...data[i],
          ...data2.casino,
          stake: data2.stake,
          myStake: data2.stake.filter(item => item.address === this.address)[0],
        });
        // const address = SecretJS.pubkeyToAddress(
        //   SecretJS.encodeSecp256k1Pubkey(data2.casino.address),
        //   "secret"
        // );
        // console.log(address);
      }
      this.casinos = casinos;
    },
    async createCasino() {
      try {
        if (this.createCasinoInput.name && this.createCasinoInput.description && this.createCasinoInput.houseFee && 
        this.createCasinoInput.founderCommissionRate && this.createCasinoInput.minBetAmount && this.createCasinoInput.maxBetRate) {
          this.loading = true;
          await this.secretJsClient.instantiate(
            this.codeId,
            {
              CreateCasino: { 
                name: this.createCasinoInput.name,
                description: this.createCasinoInput.description,
                house_fee: parseInt((parseFloat(this.createCasinoInput.houseFee)*10000).toFixed(0)),
                founder_commission_rate: parseInt((parseFloat(this.createCasinoInput.founderCommissionRate)*10000).toFixed(0)),
                min_bet_amount: this.createCasinoInput.founderCommissionRate,
                max_bet_rate:  parseInt((parseFloat(this.createCasinoInput.maxBetRate)*10000).toFixed(0)), //this.createCasinoInput.maxBetRate
                seed: SecretJS.EnigmaUtils.GenerateNewSeed().toString(),
              },
            },
            `wasmbet-${this.createCasinoInput.name}`
          );
          this.showCreateCasinoDialog = false;
          await this.getCasinoList();
          this.loading = false;
        } else {
          alert('정보를 정확히 입력해주세요', 'wasmbet');
          return;
        }
      } catch (e) {
        this.loading = false;
        alert(e.message);
        console.log("createCasino1", e);
        console.log("createCasino2", e.message);
      }
    },
    async importNemonic() {
      let mnemonic = prompt('INPUT Mnemonic');
      if (mnemonic) {
        await this.loadNemonicWallet(mnemonic);
        await this.getCasinoList();
      }
    },
    async checkWallet() {
      console.log(window.cosmosJSWalletProvider);
      if (window.cosmosJSWalletProvider) {
        await this.loadWallet();
      } else {
        setTimeout(() => this.checkWallet(), 1000);
      }
    },
    async loadWallet() {
      this.cosmosJS = new GaiaApi({
        chainId: "test",
        walletProvider: window.cosmosJSWalletProvider,
        rpc: "http://51.132.234.211:26657/",
        rest: "https://wasmbet.com"
      });
      await this.cosmosJS.enable();
      this.address = (await this.cosmosJS.getKeys())[0].bech32Address;
      
      let signing = async (signBytes) => ({
        pub_key: SecretJS.encodeSecp256k1Pubkey((await this.cosmosJS.getKeys())[0].pubKey),
        signature: Encoding.toBase64(await window.cosmosJSWalletProvider.sign(this.cosmosJS.context, this.address, signBytes)),
      })

      this.secretJsClient = new SecretJS.SigningCosmWasmClient(
        this.wasmbetAddress,
        this.address,
        (signBytes) => signing(signBytes),
        null,
        {
          init: {
            amount: [{ amount: "200000", denom: "uscrt" }],
            gas: "200000",
          },
          exec: {
            amount: [{ amount: "200000", denom: "uscrt" }],
            gas: "200000",
          },
        }
      );
      this.getAmount();
    },
    async createMmnemonic() {
      this.mnemonic = bip39.generateMnemonic();
      await this.loadNemonicWallet(this.mnemonic);
      await this.getCasinoList();
    },
    async loadNemonicWallet(mnemonic) {
      try {
        if (!mnemonic) {
          mnemonic = bip39.generateMnemonic();
        }

        let tx_encryption_seed = localStorage.getItem("tx_encryption_seed");
        if (tx_encryption_seed) {
          tx_encryption_seed = Uint8Array.from(
            JSON.parse(`[${tx_encryption_seed}]`)
          );
        } else {
          tx_encryption_seed = SecretJS.EnigmaUtils.GenerateNewSeed();
        }

        const signingPen = await SecretJS.Secp256k1Pen.fromMnemonic(mnemonic);
        const myWalletAddress = SecretJS.pubkeyToAddress(
          SecretJS.encodeSecp256k1Pubkey(signingPen.pubkey),
          "secret"
        );
        this.address = myWalletAddress;
        const secretJsClient = new SecretJS.SigningCosmWasmClient(
          this.wasmbetAddress,
          myWalletAddress,
          (signBytes) => signingPen.sign(signBytes),
          null,
          {
            init: {
              amount: [{ amount: "200000", denom: "uscrt" }],
              gas: "200000",
            },
            exec: {
              amount: [{ amount: "200000", denom: "uscrt" }],
              gas: "200000",
            },
          }
        );
        this.mnemonic = mnemonic;
        this.secretJsClient = secretJsClient;
        this.getAmount();

      } catch (e) {
        alert(e.message);
        console.log(e);
      }
    },
    async getAmount() {
      let info = await this.secretJsClient.getAccount(this.address);
      if (info && info.balance) {
        let result = info.balance.filter(item => item.denom === 'uscrt');
        if (result[0]) {
          this.balance = parseFloat(result[0].amount/1000000).toFixed(2);
        }
      } else {
        this.balance = 0;
      }
    },
  },
}
</script>

<style scoped>
@import '../assets/css/style.css';

input {
    padding: 4px;
    -webkit-appearance: none; 
    -moz-appearance: none; 
		border: 1px solid #797979;
		border-radius: 5px;
    font-size:14px; 
    background-color: #2f2f2f;
    color: white; 
    padding: 10px 10px; 
    text-align:center;
    font-weight: 100 !important;
    margin-right: 10px;
}

.postion-button {
   max-width: 500px; 
   margin-top: 30px; 
   font-size: 20px;
   color: #a9a9a9; 
   padding: 50px; 
   cursor: pointer;

}
.red-button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  /* padding: 15px 12px; */
  text-align: center;
  text-decoration: none;
  display: inline-block;
  /* font-size: 16px; */
  background-color: #c5a35b;
  cursor: pointer;
  width: 160px;
  height: 38px;
  border-radius: 5px;
}

.num1 {
  font-size: 200px; 
  color: white; 
  font-family: 'Arial'; 
  margin: 50px 50px 50px 50px;
  vertical-align: middle;
  margin-bottom: 18px;
}

.vue-slider {
  margin-bottom: 20px;
}

.vue-slider-process {
    background-color: #01f593 !important;
}

.my .slider {
    background-color: #ff006c !important;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
.result-message {
  position: absolute; 
  font-size:20px; 
  top: -14px; 
  left: 160px;
}

.loading-overlay {
  z-index: 100000000000;
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  color: white;
  stroke: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-overlay2 circle {
  stroke: #878787 !important;
}

.loading-overlay2 {
  z-index: 100000000000;
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  color: #878787;
  stroke: #878787;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-overlay circle {
  stroke: white !important;
}
</style>
