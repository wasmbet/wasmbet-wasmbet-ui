<template>
  <div class="seconds-holder" style="top: 168px;">
    <div class="circle-holder">
      <div class="dark_digit">
        <img src="/src/assets/images/secondwhite.svg" class="round" alt="Clocks seconds" :style="roundStyle">
      </div>
      <svg class="dark_digit" width="100%" height="100%">
          <g id="clipPath">
            <image xlink:href="/src/assets/images/secondwhite.svg" width="100%" height="100%" transform="" class="round" id="digitalsecond" alt="Clocks seconds" :style="roundStyle">
              <animateTransform attributeName="transform"
              attributeType="XML"
              type="rotate"
              dur="10s"
              repeatCount="indefinite"/>
            </image>
          </g>
          <defs>
              <clipPath id="hero-clip">
                  <rect x="94%" y="47.2%" fill="#ff0000" width="110" height="64"/>
              </clipPath>
          </defs>
        </svg>
        <div class="down_opacity_circle">
            <img src="/src/assets/images/secondtransnightmode_.svg" class="round" id="digitalsecond" alt="Clocks seconds" :style="roundStyle">
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'clock',
  data () {
    return {
      number: 0,
      stop: true,
      error: false,
      stopNumber: 0,
      roundStyle: {
				'transform': 'rotate(0deg)',
				'-webkit-transform': 'rotate(0deg)',
				'-o-transform': 'rotate(0deg)',
				'-moz-transform': 'rotate(0deg)',
				'-ms-transform': 'rotate(0deg)',
      },
    }
	},
	computed: {
   
	},
  async mounted() {

  },
  methods: {
    startSpin() {
      if (this.stop) {
        this.stop = false;
        this.error = false;
        this.spinClock();
      }
    },
    stopSpin(number) {
      this.stop = true;
      if (number) {
        this.stopNumber = number;
      } else {
        this.stopNumber = this.number % 60;
        this.error = true;
      }
    },
    spinClock() {
      setTimeout(() => {
        if (this.stop && this.stopNumber === this.number % 60) {
          this.$emit('endSpin', this.error);
        } else {
          this.number += 1;
          this.roundStyle['transform'] = `rotate(${this.number*6}deg)`;
          this.roundStyle['-webkit-transform'] = `rotate(${this.number*6}deg)`;
          this.roundStyle['-o-transform'] = `rotate(${this.number*6}deg)`;
          this.roundStyle['-moz-transform'] = `rotate(${this.number*6}deg)`;
          this.roundStyle['-ms-transform'] = `rotate(${this.number*6}deg)`;
          this.spinClock(this.number);
        }
      }, 100);

    },
  },
}
</script>

<style scoped>
</style>
