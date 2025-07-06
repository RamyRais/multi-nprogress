## Testing

```sh
npm install
npm test
```

Try in the browser by serving index.html from a server
```sh
# Example with python
python3 -m http.server 8000
```


## Releasing

```sh
npm test
bump *.json nprogress.js          # bump version numbers
git release 0.1.1                 # release to github
npm publish                       # release to npm
git push origin master:gh-pages   # update the site
```
