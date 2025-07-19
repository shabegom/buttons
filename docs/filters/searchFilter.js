const elasticlunr = require("elasticlunr");
const emojiRegex = require('emoji-regex/RGI_Emoji.js')

module.exports = function (collection) {
  // what fields we'd like our index to consist of
  var index = elasticlunr(function () {
    this.addField("title");
    this.addField("content");
    this.setRef("id");
  });

  // loop through each page and add it to the index
  collection.forEach((page) => {
    index.addDoc({
      id: page.url,
      title: page.template.frontMatter.data.title,
      content: squash(page.templateContent),
    });
  });
  
  function squash(text) {
    const regex = emojiRegex();
    var content = new String(text);

    // all lower case, please
    var content = content.toLowerCase();
  
    // remove all html elements and new lines
    var re = /(.*?&lt;.*?&gt;)/gi;
    var plain = unescape(content.replace(re, ''));
  
    // remove duplicated words
    var words = plain.split(' ');
    var deduped = [...(new Set(words))];
    var dedupedStr = deduped.join(' ')
  
    // remove short and less meaningful words
    var result = dedupedStr.replace(/\b(\.|\,|\<;|the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for)\b/gi, '');
    //remove newlines, and punctuation
    result = result.replace(/\.|\,|\?|<p>|-|—|\n/g, '');
    //remove repeated spaces
    result = result.replace(/[ ]{2,}/g, ' ');
    // remove most emoji
    result = result.replace(/([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g, '');
   
    let match;
    while (match = regex.exec(result)) {
      const emoji = match[0];
      result = result.replace(emoji,' ')
    }
  
    return result;
  }

  return index.toJSON();
};