

function Hashtable() {
	this.buckets = []

	this.setSize(10)

}

Hashtable.prototype.setSize = function(size) {
	while(this.buckets.length > 0) {
		this.buckets.pop()
	}
	
	for (var i = 0; i < size; i++) {
		this.buckets.push([])
	}
	console.log(this)
}

Hashtable.prototype.clear = function() {
	for (var i = 0; i < this.buckets.length; i++) {
		this.buckets[i] = []
	}
}

Hashtable.prototype.add = function(hash, item) {

	
	let index = ((hash%this.buckets.length) + this.buckets.length)%this.buckets.length
	
	this.buckets[index].push(item)
	
}

Hashtable.prototype.get = function(hash, id) {

	let index = ((hash%this.buckets.length) + this.buckets.length)%this.buckets.length
	
	for (var i = 0; i < bucket.length; i++) {
		if (bucket[i].id === id)
			return bucket[i]
	}
}



// What does this software do?
// Given one dataset, compare how fast two storage methods can store and retrieve it

Vue.component('bucket', {
	props: ["index", "items"],
	template: `<div class="hashbucket">
					
				<div class="hashbucket-label">
					{{items.length}}
				</div>
				
				<div class="hashbucket-item" :key="index" v-for="(item, index) in items">
					{{item.key}} ({{item.val}})
				</div>

			</div>`
})

Vue.component('hashtable', {
	props: {
		table: Object
	},

	computed: {
		buckets: function() {
			return this.table.buckets}
	},
	 
  template: `<div class="hashtable">

  		<div class="controls">
  			table ({{buckets.length}} buckets)
  		</div>
  		<div class="bucketholder">

			<bucket :key=index :index=index :items="buckets[index]" v-for="(bucket,index) in buckets"></bucket>
			
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

			<div id="coinstuff" class="control-column">
				<input id="coincheck" type="checkbox" v-model="mineBitcoins"/><label for="coincheck">Mine bitcoins?</label>
				
				<div v-if="mineBitcoins">
					
					<div>
						Bitcoin function:<br><textarea v-model="bitcoinString" cols="40" rows="3"/>
					</div>
					
					Bitcoins found: {{coins.length}}

					<div v-if="mineBitcoins" class="bitcoin-list">
						<div v-for="coin in coins">{{coin.val}} {{coin.id}} ({{coin.hash}}) </div>
					</div>
				</div>
			</div>

			<div class="control-column">
				<select v-model="dataID" @change="loadData">
					<option v-for="(set,setID) in dataSets">{{setID}}</option>
				</select>
				<div>{{dataItems.length}} loaded, e.g:{{dataExample}}</div>
				<button @click="addData">add all!</button>
				Delay:<input v-model="delay" style="width:20px;"/> 
			</div>
		</div>
		<hashtable :table="table"></hashtable>
	</div>`,

	methods: {


		addData: function() {
			console.log("add data of type", this.dataID)

			// this.table.clear()

				let count = 0

				let settings = this.dataSets[this.dataID]


				if (this.delay > 0) {
					setInterval(() => {

						if (count < this.dataItems.length) {

							let item = this.dataItems[count]
							if (item) {

							item.id = settings.id(item)
							item.val = settings.val(item)
							
							
							let hash = this.hashFxn(item.id)
							// Add it to the hashtable using the function
							this.table.add(hash, item)
							if (this.coinFxn(hash)) {
								this.coins.push({
									hash: hash,
									id: item.id,
									val: item.val
								})
							}
							count++
							}

						}
						
					}, this.delay)
				} else {
					
					for (var i = 0; i < this.dataItems.length; i++) {
						let item = this.dataItems[i]

						item.id = settings.id(item)
						item.val = settings.val(item)
						
						
						let hash = this.hashFxn(item.id)
						// Add it to the hashtable using the function
						this.table.add(hash, item)
						if (this.coinFxn(hash)) {
							this.coins.push({
								hash: hash,
								id: item.id,
								val: item.val
							})
						}
					}

				}
		},
		loadData: function() {
			this.coins = []

			console.log(`get data set for `, this.dataID)
	


			$.getJSON("data/" + this.dataID + ".json", (json) => {
					console.log("GOT DATA: ", json.length, json[0])
					this.dataItems = json
					if (this.dataID == "malicious") {
						this.dataItems = this.dataItems.map(item => {
							return {
							id: item
						}}
						)
						console.log(this.dataItems)
					}
						

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
			this.coins = []
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
	
		bucketCount: function() { this.table.setSize(this.bucketCount)}
	
	},

	mounted: function() {
		this.loadData()
		// this.table.setSize(this.bucketCount)
	},



	data: {
		delay: 0,
		mineBitcoins: true,
		coins: [],
		bitcoinString: `(s) => s%10 == 0`,
		
		bucketCount : 24,
		hashFxnString: `(s) => {
	let val = 0;
	for (var i = 0; i < s.length; i++) {
		val += s.charCodeAt(i);
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
			"malicious": {
				id: (obj) => obj.id,
				val: (obj) => obj.id
			},
			"emoji": {
				id: (obj) => obj.name,
				val: (obj) => obj.char
			},
			"nyc_dogs": {
				id: (obj) => obj[1] + obj[0],
				val: (obj) => obj[1] + "(" + obj[4] + ")"
			},
			"pokedex": {
				id: (obj) => obj.name.english,
				val: (obj) => obj.type.join("/")
			}

		},


		message: 'You loaded this page on ' + new Date().toLocaleString()
	}
})

