# How to populate regions.json

* navigate to https://www.yourtv.com.au/guide/ 
* open up devtools and type

```js
console.log(JSON.stringify(window.regionState))
```

* copy and paste result into regions.json