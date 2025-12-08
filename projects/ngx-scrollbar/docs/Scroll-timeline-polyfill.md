This plugin leverages the new Scroll Timeline feature in CSS to enhance scrollbar performance, surpassing traditional JavaScript implementations. Currently, the Scroll Timeline feature is available in all browsers except for Firefox ([See compatibility here](https://caniuse.com/mdn-css_properties_animation-timeline_scroll)). Therefore, a polyfill is necessary for cross-browser compatibility.

By default, the [polyfill script](https://github.com/flackr/scroll-timeline) is sourced directly from a CDN link. Unfortunately, the polyfill is not available on NPM.

**Recommendation:** Host the polyfill locally to prevent dependency issues if a third-party CDN becomes unavailable.

#### Customizing the Polyfill Path

You can use the `provideScrollbarPolyfill` function to specify a custom path for the polyfill.

#### Hosting the Polyfill Locally

As of version **v14.1.1**, the polyfill is included with `ngx-scrollbar`. To host and load the polyfill script from your server, add the following configuration to your `angular.json` file:

```json
{
  "projects": {
    "project-name": {
      "architect": {
        "build": {
          "assets": [
            {
              "glob": "**/*",
              "input": "node_modules/ngx-scrollbar/assets/",
              "output": "assets"
            }
          ]
        }
      }
    }
  }
}
```

Next, set the polyfill path in your `app.config` file:

```ts
import { provideScrollbarPolyfill } from 'ngx-scrollbar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideScrollbarPolyfill('assets/scroll-timeline-polyfill.js')
  ]
};
```
