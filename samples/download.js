function transformRDFXML(text) {
    /*Replace the http://example.com/about with the Public Service Identifier*/
    /*find identifier*/
    var pos = text.indexOf("<dcterms:identifier");
    var posStart = text.indexOf(">", pos) + 1;
    var posEnd = text.indexOf("<", posStart);
    var identifier = text.substring(posStart, posEnd);
    /*replace with identifier*/
    text = text.replace("http://example.com/about", identifier);
    /*remove identifier and Insert <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>*/
    text = text.replace("<dcterms:identifier>" + identifier + "</dcterms:identifier>", '<rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>');

    var posNodeID, posStartNodeID, posEndNodeID = 0;
    var nodeID = null;
    /*As long as it finds identifiers, replace them over the whole document*/
    while ( text.indexOf("dcterms:identifier") != -1 ) {

        /*find identifier*/
        pos = text.indexOf("dcterms:identifier", posEnd);
        posStart = text.indexOf(">", pos) + 1;
        posEnd = text.indexOf("<", posStart);
        identifier = text.substring(posStart, posEnd);
        /*find rdf:nodeID*/
        posNodeID = text.lastIndexOf("nodeID", pos);
        posStartNodeID = text.indexOf('"', posNodeID) + 1;
        posEndNodeID = text.indexOf('"', posStartNodeID);
        nodeID = text.substring(posStartNodeID, posEndNodeID);
        /*replace all occurences*/
        while (text.indexOf(nodeID) != -1 ) {
            text = text.replace(nodeID, identifier);
        };
        /*remove identifier*/
        text = text.replace(" <dcterms:identifier>" + identifier + "</dcterms:identifier>", "");
        text = text.replace(/^\s*[\r\n]/gm, "");

    }

    /*Replace all rdf:Description rdf:nodeID with rdf:Description rdf:about*/
    text = text.replace(/rdf:Description rdf:nodeID/g, "rdf:Description rdf:about");

    /*Replace all remaining rdf:nodeID with rdf:resource*/
    text = text.replace(/rdf:nodeID/g, "rdf:resource");                
        
    return text;
}

function transformRDFJSON(text) {
    /*Replace the http://example.com/about with the Public Service Identifier*/
    /*find identifier*/
    var pos = text.indexOf("http://purl.org/dc/terms/identifier");
    var posStart = text.indexOf('value": "', pos) + 9;
    var posEnd = text.indexOf('"', posStart);
    var identifier = text.substring(posStart, posEnd);
    /*replace with identifier*/
    text = text.replace("http://example.com/about", identifier);
    /*remove identifier and Insert <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>*/
    text = text.replace('"type": "literal",', '"type": "uri",');
    text = text.replace('"http://purl.org/dc/terms/identifier"', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    text = text.replace('"value": "' + identifier, '"value": "http://purl.org/vocab/cpsv#PublicService');

    /*As long as it finds identifiers, replace them over the whole document*/
    while ( text.indexOf("http://purl.org/dc/terms/identifier") != -1 ) {
        /*find identifier*/
        pos = text.indexOf("http://purl.org/dc/terms/identifier", posEnd);
        posStart = text.indexOf('value": "', pos) + 9;
        posEnd = text.indexOf('"', posStart);
        identifier = text.substring(posStart, posEnd);
        /*remove identifier*/
        text = text.replace('"http://purl.org/dc/terms/identifier": [', "");
        var index = text.indexOf('{', pos);
        text = text.substr(0, index) + '' + text.substr(index + 1);
        index = text.indexOf('"type": "literal",', pos);
        text = text.substr(0,index) + '' + text.substr(index+18);
        text = text.replace('"value": "' + identifier + '"', "");
        index = text.indexOf('}', pos);
        text = text.substr(0,index) + '' + text.substr(index+1);
        index = text.indexOf(']', pos);
        text = text.substr(0,index) + '' + text.substr(index+1);
        index = text.lastIndexOf(',', pos);
        text = text.substr(0,index) + '' + text.substr(index+1);
        text = text.replace(/^\s*[\r\n]/gm, "");
        /*find bnode*/
        posNodeID = text.lastIndexOf('"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [', pos);
        posEndNodeID = text.lastIndexOf('": {', posNodeID);
        posStartNodeID = text.lastIndexOf('"', posEndNodeID-1)+1;
        nodeID = text.substring(posStartNodeID, posEndNodeID);
        while (text.indexOf(nodeID) != -1 ) {
            text = text.replace(nodeID, identifier);
        };
    }

    return text;
}

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