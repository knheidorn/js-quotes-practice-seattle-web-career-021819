//constance for program
const quoteUrl = "http://localhost:3000/quotes"
const quoteList = document.getElementById('quote-list')
const form = document.getElementById('new-quote-form')
const newQuoteId = document.getElementById('new-quote')
const newAuthorId = document.getElementById('author')
//gets all the data from the JSON
fetch(quoteUrl)
  .then(response => response.json())
  .then(data => {renderQuotes(data)});

form.addEventListener('submit', (ev) => {
  ev.preventDefault()
  let newQuote = newQuoteId.value
  let newAuthor = newAuthorId.value
  newQuoteSave(newQuote, newAuthor)
})

function newQuoteSave(quote, author) {
  let config = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"author": author, "quote": quote, "likes": 0})
  }
  fetch(quoteUrl, config)
    .then(response => response.json())
    .then(data => {buildCard(data)})
}

//iterates over each quote to build out the cards
function renderQuotes(quotes) {
  quotes.forEach(quote => {
    buildCard(quote)
  })
}

//building the quote cards
function buildCard(quote) {
  //creating the HTML elements
  let li = document.createElement('li')
  let blockquote = document.createElement('blockquote')
  let p = document.createElement('p')
  let footer = document.createElement('footer')
  let br = document.createElement('br')

  //get the data for the text to populate the card
  let {author, id, quote:text} = quote

  //adding tags to the elements
  li.className = 'quote-card'
  li.id = `li-${id}`
  blockquote.className = 'blockquote'
  blockquote.id = `block-${id}`
  p.className = 'mb-0'
  footer.className = 'blockquote-footer'

  //add text data to the card elements
  p.textContent = text
  footer.textContent = author

  //building the card
  blockquote.append(p, footer, br)
  li.append(blockquote)
  quoteList.append(li)
  likeButton(quote)
  deleteButton(quote)
}

function likeButton(quote) {
  //getting elements
  let {id} = quote
  let blockquote2 = document.getElementById(`block-${id}`)
  let likeButton = document.createElement('button')
  let span = document.createElement('span')

  //get the number of likes off the json data
  let {likes} = quote

  //building elements
  likeButton.className = 'btn-success'
  likeButton.textContent = 'Likes: '
  span.id = `span-${id}`
  span.textContent = likes

  //adding event listener to increase count of likes by 1 on each click
  likeButton.addEventListener('click', ()=> {
    likes = parseInt(likes) + 1
    addLikes(likes, id) //calls the fetch'patch' request
  })

  //appending the button to the quote
  likeButton.append(span)
  blockquote2.append(likeButton)
}

//patch request for likes
function addLikes(likes, id) {
  let span1 = document.getElementById(`span-${id}`)
  //configs for fetch request
  let config = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"likes": likes})
  }
  //fetch request to modify the database
  fetch(quoteUrl + `/${id}`, config)
    .then(response => response.json())
    .then(data => {span1.textContent = data.likes})
}

//building button for delete
function deleteButton(quote) {
  //building elements
  let {id} = quote
  let blockquote3 = document.getElementById(`block-${id}`)
  let dButton = document.createElement('button')
  //adding content to delete elements
  dButton.className = 'btn-danger'
  dButton.textContent = 'Delete'
  //adding event listener that will call on the fetch'delete' request
  dButton.addEventListener('click', (ev)=> {
    ev.preventDefault // prevents reload of page
    alert('Are you sure you want to delete this quote?') // alerts user to make sure they want to delete
    deleteRequest(id)
  })
  blockquote3.append(dButton)
}

////patch request for delete
function deleteRequest(id){
  //finds the li element in the HTML for quote
  let li1 = document.getElementById(`li-${id}`)
  //fetch request configs
  let config = {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  }
  //fetch request to update database
  fetch(quoteUrl + `/${id}`, config)
    .then(response => response.json());
  //removes the li element from the HTML
  li1.remove()
}
