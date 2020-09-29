<template>
    <div class="hidden_overflow nightmode-font nightmode_bg">
	<div class="container">
        <div class="count-block">
            <div class="head-area">
                <div>
                  <button @click="$router.push('/')">stake</button>
                </div>
                <div style="color: white; text-align: center;" v-if="address">TERRA WASMBET</div>
                <div style="color: white; text-align: center;" v-if="!address">
                  <span>The extension wallet is not detected. </span> 
                  <a href="https://terra.money/extension" target="_blank">install Terra Station(wallet)</a>
                </div>
                <br>
                <div style="color: white; text-align: center;" v-if="address">{{address}}</div>
                <div style="color: white; text-align: center;" v-if="address">CASINO ADDRESS : {{contractAddress}}</div>
            </div>
            <div class="middle-area">
                <div class="countdown-row" style="">
						          <div class="my counting-row" style="background-color: #222222; padding: 20px 20px 50px 20px; border-radius: 20px; vertical-align: middle;">
                        <div class="row justify-content-center" style="padding: 40px; text-align: center">
                          <a @click="setPosition('under')" class="postion-button" :style="(position === 'under') ? 'color:white !important; text-decoration: underline;' : null">
                            UNDER
                          </a>
                          <a @click="setPosition('over')" class="postion-button" :style="(position === 'over') ? 'color:white !important; text-decoration: underline;' : null">
                            OVER
                          </a>
								        </div>
                        <vue-slider :height="5" tooltop="always" :disabled="isBetting" v-model="prediction" :min="2" :max="57" :processStyle="{backgroundColor: '#01f593'}" :railStyle="{backgroundColor: '#ff006c'}" :tooltipStyle="{backgroundColor: '#c5a35b', borderColor: '#c5a35b' }"></vue-slider>
                        <div style="margin-bottom: 10px; color: #d9d9d9; font-size: 14px; text-align: center;">
                            <span>Bet Amount</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                          <input type="number" :disabled="isBetting" v-model="betAmount">
                          <input type="text" :value="`${parseFloat(winChange).toFixed(0)}%`" style="max-width:143px;">
                        </div>
                        <div style="margin-bottom: 10px; color: #d9d9d9; font-size: 14px; text-align: center;">
                            <span>Payout on Win</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <input type="number" :value="parseFloat(payoutOnWin).toFixed(4)" readonly>
                            <input type="text" :value="`${parseFloat(multiplier).toFixed(4)}X`" style="max-width:143px;" readonly>
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

import Clock from './Clock';
import extension from '../assets/js/extension'
import { LCDClient, MnemonicKey, Extension, MsgInstantiateContract, MsgExecuteContract, StdTx, StdFee, StdSignature, StdSignMsg, MsgSend} from '@terra-money/terra.js';

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
      contractAddress: null,
      address: null,
      prediction: 30,
      betAmount: 1,
      terra: null,
      ext: null,
      lcdClientConfig: {
        URL: 'https://terra.wasmbet.com',
        chainID: 'tequila-0004',
        gasPrices: { ukrw: 178.05 },
        gasAdjustment: 1.5,
      },
      balance: 0,
      isBetting: false,
      position: 'over',
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
    this.contractAddress = this.$route.params.address;
    this.terra = new LCDClient(this.lcdClientConfig);

    this.ext = extension;
    this.loadExtension();
  },
  methods: {
    loadExtension() {
      setTimeout(() => {
        if (this.ext.address) {
          this.address = this.ext.address;
          this.getAmount();
        } else {
          this.loadExtension();
        }
      }, 1000);
    },
    async getAmount() {
      this.balance = (parseInt((await this.terra.bank.balance(this.address)).get("ukrw").amount.toString())/1000000).toFixed(2);
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
          this.resultMessage = `+${parseFloat(this.payoutOnWin).toFixed(4)}`;
          this.playSound(true);
        } else {
          this.predictionStyle.color = '#ff006c';
          this.resultMessage = `-${parseFloat(this.betAmount).toFixed(4)}`;
          this.playSound(false);
        }
        await this.getAmount();
        this.show = false;
      }
    },
    async betting(positon) {
      try {
        console.log('bbbbbbbbbbbbbbbbbbbbbeeeeeeeeeeettttttttttttttttttttttttttttttttttttttttinmg');
        this.isBetting = true;
        this.predictionStyle.color = '#fff';
        this.resultMessage = '';
        this.show = true;
        this.$refs.clock.startSpin();

        this.balance -= this.betAmount;

        const execute = new MsgExecuteContract(
          this.address, // sender
          this.contractAddress, // contract account address
          {
          "ruler": { 
            "phrase":"allinbitewjkrwerlwerwerbfcwl",
              "prediction_number": this.prediction,
              "position": this.position,
              "bet_amount": `${this.betAmount*1000000}`,
            },
          },
          { "ukrw": `${this.betAmount*1000000}` }, // coins
        );

        this.ext.post([execute], this.bettingCallback);
      } catch(e) {
        console.log(e);
        alert(`ERROR: ${e.message}`);
        this.$refs.clock.stopSpin();
        this.isBetting = false;
        this.predictionStyle.color = '#fff';
        await this.getAmount();
      }
    },
    async bettingCallback(payload) {
      console.log('bettingCallback');
      console.log(payload);
      if (payload.success) {
        try {
          let result = await this.getBettngResult();
          console.log(result);
          this.bettingList = [result].concat(this.bettingList);
          this.$refs.clock.stopSpin(result.lucky_number);
        } catch(e) {
          console.log(e);
          alert('error => check console.log');
          this.$refs.clock.stopSpin();
          this.isBetting = false;
          this.predictionStyle.color = '#fff';
          await this.getAmount();
        } 
      } else {
        alert('error => check console.log');
        this.$refs.clock.stopSpin();
        this.isBetting = false;
        this.predictionStyle.color = '#fff';
        await this.getAmount();
      }
    },
    async getBettngResult() {
      const result = await this.terra.wasm.contractQuery(
        this.contractAddress,
        {
          getmystate: {
            address: this.address,
          },
        } // query msg
      );
      return result;
    },
    playSound(result) {
      if (result) {
        let audio = new Audio('/src/assets/sound/win.mp3');
        audio.play();
      } else {
        let audio = new Audio('/src/assets/sound/lose.mp3');
        audio.play();
      }
    }
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
   color: #a9a9a9 !important; 
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
