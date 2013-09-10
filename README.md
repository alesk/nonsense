# nonsensejs

`nonsensejs` is little script that helps web sites complain with  eu bureaucratic nonsense about cookie use.

## Usage

Put reference to script nonsense.js to head of your site:

  <link rel="css" href="nonsense.css" />
  <script type="text/javascript" src="nonsense.js" />

Inside body create tag with id `nonsense_root`:

    <div id="nonsense_root">
       <div>
         This site wants to use cookies to improve user experience. Do you agree?     
         <button data-action='agree' class="nonsense-btn nonsense-yes">
           OK, no prob</button>
         <button data-action='refuse'class="nonsense-btn nonsense-no">
           No way!</button>
      </div>
    </div>
  
