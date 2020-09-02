<template>
    <div class="hidden_overflow nightmode-font nightmode_bg">
	<div class="container">
        <div class="count-block">
            <div class="head-area">
                <div style="color: white; text-align: center;" v-if="address">SECRET WASMBET</div>
                <div style="color: white; text-align: center;" v-if="!address">
                  <span>The extension wallet is not detected. Mnemonic Wallet</span> 
                  <!-- <span style="text-decoration: underline;" >Creating a local wallet</span> -->
                  <button class="red-button1" style="background-color: #797979" @click="createMmnemonic">Create</button>
                  <button class="red-button1" style="background-color: #797979" @click="importNemonic">Import</button>
                  <!-- <span style="text-decoration: underline;">Creating a local wallet</span> -->
                </div>
                <br>
                <div style="color: white; text-align: center;" v-if="mnemonic">{{mnemonic}}</div>
                <div style="color: white; text-align: center;" v-if="address">{{address}}</div>
            </div>
            <div class="middle-area">
                <div class="countdown-row" style="">
						          <div class="my counting-row" style="background-color: #222222; padding: 20px 20px 50px 20px; border-radius: 20px; vertical-align: middle;">
                        <div class="row justify-content-center" style="padding: 40px; text-align: center">
                          <a @click="setPosition('under')" class="postion-button" :style="(position === 'under') ? 'color:white; text-decoration: underline;' : null">
                            UNDER
                          </a>
                          <a @click="setPosition('over')" class="postion-button" :style="(position === 'over') ? 'color:white; text-decoration: underline;' : null">
                            OVER
                          </a>
								        </div>
                        <vue-slider :height="5" tooltop="always" :disabled="isBetting" v-model="prediction" :min="2" :max="57" :processStyle="{backgroundColor: '#01f593'}" :railStyle="{backgroundColor: '#ff006c'}" :tooltipStyle="{backgroundColor: '#c5a35b', borderColor: '#c5a35b' }"></vue-slider>
                        <div style="margin-bottom: 10px; color: #d9d9d9; font-size: 14px; text-align: center;">
                            <span>Bet Amount</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                          <input type="number" :disabled="isBetting" v-model="betAmount">
                          <input type="text" :value="`${winChange.toFixed(0)}%`" style="max-width:143px;">
                        </div>
                        <div style="margin-bottom: 10px; color: #d9d9d9; font-size: 14px; text-align: center;">
                            <span>Payout on Win</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <input type="number" :value="payoutOnWin.toFixed(4)" readonly>
                            <input type="text" :value="`${multiplier.toFixed(4)}X`" style="max-width:143px;" readonly>
                        </div>
                        <div style="margin-bottom: 10px; color: #d9d9d9; font-size: 14px; text-align: center;">
                            <span>Amount</span>
                        </div>
                        <div style="position: relative;">
                            <transition name="slide-fade">
                              <p v-if="show" class="result-message" :style="predictionStyle">{{resultMessage}}</p>
                            </transition>
                            <input type="number" :value="balance" readonly>
                            <button class="red-button" :disabled="isBetting" @click="betting" :style="(isBetting) ? 'background-color: #797979;' : ''">{{`ROLL ${position.toUpperCase()} ${prediction}`}}</button>
                            <!-- <button class="red-button" :disabled="isBetting" @click="test">테스트</button> -->
                        </div>
                    </div>
                    <span class="num1" id="min1" :style="predictionStyle">{{prediction}}</span>
                    <Clock ref="clock" @endSpin="endSpin"/>
                </div>
                <div class="countdown-caption">
                    <h2>Welcome!</h2>
                    <p>
                        We are happy to see you, our site is almost ready.
                    </p>
                </div>
            </div>
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
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { Encoding } from "@iov/encoding";

import Clock from './Clock';

import * as bip39 from "bip39";
import * as SecretJS from "secretjs";
import Vue from 'vue'

import { GaiaApi } from "@chainapsis/cosmosjs/gaia/api";
import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import { MsgSend } from "@chainapsis/cosmosjs/x/bank";
import { WalletProvider } from "@chainapsis/cosmosjs/core/walletProvider";

export default {
  components: {
    VueSlider,
    Clock,
  },
  name: 'app',
  data () {
    return {
      show: true,
      resultMessage: '',
      wasmbetAddress: 'https://bootstrap.pub.testnet2.enigma.co',
      contractAddress: 'secret1q7d3msna9an4eyvhm6ttur8jc3f4z38h5dtjyz',
      address: null,
      prediction: 30,
      betAmount: 1,
      cosmosJS: null,
      balance: 0,
      isBetting: false,
      position: 'over',
      secretJsClient: null,
      mnemonic: '',
      predictionStyle: {
        color: '#fff',
      },
      bettingList: [],
    }
	},
	computed: {
    payoutOnWin() {
      return this.betAmount * this.multiplier;
    },
    multiplier() {
      return  98.5 / this.winChange;
    },
    winChange() {
      return (this.position === 'over') ? 99 - this.prediction*50/30 : this.prediction*50/30;
    },
	},
  async mounted() {
    this.checkWallet();
  },
  methods: {
    async importNemonic() {
      let mnemonic = prompt('INPUT Mnemonic');
      if (mnemonic) {
        this.loadNemonicWallet(mnemonic);
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
        chainId: "enigma-pub-testnet-3",
        walletProvider: window.cosmosJSWalletProvider,
        rpc: "http://bootstrap.pub.testnet2.enigma.co:26657/",
        rest: "http://bootstrap.pub.testnet2.enigma.co:1317/"
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
      this.loadNemonicWallet();
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
      let result = info.balance.filter(item => item.denom === 'uscrt');
      if (result[0]) {
        this.balance = (result[0].amount/1000000).toFixed(2);
      }
    },
    setPosition(pos) {
      this.position = pos;
    },
    async endSpin(error) {
      this.isBetting = false;
      if (!error) {
        if ((this.bettingList[0].position === 'over' && this.bettingList[0].prediction_number < this.bettingList[0].lucky_number)
        || (this.bettingList[0].position === 'under' && this.bettingList[0].prediction_number > this.bettingList[0].lucky_number)) {
          this.predictionStyle.color = '#00e689';
          this.resultMessage = `+${this.payoutOnWin.toFixed(4)}`;
        } else {
          this.predictionStyle.color = '#ff006c';
          this.resultMessage = `-${this.betAmount.toFixed(4)}`;
        }
        await this.getAmount();
        this.show = false;
      }
    },
    async betting(positon) {
      try {
        this.isBetting = true;
        this.predictionStyle.color = '#fff';
        this.resultMessage = '';
        this.show = true;
        this.$refs.clock.startSpin();
        
        this.balance -= this.betAmount;
        await this.secretJsClient.execute(this.contractAddress, {
          "ruler": { "phrase":"allinbitewjkrwerlwerwerbfcwl",
                      "prediction_number": this.prediction,
                      "position": this.position,
                      "bet_amount": `${this.betAmount*1000000}`,
                      },
        }, "", [{ amount: `${this.betAmount*1000000}`, denom: "uscrt" }]);

        let result = await this.getBettngResult();
        this.bettingList = [result].concat(this.bettingList);
        this.$refs.clock.stopSpin(result.lucky_number);
      } catch(e) {
        console.log(e);
        alert(`ERROR: ${e.message}`);
        this.$refs.clock.stopSpin();
        this.isBetting = false;
        this.predictionStyle.color = '#fff';
        await this.getAmount();
      }
    },
    async getBettngResult() {
      let result = await this.secretJsClient.queryContractSmart(this.contractAddress, {
        "getmystate": {
          "address": this.address,
        }
      });
      return result;
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
    font-size:20px; 
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
  padding: 15px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  background-color: #c5a35b;
  cursor: pointer;
  width: 160px;
  height: 45px;
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
