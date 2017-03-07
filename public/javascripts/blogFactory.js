angular.module('routerApp').factory('blogFactory', ['$http', function($http) {
  var blogs = [];

  var getBlogs = function(rangeid, blogclbk) {
    $http({
      url: __env.apiUrl + 'blog/search/gunrange',
      method: "GET",
      headers: { "Authorization": 'Bearer ' + $rootScope.token },
      params: { gunrange: rangeid }
    })
    .then(function(response){
      if (response.status == 200) {
        if (response.data.length > 0) {
          blogs = response.data;
        } else {
          blogs = null;
        }
      } else {
        blogs = null;
      }
      blogclbk(blogs);
    });
  };

  var createBlog = function(blog, blogclbk) {
    $http({
      url: __env.apiUrl + 'blog',
      method: "POST",
      headers: { "Authorization": 'Bearer ' + $rootScope.token },
      data: blog
    })
    .then(function(response){
      if (response.status == 200) {
        if (response.data.length > 0) {
          blogclbk(response.data);
        } else {
          blogclbk(null);
        }
      } else {
        blogclbk(null);
      }
    });
  }

  return {
    blogs : blogs,
    getBlogs : getBlogs,
    createBlog : createBlog
  }
}])
