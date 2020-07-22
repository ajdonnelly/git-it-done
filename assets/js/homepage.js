
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
//captures and stores changes to the div holding the language buttons as the variable "languageButtonsEl"
var languageButtonsEl = document.querySelector("#language-buttons");

var getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data.items, language);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data, user);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
  });
};


  var userFormEl = document.querySelector("#user-form");
  var nameInputEl = document.querySelector("#username");

  var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
var username = nameInputEl.value.trim();

if (username) {
  getUserRepos(username);
  nameInputEl.value = "";
} else {
  alert("Please enter a GitHub username");
}
  };

  userFormEl.addEventListener("submit", formSubmitHandler);

  //display the return from the api on the screen
  var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
if (repos.length === 0) {
  repoContainerEl.textContent = "No repositories found.";
  return;
}
    console.log(repos);
    console.log(searchTerm);
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
for (var i = 0; i < repos.length; i++) {
  // format repo name
  var repoName = repos[i].owner.login + "/" + repos[i].name;

  // create a container for each repo
  var repoEl = document.createElement("a");
  repoEl.classList = "list-item flex-row justify-space-between align-center";
  repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
  
  // create a span element to hold repository name
  var titleEl = document.createElement("span");
  titleEl.textContent = repoName;

  // append to container
  repoEl.appendChild(titleEl);

// create a status element
var statusEl = document.createElement("span");
statusEl.classList = "flex-row align-center";

// check if current repo has issues or not
if (repos[i].open_issues_count > 0) {
  statusEl.innerHTML =
    "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
} else {
  statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
}

// append to container
repoEl.appendChild(statusEl);

  
  // append container to the dom
  repoContainerEl.appendChild(repoEl);
}
  };
//an event listener listening for a click event on the buttons in the button div
//when it hears this, it will fire up the "buttonClickHandler" function
//this event delegates to the parent elmeent, the div holding all the buttons 
//rather than caputuring events on each button 

//runs the event through a callback function
//sets the language by finding data attribute assigned to the button you clicked
/*Remember, the browser's event object will have a target property that tells us 
exactly which HTML element was interacted with to create the event. Once we know which 
element we interacted with, we can use the getAttribute() method to read the data-language 
attribute's value assigned to the element.*/
var buttonClickHandler = function(event){
  var language = event.target.getAttribute("data-language")
  if (language) {
    getFeaturedRepos(language);
  
    // clear old content
    repoContainerEl.textContent = "";
  }
}

languageButtonsEl.addEventListener("click", buttonClickHandler);