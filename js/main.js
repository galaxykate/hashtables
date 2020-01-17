

function Hashtable() {
	this.buckets = []

}

Hashtable.prototype.setSize = function(size) {
	this.buckets = []
	for (var i = 0; i < size; i++) {
		this.buckets[i] = []
	}
}

Hashtable.prototype.clear = function() {
	for (var i = 0; i < this.buckets.length; i++) {
		this.buckets[i] = []
	}
}

Hashtable.prototype.add = function(hash, item) {
	
	let bucket = ((hash%this.buckets.length) + this.buckets.length)%this.buckets.length
	console.log("Add " + item.id + " at " + bucket)
	this.buckets[bucket].push(item)
}

Hashtable.prototype.get = function(hash, id) {

	let bucket = ((hash%this.buckets.length) + this.buckets.length)%this.buckets.length
	
	for (var i = 0; i < bucket.length; i++) {
		if (bucket[i].id === id)
			return bucket[i]
	}
}



// What does this software do?
// Given one dataset, compare how fast two storage methods can store and retrieve it



Vue.component('hashtable', {
	properties: {
		table: Array
	},
  data: function () {
    return {
      count: 0
    }
  },
  template: `<div class="hashtable">


			<div class="hashbucket" v-for="(bucket,index) in table">
				
				<div class="hashbucket-label">
					{{index}}
				</div>
				
				<div class="hashbucket-item" v-for="item in bucket">
					{{item}}
				</div>

			</div>
		</div>`
})

var app2 = new Vue({
	el: '#app',
	template: `<div id='app'>
		<div class="controls">
			<div class="control-column">
		
			Hash function:<br><textarea v-model="hashFxnString" cols="40" rows="9"/>
			
			</div>
			<div class="control-column">
			Buckets: <input v-model="bucketCount"></input>
			<br>
			Test data:
			<br>
			<textarea v-model="testInput"/> 
			<br>
			<span>Hash: {{testHash}}</span>
			<br>
			<span>Bucket #{{testBucket}}</span>
			</div>
			<div id="coinstuff">
				<input id="coincheck" type="checkbox" v-model="mineBitcoins"/><label for="coincheck">Mine bitcoins?</label>
				
				<div v-if="mineBitcoins">
					
					<div>
						Bitcoin function:<br><textarea v-model="bitcoinString" cols="40" rows="3"/>
					</div>
					Bitcoins found: {{coins.length}}
					<div v-if="mineBitcoins">
						<div v-for="coin in coins">{{coin.id}} ({{coin.hash}})</div>
					</div>
				</div>
			</div>
			<div>
				<select v-model="dataID" @change="loadData">
					<option v-for="(set,setID) in dataSets">{{setID}}</option>
				</select>
				<div>{{dataItems.length}} loaded, e.g:{{dataExample}}</div>
				<button @click="addData">add all!</button>
			</div>
		</div>
		
	</div>`,

	methods: {


		addData: function() {
			console.log("add data of type", this.dataID)



				let count = 0

				let settings = this.dataSets[this.dataID]


				if (this.delay > 0) {
					setInterval(() => {

						if (count < 30) {
							let item = this.dataItems[count]
							item.id = settings.id(item)

							
							let hash = this.hashFxn(item.id)
								console.log(item.id, hash)
							// Add it to the hashtable using the function
							this.table.add(hash, item)
							if (this.coinFxn(hash)) {
								this.coins.push({
									hash: hash,
									id: item.id
								})
							}
							count++


						}
						
					}, this.delay)
				} else {
					console.log("add at once")
					for (var i = 0; i < 100; i++) {

					}

				}
		},
		loadData: function() {
			console.log(`get data set for `, this.dataID)
	


			$.getJSON("data/" + this.dataID + ".json", (json) => {
					console.log("GOT DATA: ", json.length, json[0])
					this.dataItems = json
					this.dataExample = json[Math.floor(Math.random()*json.length)]
				
			});
			
		}
	},


	computed:  {
		exampleData: function() {
			return this.dataSet.items[0]
		},
		
		hashFxn : function() {
			let fxn = eval(this.hashFxnString)
			
			return fxn
		},

		coinFxn : function() {
			let fxn = eval(this.bitcoinString)
			
			return fxn
		},

		testHash: function() {
			try {
				let val = this.hashFxn(this.testInput)
				return val
			} catch(error) {
				return "Invalid hash function"
			}
		},

		// Return the bucket index
		testBucket: function() {
			return ((this.testHash%this.bucketCount) + this.bucketCount)%this.bucketCount
		}
	},

	watch: {
		
			bucketCount: () => this.table.setSize(this.bucketCount)
	
	},

	mounted: function() {
		this.loadData()
		this.table.setSize(this.bucketCount)
	},



	data: {
		delay: 10,
		mineBitcoins: true,
		coins: [],
		bitcoinString: `(s) => s%10 == 0`,
		
		bucketCount : 24,
		hashFxnString: `(s) => {
	let val = 0;
	for (var i = 0; i < s.length; i++) {
		val += s.charCodeAt(0);
	}
	return val;
}`,
		table : new Hashtable(),
		hashRaw: "",
		testInput: "foo",
		dataID: "emoji",
		dataItems: [],
		dataExample: "--no data yet--",

		dataSets: {
			"cmudict-abridged": {
				id: (obj) => obj[0],
				val: (obj) => obj[1]
			},
			"emoji": {
				id: (obj) => obj.name,
				val: (obj) => obj.char
			},
			"nyc_dogs": {
				id: (obj) => obj.no,
				val: (obj) => obj.name + "(" + obj.breed + ")"
			},
			"pokedex": {
				id: (obj) => obj.name.english,
				val: (obj) => obj.type.join("/")
			}

		},


		message: 'You loaded this page on ' + new Date().toLocaleString()
	}
})

// Define a new component called todo-item
Vue.component('hashtable', {
	template: '<div class="hashtable"></div>'
})


