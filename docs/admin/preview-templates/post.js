import htm from "https://unpkg.com/htm?module";
import format from "https://unpkg.com/date-fns@2.7.0/esm/format/index.js?module";

const html = htm.bind(h);

// Preview component for a Post
const Post = createClass({
  render() {
    const entry = this.props.entry;

    return html`
      <main class="prose p-4">
        <article>
          <h1>${entry.getIn(["data", "title"], null)}</h1>
          <div class="inline-block w-auto text-xs text-gray-500 pt-1 pb-1 pl-3 mr-2 rounded ">Updated <time datetime="{{ date | machineDate }}">{{ date | readableDate }}</time></div>
          <p>${entry.getIn(["data", "summary"], "")}</p>
          <div class="adjust">
          ${this.props.widgetFor("body")}
          </div>
          <p>
            ${
              entry.getIn(["data", "tags"], []).map(
                tag =>
                  html`
                    <a class="text-xs mr-2 px-3 py-2 text-gray-600 bg-gray-200 no-underline rounded" href="#" rel="tag">${tag}</a>
                  `
              )
            }
          </p>
        </article>
      </main>
    `;
  }
});

export default Post;
