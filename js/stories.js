"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //if a user is logged in, show favorite/non-favorite star
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ''}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

  // Make delete  btn
function getDeleteBtnHTML() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"> </i>
    </span>`;
}

  // make star for story
function getStarHTML(story,user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"> </i>
    <span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

  //delete a story
async function deleteStory(e) {
  console.debug("deleteStory");
  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");
  //remove story
  await storyList.removeStory(currentUser,storyId);
  //update story list
  await putUserStoriesOnPage();
}

$ownStories.on("click",".trash-can",deleteStory);

  //sumbit a new story
async function submitNewStory(e) {
  console.debug('submitNewStory');
  e.preventDefault();

  //get form info
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username
  const storyData = {title,url,author,username};

  const story = await storyList.addStory(currentUser,storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // hide and reset form
  $submitForm.slideUp('slow');
  $submitForm.trigger('reset');
}

$submitForm.on("submit",submitNewStory);

// user's own stories functionality:
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if(currentUser.ownStories.length === 0) {
    $ownStories.append("<h4>  There are no stories added by user yet! </h4>");
  } else {
    //loop through users stories and generate html for them
    for(let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story,true);
      $ownStories.append($story)
    }
  }
  $ownStories.show();
}

//favorite list functionality

//put favorited stories on page
function putFavoritesListOnPage() {
  $favoritedStories.empty();
  if(currentUser.favorites.length === 0) {
    $favoritedStories.append('<h4> There are no favorited stories! </h4>')
  } else {
    //loop through the favorites and generate html for them
    for(let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

//favorite/un-favorite a story
async function toggleStoryFavorite(e) {
  const $eventTarget = $(e.target);
  const $closestLi = $eventTarget.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  //verify if the story is already favorited
  if($eventTarget.hasClass('fas')) {
    //is favorited  => remove from favorited list
    await currentUser.removeFavorite(story);
    $eventTarget.closest('i').toggleClass('fas far')
  } else {
    //is not favorited => add to the fav list
    await currentUser.addFavorite(story);
    $eventTarget.closest('i').toggleClass('fas far');
  }
}

$allStoriesList.on('click', '.star', toggleStoryFavorite)