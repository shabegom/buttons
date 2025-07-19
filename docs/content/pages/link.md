---
title: Link Buttons
permalink: /usage/types/link.html
eleventyNavigation:
  order: 6
  key: link
  parent: types
  title: "Link Buttons"
---

A link button will open the specified link  when clicked. The `action` argument for a link button is the url/uri you want to open:

A url will open in your default browser:

<pre>
```button
name shabeblog
type link
action https://shbgm.ca/blog/home
```
</pre>

You can also use an Obsidian URI to open a specified note:

<pre>
```button
name Home Note
type link
action obsidian://open?vault=myVault&file=Home 
```
</pre>

Or run any other deep link / x-callback url:

<pre>
```button
name Hook
type link
action hook://file/JWCto1rMV?p=c2FtbW9ycmlzb24vRG93bmxvYWRz&n=Dank%2Epng
```
</pre>

