function createTemplate() {
  app.doAction("Create Initial Profile Image Template","Appian Profile Image Initials.ATN")
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

  return [itemOne, itemTwo];
}

var filePath = "~/Desktop/Appian User Images/"
var exportFilePath = filePath + "export/"
var directory = new Folder(filePath)
var directoryExport = new Folder(exportFilePath)

if (!directory.exists) {
  directory.create();
}

if (!directoryExport.exists) {
  directoryExport.create();
}

var baseFilename = "AppianUserImageInitials_"
var templateFilename = baseFilename + "TEMPLATE.psd"

createTemplate();

// save and close
app.activeDocument.saveAs(new File(filePath + templateFilename), PhotoshopSaveOptions)

// don’t modify the original
app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)


// Default characters to start generation with AA
var initialOne = "@";
var initialTwo = "Z";

// Open Template File
var templateFile = new File(filePath + templateFilename);
var doc = app.open(templateFile);

// Set units to pixels
app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS

// Search Layers for Text Layer
for (var j= 0; j < doc.artLayers.length; j++) {
    var layer = doc.artLayers[j];

    // Replace Text Layer Value with Initials
    if (layer.kind == LayerKind.TEXT) {

        var textLayer = doc.artLayers[j];

        var prevInitialOne = initialOne;
        var prevInitialTwo = initialTwo;

        // for (var count = 0; count < 676; count++) {
        for (var count = 0; count < 5; count++) {
          values = nextInitialSet(prevInitialOne, prevInitialTwo);
          initialOne = values[0];
          initialTwo = values[1];

          // Find previous initial and replace with next set
          textLayer.textItem.contents = textLayer.textItem.contents.replace(prevInitialOne + prevInitialTwo, initialOne + initialTwo);

          // Prepare for Save
          pngSaveOptions = new PNGSaveOptions();
          doc.saveAs(new File(exportFilePath + baseFilename + initialOne + initialTwo), pngSaveOptions, true, Extension.LOWERCASE);

          prevInitialOne = initialOne;
          prevInitialTwo = initialTwo;
        }
    }
 }

doc.close(SaveOptions.DONOTSAVECHANGES)