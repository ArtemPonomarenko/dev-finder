$(document).ready(function () {
  "use strict";
  //ALL ELEMENTS
  const search_input = document.getElementById("search");
  const search_btn = document.getElementById("search-btn");
  const name = document.getElementById("name");
  const nickname = document.getElementById("nickname");
  const date = document.getElementById("date");
  const avatar = $("#avatar");
  const toggle = document.getElementById("toggle");
  const description = document.getElementById("description");
  const repos_amount = document.getElementById("repos-amount");
  const followers_amount = document.getElementById("followers-amount");
  const following_amount = document.getElementById("following-amount");
  const city = document.getElementById("city");
  const blog = document.getElementById("blog");
  const twitter = document.getElementById("twitter");
  const work = document.getElementById("work");

  //Load the page with Octocat account loaded
  $.getJSON("https://api.github.com/users/octocat123445", function (result) {
    if (!result) {
      showError();
    } else {
      update_display(result);
    }

    //Load the page with preferred color scheme
    let matched = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (matched) {
      $("body").removeClass("light-theme");
      console.log("Currently in dark mode");
    } else {
      $("body").addClass("light-theme");
      console.log("Currently not in dark mode");
    }
  });

  //Dark/light mode toggle function
  //Done through simple "dark mode " class to the body
  toggle.addEventListener("click", function (e) {
    $("body").toggleClass("light-theme");
  });

  //get the search information
  search_btn.addEventListener("click", function (e) {
    let github_id = $.trim(search_input.value);
    const Url = `https://api.github.com/users/${github_id}`;
    if (!github_id) {
      showError();
    } else {
      $.getJSON(Url, function (result) {
        update_display(result);
      }).fail(function (jqXHR, textStatus, errorThrown) {
        showError();
      });
    }
  });
  function makeTwitterLink(str) {
    let link;
    if (!str) {
      link = `<a id="twitter" class="not-available">Not available</a>`;
      return link;
    }
    link = `<a href="https://twitter.com/${str}"> @${str}</a>`;
    return link;
  }
  function makeWorkLink(str) {
    let link;
    if (!str) {
      link = `<a id="github" class="not-available">Not available</a>`;
      return link;
    }
    link = `<a href="https://github.com/${str.slice(1)}"> @${str}</a>`;
    return link;
  }
  //Make a link function
  function makeLink(str) {
    let link;
    if (!str) {
      link = `<a id="blog" class="not-available">Not available</a>`;
      return link;
    }
    link = `<a href="${str}"> ${str.slice(8)} </a>`;
    return link;
  }
  //Account hasnt been found function
  function showError() {
    $("#error").css("display", "block");
  }
  //Refresh function
  function refresh() {
    //Empty all outputs and remove anavailable styling
    $("#error").css("display", "none");
    nickname.innerText = "";
    search_input.value = "";

    name.innerText = "";
    name.classList.remove("not-available");

    description.innerText = "";
    description.classList.remove("not-available");

    city.innerText = "";
    city.classList.remove("not-available");

    date.innerText = "";
    date.classList.remove("not-available");

    repos_amount.innerText = "";
    repos_amount.classList.remove("not-available");

    followers_amount.innerText = "";
    followers_amount.classList.remove("not-available");

    following_amount.innerText = "";
    following_amount.classList.remove("not-available");

    work.innerText = "";
    work.classList.remove("not-available");

    twitter.innerText = "";
    twitter.classList.remove("not-available");

    blog.innerText = "";
    blog.classList.remove("not-available");
  }
  //Append function
  function toAppend(where, what, sms, login, link) {
    //If there is no data - show Not Available
    let av = "not-available";
    let appendix = sms || "Not Available";
    // Add @ sign to nickname
    if (where == nickname) {
      appendix = `@${what}`;
      // Format date to readable format
    } else if (where == date) {
      let d = new Date(what);

      // mydate.toDateString().split(' ').slice(1).join(' ')

      appendix = `Joined ${d.toDateString().split(" ").slice(1).join(" ")}`;
      // If there is not Name show login
    } else if (where == name && what == null) {
      appendix = login;
      // Keep zero for numerical outputs
    } else if (what === 0) {
      appendix = 0;
      //Show normal data
    } else if (what) {
      appendix = what;
      av = "available";
    } else {
      //  Add styling of not available info
      where.classList.add(`${av}`);
    }
    where.append(appendix);
  }
  function update_display(data) {
    refresh();
    //Change avatar
    let blog2 = makeLink(data.blog);
    let twitter2 = makeTwitterLink(data.twitter_username);
    let work2 = makeWorkLink(data.company);

    avatar.attr("src", data.avatar_url);

    toAppend(name, data.name, "Not Available", data.login);
    toAppend(nickname, data.login);
    toAppend(date, data.created_at);
    toAppend(description, data.bio, "This profile has no bio");
    toAppend(repos_amount, data.public_repos);
    toAppend(followers_amount, data.followers);
    toAppend(following_amount, data.following);
    toAppend(city, data.location);
    // toAppend(blog, data.blog);
    // toAppend(twitter, data.twitter_username);
    // toAppend(work, data.company);
    $("#twitter").html(twitter2);
    $("#blog").html(blog2);
    $("#work").html(work2);
  }
});
