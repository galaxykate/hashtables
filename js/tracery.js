const coffeeGrammar = {

    tea: ["Earl Grey", "darjeeling tea", "jasmine tea", "rooibos tea", "chamomile tea"],
    coffee: ["coffee", "espresso", "#tea#"],
    container: ["pot", "cup", "mug", "sip"],
    nice: ["lovely", "nice", "fresh", "hot", "pleasant", "iced", "steamy"],
    origin: ["A #nice# #container# of #coffee#"],
}

// traceryExpand = (grammar, s) => {
//   let tokens = s.split("#")

//   let expanded = ""
//   for (var i = 0; i < tokens.length; i++) {
      
//       // Just use this string as is
//       if (i%2 === 0) {
//         expanded += tokens[i]
//       }
//       else {
//         // this string is a 'symbol' key! find the set of rules for this key
//         let key = tokens[i]
//         let rules = grammar[key]
//         // ... and pick a random one
//         let randomIndex = Math.floor(Math.random()*rules.length)
//         let rule = rules[randomIndex]

//         // then replace it with its expanded version
//         expanded += traceryExpand(grammar, rule)
//       }
//   }
//   return expanded
// }

// for (var i = 0; i < 10; i++) {
//   let drink = traceryExpand(coffeeGrammar, "#origin#")
//   console.log(drink)
// }
