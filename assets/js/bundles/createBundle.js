(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var addButton = document.querySelector('.add')
var options = document.querySelector('.options')
var form = document.querySelector('.jumbotron > form')
var optionsError = document.querySelector('.options-error')
var removeButtons = document.querySelectorAll('.option-remove')
var deleteButton = document.querySelector('.delete')

var removeElement = function removeElement(el) {
  return function(e) {
    e.preventDefault()

    options.removeChild(el)
  }
}

var findParent = function findParent(el) {
  var indexOf = [].indexOf
  var current
  while(indexOf.call(el.classList, 'options') < 0) {
    current = el
    el = el.parentNode
  }
  return current
}

var checkOptions = function checkOptions(e) {
  if(options.children.length < 2) {
    e.preventDefault()

    optionsError.innerHTML = 'Must have at least 2 option fields'
    return false
  }
}

var addOption = function(e) {
  e.preventDefault()

  var formGroup = document.createElement('div')
  var inputGroup = document.createElement('div')
  var optionInput = document.createElement('input')
  var inputGroupButton = document.createElement('div')
  var button = document.createElement('button')
  var glyph = document.createElement('span')

  var inputAttributes = {
    'class': 'form-control option',
    'placeholder': 'Place option here',
    'name': 'option',
    'type': 'text',
    'pattern': "^[a-zA-Z0-9\\s\\.,'!?]*$"
  }

  var buttonAttributes = {
    'type': 'button',
    'class': 'btn btn-default option-remove'
  }

  Object.keys(inputAttributes).forEach(function(key) {
    optionInput.setAttribute(key, inputAttributes[key])
  })

  Object.keys(buttonAttributes).forEach(function(key) {
    button.setAttribute(key, buttonAttributes[key])
  })

  formGroup.setAttribute('class', 'form-group')
  inputGroup.setAttribute('class', 'input-group')
  glyph.setAttribute('class', 'glyphicon glyphicon-remove')
  inputGroupButton.setAttribute('class', 'input-group-btn')

  button.appendChild(glyph)
  inputGroupButton.appendChild(button)
  inputGroup.appendChild(optionInput)
  inputGroup.appendChild(inputGroupButton)
  formGroup.appendChild(inputGroup)
  options.appendChild(formGroup)

  button.addEventListener('click', removeElement(formGroup))
}

Array.prototype.forEach.call(removeButtons, function(button) {
  button.addEventListener('click', removeElement(findParent(button)))
})

addButton.addEventListener('click', addOption)
form.addEventListener('submit', checkOptions)

},{}]},{},[1]);
