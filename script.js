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
			interval: 1000,
			rollingWeight: 10,
			rollingAverageWPM: 0,
			lastRecordValue: 0,
			lastRecordTime: Date.now(),
			tareValue: 0,
			sprintActive: false, // Is a sprint currently happening?
			sprintStartTime: null, // When did the current sprint start?
			sprintStartValue: null, // What was the wordcount when this sprint started?
			sprintGoalWords: 0, // What is the wordcount goal of this sprint?
			sprintWordFreeze: 0, // Previous result to be shown on the GUI
			sprintGoalTime: null // Time the sprint ends
		};
	},
	computed: {
		wordCount() {
			return countWords(this.text);
		},
		sprintWordCount() {
			if (!this.sprintActive) {
				if(this.sprintWordFreeze != null) {
					return this.sprintWordFreeze;
				}
			}
			else {
				return this.wordCount - this.sprintStartValue;
			}
		},
		sprintBarPercent() {
			if(!this.sprintActive) {
				return 0;
			}
			else {
				return this.sprintWordCount/this.sprintGoalWords;
			}
		}
	},
	methods: {
		tareButton(e) {
			this.tareValue = this.wordCount;
			this.rollingAverageWPM = 0;
		},
		startSprint(e) {
			this.sprintStartTime = Date.now();
			this.sprintStartValue = this.wordCount;
			this.sprintActive = true;
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
