# markdown-api

Provides [Zooniverse flavored markdown](https://github.com/zooniverse-ui/markdownz) via an API.

As of 2017-10, this is used by [TalkApi](https://github.com/zooniverse/talk-api) to render posts and comments when it sends them out in HTML emails. By making Markdown rendering into a microservice, we can make sure to use the same engine as we use in the frontend.

## Usage

`NODE_ENV=production node .`

*Setting `NODE_ENV` will set the host url to localhost, staging, or production

`/html` Accepts a JSON post and returns HTML

params:
- markdown: the markdown to be converted to HTML
- project (optional): the `<owner>/<name>` of the project

## Examples

Without specifying the project:
```
curl -H "Accept: text/html" -H "Content-Type: application/json" -X POST -d '{"markdown": "Hey @parrish, look at **this** #agn: @vrooje/galaxy-zoo-bar-lengths^S465826! :D"}' http://localhost:2998/html
```

```html
<div>
  <p>Hey
    <a href="https://www.zooniverse.org/users/parrish">@parrish</a>, look at <strong>this</strong>
    <a href="https://www.zooniverse.org/talk/search?query=agn">#agn</a>:
    <a href="https://www.zooniverse.org/projects/vrooje/galaxy-zoo-bar-lengths/talk/subjects/465826">vrooje/galaxy-zoo-bar-lengths - Subject 465826</a>!
    <img class="emoji" draggable="false" alt="" src="https://twemoji.maxcdn.com/36x36/1f604.png">
  </p>
</div>
```

Specifying the project:
```
curl -H "Accept: text/html" -H "Content-Type: application/json" -X POST -d '{"markdown": "Hey @parrish, look at **this** #agn: ^S465826! :D", "project": "vrooje/galaxy-zoo-bar-lengths"}' http://localhost:2998/html
```

```html
<div>
  <p>Hey
    <a href="https://www.zooniverse.org/users/parrish">@parrish</a>, look at <strong>this</strong>
    <a href="https://www.zooniverse.org/projects/vrooje/galaxy-zoo-bar-lengths/talk/search?query=agn">#agn</a>:
    <a href="https://www.zooniverse.org/projects/vrooje/galaxy-zoo-bar-lengths/subjects/465826">vrooje/galaxy-zoo-bar-lengths - Subject 465826</a>!
    <img class="emoji" draggable="false" alt="" src="https://twemoji.maxcdn.com/36x36/1f604.png">
  </p>
</div>
```
