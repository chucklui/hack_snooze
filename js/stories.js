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

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup");
  // console.log('story:', story);
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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

/** Gets data from the new story form, 
 * uses those values to create a new Story instance, 
 * generates their HTML, 
 * and puts the new story on page 
*/
async function putNewStoryOnPage(evt){
  console.debug('putNewStoryOnPage');
  evt.preventDefault();
  const author = $("#author-input").val();
  const title = $("#title-input").val();
  const url = $("#url-input").val();
  const newStoryDataObj = {title, author, url};

  let newStoryInstance = await storyList.addStory(currentUser, newStoryDataObj);

  const $newStory = generateStoryMarkup(newStoryInstance);

  $allStoriesList.prepend($newStory);

  $newStoryForm.hide();
}

//add click handler on new story form itself, listen for submit (screen readers may use enter key)
$newStoryForm.on('submit', putNewStoryOnPage);

/** Accepts a currentUser User instance
 * creates markup for each favorited story 
 * adds to favorite stories list
*/
function putFavoriteStoriesOnPage(currentUser){
  console.debug('putFavoriteStoryOnPage');
  const currentUserFavs = currentUser.favorites;
  $favStoriesList.empty();

  for(let fav of currentUserFavs){
    let $favMarkup = generateStoryMarkup(fav);
    $favStoriesList.append($favMarkup);
  }
}
