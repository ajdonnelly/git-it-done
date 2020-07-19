var issueContainerEl = document.querySelector("#issues-container");

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
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            // pass response data to dom function
            displayIssues(data);
          });
        }
        else {
          alert("There was a problem with your request!");
        }
      });

};
  //call get function, pass through what you want
  getRepoIssues("ajdonnelly/codequiz");

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