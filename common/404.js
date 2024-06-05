(function () {
  // Define redirection rules as an array of arrays: [sourceRegex, targetPath]
  var redirectionRules = [
    [/^\/blogs\/articles\/companies\/(.*)$/, '/blogs/companies/$1'],
    [/^\/blogs\/articles\/learn\/(.*)$/, '/blogs/learn/$1'],
    [/^\/blogs\/articles\/problems\/(.*)$/, '/blogs/problems/$1'],
    [/^\/blogs\/articles\/articles\/(.*)$/, '/blogs/articles/$1'],
    [/^\/blogs\/articles\/interview-questions\/(.*)$/, '/blogs/interview-questions/$1'],
    [/^\/blogs\/articles\/career-advice\/(.*)$/, '/blogs/career-advice/$1'],
    [/^\/blogs\/articles\/(.*)$/, '/blogs/articles/$1']
  ];
  // Function to check if the URL contains a query parameter
  function hasQueryParameter(parameter) {
    return window.location.search.indexOf(parameter) !== -1;
  }

  // Function to handle redirection based on the path
  function redirectPage() {
    if (hasQueryParameter('redirected')) {
      return; // Do not run the redirection function
    }

    var currentPath = window.location.pathname;
    var redirected = false;

    // Loop through redirection rules
    for (var i = 0; i < redirectionRules.length; i++) {
      var rule = redirectionRules[i];
      var sourceRegex = rule[0];
      var targetPath = rule[1];

      // Check if the current path matches the source regex
      var matches = currentPath.match(sourceRegex);

      if (matches !== null) {
        // Generate the new path using the captured group and target path
        var newPath = targetPath.replace('$1', matches[1]);
        newPath += '?redirected';

        // Redirect to the new path
        if (newPath !== currentPath && !redirected) {
          return newPath;
          redirected = true;
        }
        return; // Stop further processing
      }
    }
  }

  // Call the redirection function when the page loads
  $(document).ready(function () {
    const newUrl = redirectPage();
    let fullpageurl = window.location.href;
    let host_name1 = window.location.hostname + "/su/";
    if (fullpageurl.indexOf(host_name1) == -1 && !newUrl) {
      $('.loadingbar-page').hide();
    }
    if(newUrl) {
      window.location.href = newPath;
    }
  });
})();
