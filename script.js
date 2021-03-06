function countWords(string) {
	// https://stackoverflow.com/questions/6543917/count-number-of-words-in-string-using-javascript
	// May change to a different implementation.
	string = string.trim();
	if (string.length == 0) {
		return 0;
	}
	return string.split(/\s+/).length;
}

app = Vue.createApp({
	data() {
		return {
			text: "",
			interval: 5000,
			rollingWeight: 4,
			rollingAverageWPM: 0,
			lastRecordValue: 0,
			lastRecordTime: Date.now(),
			tareValue: 0
		};
	},
	computed: {
		wordCount() {
			return countWords(this.text);
		}
	},
	methods: {
		zeroButton(e) {
			this.rollingAverageWPM = 0;
		},
		tareButton(e) {
			this.tareValue = this.wordCount;
			this.rollingAverageWPM = 0;
		},
		updateRate() {
			let diff = this.wordCount - this.lastRecordValue;
			this.lastRecordValue = this.wordCount;

			let timeDiff = Date.now() - this.lastRecordTime;
			this.lastRecordTime = Date.now();

			let rate = (diff / timeDiff) * 1000 * 60;
			this.rollingAverageWPM =
				(this.rollingAverageWPM * this.rollingWeight + rate) /
				(1 + this.rollingWeight);
		},
		timerCycle() {
			this.updateRate();
			window.setTimeout(this.timerCycle, this.interval);
		}
	},
	mounted: function() {
		window.setTimeout(this.timerCycle, this.interval);
	}
}).mount("#app");
