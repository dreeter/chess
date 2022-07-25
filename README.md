# chess
a playable implementation of chess

This project is an entirely browser based implementation of the classic game Chess built using HTML, CSS, JavaScript and jQuery following a MVC and OOP 
model.

The Model:
  The Model is represented by an array of ChessPiece objects which track their own state (type, position, color, etc)

The Controller:
  The controller handles click events fired from the DOM (View) elements and translates these moves into changes within the model (to which
  the controller has a reference). The controller determines which moves are valid based on the piece being selected. Valid and selected movements are shown
  to the user.
  
The View:
  The view is represented by the DOM elements firing events and being changed by the controller.
  
This project follows an approach wherein structure (HTML), style (CSS), and behavior (JavaScript) are kept separate. i.e. Javascript never adds or removes
styling directly, HTML elements do not define event handling behavior, etc.
