## Testing

```sh
npm install
npm test
```

or try it out in the browser by opening `index.html`

## Releasing

```sh
npm test
bump *.json nprogress.js          # bump version numbers
git release 0.1.1                 # release to bower/github
npm publish                       # release to npm
git push origin master:gh-pages   # update the site
```
