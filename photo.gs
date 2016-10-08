// See https://developers.google.com/apps-script/overview
var GOOGLE_PHOTOS_FOLDER_ID = "your-google-drive-folder-id";
var MAX_FILES = 1; // The max files to pick from
var MIME_TYPE = MimeType.JPEG;
var PASSWORD = "superdupersecret";

function doGet(e) {
  if (e.parameter.pw !== PASSWORD) {
    return ContentService.createTextOutput();
  }
  var randomPhoto = getRandomPhoto();

  Logger.log("Getting photo: " + randomPhoto.getName());

  var content = Utilities.base64Encode(randomPhoto.getBlob().getBytes());

  var output = ContentService.createTextOutput(content);

  return output;                     
}

function getRandomPhoto() {
  var index = 0;

  // How is this sorted?
  var photos = DriveApp.getFolderById(GOOGLE_PHOTOS_FOLDER_ID)
    .getFilesByType(MIME_TYPE);

  var photo = null;

  // Use reservoir sampling to select a random photo from latest MAX_FILES
  while (photos.hasNext()) {
    if (index > MAX_FILES) {
      break;
    }
    var samplePhoto = photos.next();

    if (Math.random() < (1.0/index)) {
      photo = samplePhoto;
    }
    index++;
  }

  return photo;
}

