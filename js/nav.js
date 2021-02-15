"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click","#nav-all",navAllStories);

//show submit form on clicking story 'submit'
function navSubmitStoryClick() {
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on('click',navSubmitStoryClick);

//show favorited stories when 'favorites' is clicked
function navFavoritesClick() {
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on('click','#nav-favorites',navFavoritesClick);

//when 'My stories' is clicked, show my stories

function navMyStories() {
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on('click', '#nav-my-stories', navMyStories)

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click",navLoginClick);

//when 'profile' is clicked, hide everything except profile
function navProfileClick() {
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on('click',navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
