/*Function to download text to a local file*/
function download(filename, text) {
    var textXML = dijit.byId("dijit_form_SimpleTextarea_1").value;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/*Function executed once the download button is clicked*/
/*Checks whether RDF/XML or RDF/JSON is active and launches the appropriate actions*/
function downloadClicked() {
	/*Get the value of the active text field*/
    var activeTextField = $(".dijitTabPaneWrapper.dijitTabContainerTop-container.dijitTabPaneWrapperNested.dijitAlignCenter .dijitTabContainerTopChildWrapper.dijitVisible textarea").attr('id');
    var textEditorFormat = dijit.byId(activeTextField).value;
    /*var textXML = dijit.byId("dijit_form_SimpleTextarea_1").value;
    var textJSON = dijit.byId("dijit_form_SimpleTextarea_2").value;*/

    var textRDFFormat = null;
    if (activeTextField == "dijit_form_SimpleTextarea_1") {
        textRDFFormat = transformRDFXMLtoCPSV(textEditorFormat);
        download('PublicServiceDescriptionRDFXML.xml', textRDFFormat);
    } else {
        textRDFFormat = transformRDFJSONtoCPSV(textEditorFormat);
        download('PublicServiceDescriptionRDFJSON.xml', textRDFFormat);
    }
}