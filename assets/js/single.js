var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoIssues = function(repo) {
    console.log(repo);
    //using Fetch API to create an HTTP request to endpoint :owner/:repo (repo here)
    //capture query URL in var apiUrl
    //reverse order of output with ?direction=asc
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    /*call fetch pass through API variable 
    fetch() is asynchronous. 
    Use its Promise-based syntax to actually 
    access the data contained in the response*/
    // make a get request to url
    fetch(apiUrl).then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayIssues(data);

          // check if api has paginated issues
          if (response.headers.get("Link")) {
            displayWarning(repo);
          }
        });
      } else {
        // if not successful, redirect to homepage
        document.location.replace("./index.html");
      }
    });

};


//here we're getting the "search" field from the array which gives us what has been
//searched for, ie the repo name. 
var getRepoName = function() {
  //getting and storing the dom item in the variable queryString
  //assigning the query string to a variable called query string  
  var queryString = document.location.search;
    //Use the Split Method to Extract the Query Value
    //splitting off the variable to get the repo Name-remember the search includes the repo and the issue
    //lastly, by identifying the 1 position inthe array, we are selecting the repo name only. this is because the array consists of two things before and after the equal sign. The second position in the array is 1.
    var repoName = queryString.split("=")[1];
    //conditional statement that checks if the repoName exists
    //only display the repo name and make the 
    //fetch call if the value for repoName exists. 
    if (repoName) {  
    //once we've split the repo name off of the querystring we print the repo name to the 
    //to the repoNameEl variable span at the top of the page to show the ser the repo they're searching for
    //we do this through making the textcontent of the span equal to repoName variable
    repoNameEl.textContent = repoName;
    //call the fetch function now and pass the repo name through it
    getRepoIssues(repoName);
    }
    //if the repo name doesn't exist
    else {
      document.location.replace("./index.html");
    }
    
  };

  /* loop over the response data and create an 
  <a> element for each issue*/
  var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
      }
    
    for (var i = 0; i < issues.length; i++) {
        
        /* create a link element (by defining
        the object you want to make here in the
        createElement method you create the linke feature
        typical of an a object) to take users to the issue on github*/
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        /*Issue objects have an html_url property, 
        which links to the full issue on GitHub. so what 
        were doing here is saying for every poisition in 
        the issues array with an html_url property, make 
        this dom item an <a> href object to link to the page on 
        github*/
        issueEl.setAttribute("href", issues[i].html_url);
        /*We also added a target="_blank" attribute 
        to each <a> element, to open the link in a 
        new tab instead of replacing the current webpage*/
        issueEl.setAttribute("target", "_blank");
        
        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
        typeEl.textContent = "(Pull request)";
        } else {
        typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
      }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName()