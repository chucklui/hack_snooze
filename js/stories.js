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
        <span class="star-container"><i class="far fa-star"></i></span>
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

//add click handler on new story form itself, 
//listen for submit (screen readers may use enter key)
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

//event delegation-stories list listens for a click on a star icon
//to toggle between favorited (solid star) 
//and unfavorited(start outline)
$storiesContainer.on("click", "i", toggleStarIcon);


/** toggles the between outline star icon (unfavorited) 
 * and solid star icon (favorited) 
*/
function toggleStarIcon(evt){
  console.log("toggleStarIcon event = ", evt);
  console.log("toggleStarIcon event target = ", evt.target);
  $(evt.target).toggleClass('far fas');

  //check to see which class is active, 
  //call appropriate function to add or remove fav
  if($(evt.target).hasClass("fas")){
    addFavOnStarClick(evt.target);
  } 
  
}

/** actually adds the story whose star icon was clicked to favorites  */
function addFavOnStarClick (target){
  console.debug('addFavOnStarClick');
  console.log("addFavOnStarClick target = ", target);
  //find the id of the story that was favorited
  let $storyLiId = $(target).closest("li").attr("id");
  console.log("clicked story li id is: ", $storyLiId);

  // // loop over storyList to find the Story instance matching the 
  // // id of the clicked story
  // let matchingStory = storyList.stories.find(s => {
  //   return s.id === $storyLiId;
  // })
  console.log("matchingStory should be an array with one Story instance: ", matchingStory);

  let storyInstance = matchingStory[0];
  console.log("storyInstance should be the actual Story instance obj = ", storyInstance); 
  currentUser.addFavorite(storyInstance);
}

// /** removes the story whose star icon was clicked to favorites */
// function addFavOnStarClick (target){
//   //find the id of the story that was favorited
//   let $storyLiId = $(target).closest("li").attr("id");
//   // console.log("clicked story li id is: ", $storyLiId);

//   // loop over storyList to find the Story instance matching the 
//   // id of the clicked story
//   let matchingStory = storyList.filter(s => {
//     return s.id === $storyLiId;
//   })

//   let storyInstance = matchingStory[0]; 
//   currentUser.addFavorite(storyInstance);
// }

//add a static method on the Story class (getStoryById), pass in an id that gives you back the Story obj 