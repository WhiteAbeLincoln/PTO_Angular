This website uses [Github Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/).
Markdown is a way to write content for the web. 
Unlike cumbersome word processing applications, text written in Markdown can be easily shared between computers, mobile phones, and people. 
It’s quickly becoming the writing standard for academics, scientists, writers, and many more.
It doesn’t do anything fancy like change the font size, color, or type. 
All you have control over is the display of the text—stuff like making things bold, creating headers, and organizing lists.

## Phrase Emphasis ##

    *italic*   **bold**
    _italic_   __bold__
	
## Strikethrough ##

    ~~Mistaken text.~~

## Links ##

Inline:

    An [example](http://url.com/ "Title")

Reference-style labels (titles are optional):

    An [example][id]. Then, anywhere
    else in the doc, define the link:
	
    [id]: http://example.com/  "Title"

## Images ##

Inline (titles are optional):

    ![alt text](http://url.com/img.jpg "Title")

Reference-style:

    ![alt text][id]

    [id]: /url/to/img.jpg "Title"


## Headers ##

Setext-style:

    Header 1
    ========
	
    Header 2
    --------

atx-style (closing #'s are optional):

    # Header 1 #

    ## Header 2 ##

    ### Header 3


and so on, up to

    ###### Header 6

## Lists ##

Ordered, without paragraphs:

    1.  Foo
    2.  Bar


Unordered, with paragraphs:

    *   A list item.
	
        With multiple paragraphs.

    *   Bar


You can nest them:

    *   Abacus
	    * answer
    *   Bubbles
	    1.  bunk
        2.  bupkis
		    * BELITTLER
        3. burper
    *   Cunning

	

## Tables ##

Separate headers from content with hyphens ``-`` and separate columns with pipes ``|``

```
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
```

You can use colons ``:`` within the header row to define text to be left-aligned, right-aligned, or center-aligned:

```
| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
```


## Blockquotes ##

    > Email-style angle brackets
    > are used for blockquotes.
	
    > > And, they can be nested.

    > #### Headers in blockquotes
    > 
    > * You can quote a list.
    > * Etc.


## Code Spans ##


    `<code>` spans are delimited
    by backticks.

    You can include literal backticks
    like `` `this` ``.


## Preformatted Code Blocks ##

Indent every line of a code block by at least 4 spaces or 1 tab.


    This is a normal paragraph.

        This is a preformatted
        code block.


Or use a fenced code block

    ```
    function test() {
      console.log("notice the blank line before this function?");
    }
    ```

## Horizontal Rules ##

Three or more dashes or asterisks:

    ---
	
    * * *
	
    - - - - 
