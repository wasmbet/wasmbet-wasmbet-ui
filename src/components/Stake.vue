<template>
    <div class="hidden_overflow nightmode-font nightmode_bg">
	<div class="container">
        <div class="count-block" style="height: 1200px;">
            <div class="head-area">
                <div style="color: white; text-align: center;" v-if="address">TERRA WASMBET</div>
                <div style="color: white; text-align: center;" v-if="!address">
                  <span>The extension wallet is not detected.</span> 
                  <a href="https://terra.money/extension" target="_blank">install Terra Station(wallet)</a>
                </div>
                <br>
                <div style="color: white; text-align: center;" v-if="address">My Address: {{address}}</div>
                <div style="color: white; text-align: center;">
                  <span>KRW: {{balance}}</span>
                  <a href="javascript:void(0)" @click="getAmount" style="text-align: center;">(refresh)</a>
                  <a href="https://faucet.terra.money/" target="_blank" style="text-align: center;">(faucet)</a>
                </div>
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
              <div class="md-layout-item">
                <button class="red-button" @click="getCasinoList" >Refresh Casino</button>
              </div>
            </div>
            <div class="middle-area">
              <div style="height: 600px; overflow: overlay;">
                
                <div v-for="(casino, index) in casinos" :key="index" class="countdown-row1 text-center" style="text-align: center; margin-bottom: 20px;">
                  <div class="my counting-row" style="background-color: #222222; padding: 20px 20px 20px 20px; border-radius: 20px; vertical-align: middle;">
                    <div style="margin-bottom: 10px; color: #d9d9d9; text-align: left;">
                        <span style="font-size: 20px;">{{casino.name}}</span>
                        <!-- <span>> {{casino.description}}</span> -->
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
                        <button class="red-button" @click="$router.push(`/gamble/${casino.contract_address}`)">Gambling</button>
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
                <!-- <md-field>
                  <label>Casino Description</label>
                  <md-input v-model="createCasinoInput.description"></md-input>
                </md-field> -->
                <md-field>
                  <label>House Fee</label>
                  <md-input type="number" min="0" max="100" v-model="createCasinoInput.houseFee"></md-input>
                </md-field>
                <md-field>
                  <label>Founder Fee (soon)</label>
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
                  <button class="red-button" style="width:100%" @click="deposit">deposit</button>
                </div>
              </div>
              </md-dialog-content>
              <md-dialog-actions>
                <md-button class="md-danger" @click="showDepositDialog = false">Close</md-button>
              </md-dialog-actions>
            </md-dialog>


            <md-dialog :md-active.sync="showWithdrawDialog">
              <md-dialog-title>Casino Withdraw</md-dialog-title>
              <md-dialog-content  style="width: 800px;">
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
</div>
</template>

<script>
import "babel-polyfill";
import { Encoding } from "@iov/encoding";

import extension from '../assets/js/extension'

import Clock from './Clock';

import * as bip39 from "bip39";
import Vue from 'vue'

import axios from "axios";

import { LCDClient, MnemonicKey, Extension, MsgInstantiateContract, MsgExecuteContract, StdTx, StdFee, StdSignature, StdSignMsg, MsgSend} from '@terra-money/terra.js';

export default {
  name: 'app',
  data () {
    return {
      show: true,
      showCreateCasinoDialog: false,
      showDepositDialog: false,
      showWithdrawDialog: false,
      contractAddress: null,
      address: null,
      prediction: 30,
      betAmount: 20000000,
      terra: null,
      ext: null,
      priority: false,
      balance: 0,
      isBetting: false,
      position: 'over',
      codeId: 143,
      lcdClientConfig: {
        URL: 'https://terra.wasmbet.com',
        chainID: 'tequila-0004',
        gasPrices: { ukrw: 178.05 },
        gasAdjustment: 1.5,
      },
      predictionStyle: {
        color: '#fff',
      },
      casinos: [

      ],
      casinoInfo: {},
      createCasinoInput: {
        name: '',
        description: 'wasmbet-test2-O8v6DSxLB6dGDn9EGHdPyDaVw5Sxf9uQKCjSNBtL8cs=',
        houseFee: '1.5',
        founderCommissionRate: '10',
        minBetAmount: '1',
        maxBetRate: '10',
      },
      depositCasinoInput: {
        amount: 0,
      },
      loading: false,
      bettingList: [],
    }
	},
  async mounted() {
    this.terra = new LCDClient(this.lcdClientConfig);

    this.ext = extension;
    this.address = extension.address;
    this.loadExtension();
  },
  methods: {
    loadExtension() {
      setTimeout(() => {
        if (this.ext.address) {
          this.address = this.ext.address;
          this.getAmount();
          this.getCasinoList();
        } else {
          this.loadExtension();
        }
      }, 1000);
    },
    async createCasino() {
      try {
        if (this.createCasinoInput.name && this.createCasinoInput.description && this.createCasinoInput.houseFee && 
        this.createCasinoInput.founderCommissionRate && this.createCasinoInput.minBetAmount && this.createCasinoInput.maxBetRate) {
          const instantiate = new MsgInstantiateContract(
            this.address, // owner
            this.codeId, // code ID
            {
              CreateCasino: { 
                name: this.createCasinoInput.name,
                description: this.createCasinoInput.description,
                house_fee: parseInt((parseFloat(this.createCasinoInput.houseFee)*10000).toFixed(0)),
                founder_commission_rate: parseInt((parseFloat(this.createCasinoInput.founderCommissionRate)*10000).toFixed(0)),
                min_bet_amount: this.createCasinoInput.founderCommissionRate,
                max_bet_rate:  parseInt((parseFloat(this.createCasinoInput.maxBetRate)*10000).toFixed(0)), //this.createCasinoInput.maxBetRate
                seed: `${new Date().getTime()}${Math.random()*100000000}`,
              },
            }, // InitMsg
            {}, // init coins
            false // migratable
          );

          this.ext.post([instantiate], this.createCasinoCallback);
        } else {
          alert('정보를 정확히 입력해주세요', 'wasmbet');
          return;
        }
      } catch (e) {
        alert(e.message);
        console.log("createCasino1", e);
        console.log("createCasino2", e.message);
      }
    },
    createCasinoCallback(payload) {
      console.log("createCasinoCallback");
      console.log(payload);

      if (payload.success) {
        this.showCreateCasinoDialog = false;
        this.createCasinoInput = {
          name: '',
          description: 'wasmbet-test2-O8v6DSxLB6dGDn9EGHdPyDaVw5Sxf9uQKCjSNBtL8cs=',
          houseFee: '1.5',
          founderCommissionRate: '10',
          minBetAmount: '1',
          maxBetRate: '10',
        };
        this.getAmount();
        this.getCasinoList();
      } else {
        alert('error => check console.log');
      }
    },
    async deposit() {
      if (this.depositCasinoInput.amount > 1) {
        this.balance -= this.depositCasinoInput.amount;

        const execute = new MsgExecuteContract(
          this.address, // sender
          this.casinoInfo.contract_address, // contract account address
          { 
            try_capital_deposit: {},
          }, // handle msg
          { ukrw: this.depositCasinoInput.amount*1000000 } // coins
        );

        this.ext.post([execute], this.depositCasinoCallback);

      }
    },
    async depositCasinoCallback(payload) {
      console.log('depositCasinoCallback');
      console.log(payload);
      if (payload.success) {
        this.showDepositDialog = false;
        this.depositCasinoInput = {
          amount: 0,
        };
        await this.sleep(1);
        await this.getAmount();
        await this.getCasinoList();
      } else {
        alert('error => check console.log');
      }
    },
    async withdraw() {
      if (confirm('real withdraw?')) {
        const execute = new MsgExecuteContract(
          this.address, // sender
          this.casinoInfo.contract_address, // contract account address
          { 
            try_capital_withdraw: {},
          }, // handle msg
          {}, // coins
        );

        this.ext.post([execute], this.withdrawCasinoCallback);
      }
    },
    async withdrawCasinoCallback(payload) {
      console.log('withdrawCasinoCallback');
      console.log(payload);
      if (payload.success) {
        await this.sleep(1);
        this.showWithdrawDialog = false;
        this.depositCasinoInput = {
          amount: 0,
        };
        await this.getAmount();
        await this.getCasinoList();
      } else {
        alert('error => check console.log');
      }
    },
    async sleep(sec) {
      return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), sec);
      });
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
      let result = await axios.get("https://tequila-fcd.terra.dev/v1/wasm/contracts?page=1&limit=100&search=wasmbet-test2-O8v6DSxLB6dGDn9EGHdPyDaVw5Sxf9uQKCjSNBtL8cs=");
      console.log(result.data.contracts);
      const casinos = [];
      for (let i=0; i<result.data.contracts.length; i++) {
        const casinoInfo = await this.terra.wasm.contractQuery(
          result.data.contracts[i].contract_address,
          {
            get_casino_stake_info: {},
          } // query msg
        );
        casinos.push({
          ...result.data.contracts[i],
          ...casinoInfo.casino,
          stake: casinoInfo.stake,
          myStake: casinoInfo.stake.filter(item => item.address === this.address)[0],
        });
      }
      this.casinos = casinos;
      this.getAmount();
    },
    async getAmount() {
      this.balance = (parseInt((await this.terra.bank.balance(this.address)).get("ukrw").amount.toString())/1000000).toFixed(2);
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
</style>
