"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $newStoryForm.hide();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();

  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show new story form on click on "submit" (only if user is logged in)*/

function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  hidePageComponents();

  $newStoryForm.show();
  $allStoriesList.show();

}
$navSubmit.on("click", navSubmitClick);

/** Show list of favorite stories on click on "favorites" (only if user is logged in) */

function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  $newStoryForm.hide();

  putFavoriteStoriesOnPage(currentUser);
  $favStoriesList.show();

}
$navFavorites.on("click", navFavoritesClick);


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();

  $(".main-nav-links").show();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
