// Size of the Photoshop document canvas (Width x Height)
const CANVAS_SIZE = Array(500, 500);
// Background Color as Hex Code
const BACKGROUND_COLOR = "8a8a8a";
// Text Color as Hex Code
const TEXT_COLOR = "ffffff";
// Font Used to Display Initials
const TEXT_FONT = "Open Sans Regular";
// Size of User Initials
const TEXT_SIZE = 60;
// Number of Initials to Process (Max 2)
const INITIAL_SET = 1


function determineLayerTranslation(boundsOfLayerToTranslate) {
  // Returns the horizontal and vertical offset used to center the given layer to canvas
  var layerHeight = boundsOfLayerToTranslate[3].value - boundsOfLayerToTranslate[1].value;
  var layerWidth = boundsOfLayerToTranslate[2].value - boundsOfLayerToTranslate[0].value;
  var layerdistanceFromLeadingEdge = boundsOfLayerToTranslate[0].value;

  // Calculate translation values
  var translateHorizontal = (CANVAS_SIZE[0]/2) - (layerWidth/2) - layerdistanceFromLeadingEdge;
  var translateVerical = (CANVAS_SIZE[1]/2) + (layerHeight / 2);

  return Array(translateHorizontal, translateVerical);
}


function nextChar(c) {
  // Returns next ASCII character given input character
  return String.fromCharCode(c.charCodeAt(0) + 1);
}


function nextInitialSet(a, b) {
  // Returns next initial set given input characters
  var itemOne = a
  var itemTwo = b

  if (itemTwo == "Z") {
    itemOne = nextChar(a);
    itemTwo = "A";
  }
  else {
    var itemTwo = nextChar(b);
  }

  return Array(itemOne, itemTwo);
}


/*
  Initialize Variables
*/

// System
var filePath = "~/Desktop/Appian User Images/"
var exportFilePath = filePath + "export/"
var directory = new Folder(filePath)
var directoryExport = new Folder(exportFilePath)

// Colors
var bgcolor = new SolidColor();
bgcolor.rgb.hexValue = BACKGROUND_COLOR;
var fcolor = new SolidColor();
fcolor.rgb.hexValue = TEXT_COLOR;

// Initial Preferences
var startRulerUnits = app.preferences.rulerUnits
var startTypeUnits = app.preferences.typeUnits


/*
  Set Preferences and Default Values
*/

// Photoshop Preferences
app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.POINTS

// Colors
app.backgroundColor = bgcolor;
app.foreground = fcolor;

// Characters
var initialOne = "@";
var initialTwo = "Z";

// Loop Count
if (INITIAL_SET == 2) {
  var loopCount = 676
} else {
  var loopCount = 26
}


/*
  Create Export Directory
*/

if (!directory.exists) {
  directory.create();
}

if (!directoryExport.exists) {
  directoryExport.create();
}


/*
  Begin Image Creation
*/

// Create New Document
var doc = app.documents.add(CANVAS_SIZE[0], CANVAS_SIZE[1], 300, "temp", NewDocumentMode.RGB, DocumentFill.BACKGROUNDCOLOR);

// Loop

for (var count = 0; count < loopCount; count++) {

  values = nextInitialSet(initialOne, initialTwo);
  initialOne = values[0];
  initialTwo = values[1];

  // Generate Text Layer
  var textLayer = activeDocument.artLayers.add();
  textLayer.name = "User Initials Text";
  textLayer.kind = LayerKind.TEXT;

  // Create Text
  var textProperty = textLayer.textItem;
  textProperty.kind = TextType.POINTTEXT;

  //Font Size
  textProperty.size = TEXT_SIZE;
  textProperty.font = TEXT_FONT;
  textProperty.position = new Array(0,0);
  textProperty.color = fcolor;
  if (INITIAL_SET == 2) {
    textProperty.contents = initialOne + initialTwo;
  } else {
    textProperty.contents = initialTwo;
  }


  // Align Layer
  var test = determineLayerTranslation(textLayer.bounds)
  textLayer.translate(test[0], test[1]);

  // Save
  if (INITIAL_SET == 2) {
    var outputFilename = initialOne + initialTwo
  } else {
    var outputFilename = initialTwo
  }
  pngSaveOptions = new PNGSaveOptions();
  doc.saveAs(new File(exportFilePath + outputFilename), pngSaveOptions, true, Extension.LOWERCASE);

  textLayer.remove();
}


/*
  Perform Clean up
*/

// Close temp document
doc.close(SaveOptions.DONOTSAVECHANGES)

// Reset preferences
app.preferences.rulerUnits = startRulerUnits
app.preferences.typeUnits = startTypeUnits