function switchToRDFXML () {
    setTimeout( function () { 
        if (( text.split("rdf:about").length - 1 < 2 )) {
            xmlns:dcterms="http://purl.org/dc/terms/";
            var textXML = dijit.byId("dijit_form_SimpleTextarea_1").get("value");
            posStartTag = textXML.indexOf("<rdf:RDF ");
            textXML = textXML.substr(0, posStartTag + 9) + 'xmlns:dcterms="http://purl.org/dc/terms/"' + "\n" + textXML.substr(posStartTag + 9);
            dijit.byId("dijit_form_SimpleTextarea_1").set("value", textXML);
        }
    }, 10);
}

function convertToCPSV () {	
	setTimeout( function ()	{	
	    /*Get the value of the text fields*/
	    var textXML = dijit.byId("dijit_form_SimpleTextarea_1");
	    var textJSON = dijit.byId("dijit_form_SimpleTextarea_2");
	    textXML.set("value", transformRDFXMLtoCPSV(textXML.get("value")));
		textJSON.set("value", transformRDFJSONtoCPSV(textJSON.get("value")));
    }, 10);
}

function convertToEditor () {
	/*Get the value of the active text field*/
    var textXML = dijit.byId("dijit_form_SimpleTextarea_1");
    var textJSON = dijit.byId("dijit_form_SimpleTextarea_2");
    textXML.set("value", transformRDFXMLtoEditor(textXML.get("value")));
	textJSON.set("value", transformRDFJSONtoEditor(textJSON.get("value")));
}

function transformRDFXMLtoCPSV(text) {
    var pos, posStart, posEnd = -1; 
    /* Check if there is an ID for the public service, or there is no PS ID but there are attributes for the PS or another entity, or there's nothing about the public service at all*/
    var posStartDescription = text.indexOf('<rdf:Description rdf:about="http://example.com/about">');
    var posIdentifier = text.indexOf("<dcterms:identifier", posStartDescription);
    var posEndDescription = text.indexOf("</rdf:Description>", posStartDescription);

    /* if an identifier is present for the PS */
    if (posStartDescription != -1 && posIdentifier != -1 && posEndDescription != -1 && posStartDescription < posIdentifier && posIdentifier < posEndDescription) {
        var posStart = text.indexOf(">", posIdentifier) + 1;
        var posEnd = text.indexOf("<", posStart);
        var identifier = text.substring(posStart, posEnd);
        /*insert <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>*/
        text = text.substr(0, posEnd + 21) + "\n" + '    <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>' + text.substr(posEnd + 21);
        /*replace with identifier*/
        if (isURL(identifier)) { 
            text = text.replace("http://example.com/about", identifier);
        } else {
            text = text.replace('rdf:about="http://example.com/about', 'rdf:nodeID="' + identifier);
        }
    /* if no identifier is present for the PS */       
    } else if ( (posIdentifier == -1 && posStartDescription != -1 && posEndDescription != -1) || ( posStartDescription != -1 && posIdentifier != -1 && posEndDescription != -1 ) ) {
        /*replace with blank node identifier*/
        text = text.replace('rdf:about="http://example.com/about', 'rdf:nodeID="PS_0');
        /*insert <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>*/
        index = text.indexOf('rdf:nodeID="PS_0">');
        text = text.substr(0, index + 18) + "\n" + '    <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>' + "\n" + '    <dcterms:identifier>PS_0</dcterms:identifier>' + text.substr(index + 18);
    } else {

    }

    posEndDescription = text.indexOf("</rdf:Description>", posStartDescription);

    console.log(text);

    var posStartNodeID,posEndNodeID = -1;
    var nodeID = null;
    /*As long as it finds identifiers further on in the document, replace them over the whole document*/
    while (text.indexOf("<dcterms:identifier", posEndDescription) != -1 ) {
        /*find identifier value*/
        pos = text.indexOf("dcterms:identifier", posEndDescription);
        posStart = text.indexOf(">", pos) + 1;
        posEnd = text.indexOf("<", posStart);
        identifier = text.substring(posStart, posEnd);
        console.log(identifier);
        /*find rdf:nodeID value*/
        posStartNodeID = text.lastIndexOf("nodeID", pos) + 8;
        posEndNodeID = text.indexOf('"', posStartNodeID);
        nodeID = text.substring(posStartNodeID, posEndNodeID);
        posEndDescription = text.indexOf("</rdf:Description>", posEndNodeID);
        console.log(nodeID);
        /* if not a blank node, change rdf:nodeID by rdf:about in the description*/
        if (isURL(identifier)) {
            text = text.replace('rdf:Description rdf:nodeID="' + nodeID, 'rdf:Description rdf:about="' + identifier);
            /*replace all occurences*/
            while (text.indexOf(nodeID) != -1 ) {
                text = text.replace('rdf:nodeID="' + nodeID,'rdf:resource="' + identifier);
            };
        } else {
             /*replace all occurences*/
            while (text.indexOf(nodeID) != -1 ) {
                text = text.replace('rdf:nodeID="' + nodeID,'rdf:nodeID="' + identifier);
            };
        }
    }
    return text;
}

function transformRDFXMLtoEditor(text) {
    /* Check if there is an ID for the public service*/
    var posPS = text.indexOf('<rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>');
    var posStartDescription = text.lastIndexOf("<rdf:Description", posPS);
    var posIdentifier = text.indexOf('rdf:about=');
    var posIdentifierBlankNode = text.indexOf('rdf:nodeID=');

    /* if URI identifier for PS */
    if ( posPS != -1 && posStartDescription != -1 && posIdentifier != -1 && posStartDescription < posIdentifier && posIdentifier < posPS ) {
        /*find identifier*/
        var posStart = text.indexOf('"', posIdentifier) + 1;
        var posEndID = text.indexOf('"', posStart);
        var identifier = text.substring(posStart, posEndID);
        /*replace with example:about*/
        text = text.replace(identifier, "http://example.com/about");
        /*remove <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>*/
        text = text.replace('<rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>', "");
        text = text.replace(/^\s*[\r\n]/gm, "");
    /* if blank node identifier for PS */
    } else if ( posPS != -1 && posStartDescription != -1 && posIdentifierBlankNode != -1 && posStartDescription < posIdentifierBlankNode && posIdentifierBlankNode < posPS ) {
        /*find identifier*/
        var posStart = text.indexOf('"', posIdentifierBlankNode) + 1;
        var posEndID = text.indexOf('"', posStart);
        var identifier = text.substring(posStart, posEndID);
        /*replace with example:about*/
        text = text.replace('rdf:nodeID="' + identifier, 'rdf:about="http://example.com/about');
        /*remove <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>*/
        text = text.replace('<rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>', "");
        text = text.replace(/^\s*[\r\n]/gm, "");
    } else {

    }

    var posID, posStartID, nodeID = -1;
    /* As long as it finds rdf:about, replace them over the whole document */
     while (text.indexOf("rdf:about", posEndID) != -1 ) {
        /*find rdf:about*/
        posID = text.indexOf("rdf:about", posEndID);
        posStartID = text.indexOf('"', posID) + 1;
        posEndID = text.indexOf('"', posStartID);
        identifier = text.substring(posStartID, posEndID);
        console.log(identifier);
        nodeID = nodeID + 1;
        text = text.replace('rdf:about="' + identifier, 'rdf:nodeID="_n' + nodeID);

        /*replace all occurences of rdf:resource=identifier by blank node ID*/
        while (text.indexOf('rdf:resource="' + identifier) != -1) {
            console.log("here");
            text = text.replace('rdf:resource="' + identifier, 'rdf:nodeID="_n' + nodeID);
        };
    }  

    return text;
}

function transformRDFJSONtoCPSV(text) {
    var length = text.length;
    var posStartAbout = text.indexOf("http://example.com/about");
    var posIdentifier = text.indexOf("http://purl.org/dc/terms/identifier");
        /* if there is no next node, put it on EOF*/
    var posStartTypeNextNode = ( text.indexOf("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", posStartAbout) != -1 ) ? text.indexOf("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", posStartAbout) : length;
    
    /* If PS has identifier */
    if (posStartAbout != -1 && posIdentifier != -1 && posStartAbout < posIdentifier && posIdentifier < posStartTypeNextNode) {
        /* find identifier*/
        var posStartIdentifier = text.indexOf('value": "', posIdentifier) + 9;
        var posEndIdentifier = text.indexOf('"', posStartIdentifier);
        var identifier = text.substring(posStartIdentifier, posEndIdentifier);
        /*replace with identifier*/
        text = text.replace("http://example.com/about", identifier);
        /*remove identifier and Insert <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService"/>*/
        text = text.replace('"http://purl.org/dc/terms/identifier"', '"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"');
        text = text.replace('"type": "literal",', '"type": "uri",');
        text = text.replace('"value": "' + identifier, '"value": "http://purl.org/vocab/cpsv#PublicService');
    /* If PS has no Identifier */
    } else if ( posStartAbout != -1) { 
        var identifier = "PS_0";
        /*replace with identifier*/
        var textInsertPoint = posStartAbout + 33;
        text = text.substr(0, textInsertPoint) + "\n" + '    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [' + "\n" + '      {' + "\n" + '        "type": "uri",' 
                                            + "\n" + '        "value": "http://purl.org/vocab/cpsv#PublicService"' + "\n" + '      }' + "\n" + "    ]," + text.substr(textInsertPoint);
        text = text.replace("http://example.com/about", identifier);
    } else {

    }

    /*As long as it finds identifiers, replace them over the whole document*/
    while ( text.split("http://purl.org/dc/terms/identifier").length > 1 ) {
        /*find identifier*/
        var posIdentifier = text.indexOf("http://purl.org/dc/terms/identifier");
        var posStartIdentifier = text.indexOf('value": "', posIdentifier) + 9;
        posEndIdentifier = text.indexOf('"', posStartIdentifier);
        identifier = text.substring(posStartIdentifier, posEndIdentifier);
        /*remove identifier*/
        indexStart = text.lastIndexOf(",", posIdentifier);
        indexEnd = text.indexOf(']', indexStart) + 1;
        text = text.substr(0,indexStart) + '' + text.substr(indexEnd);
        text = text.replace(/^\s*[\r\n]/gm, "");

        console.log(identifier);

        if (isURL(identifier)) {
            console.log("here");
            /*find objectNodeID */
            posObjectNodeID = text.lastIndexOf('"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [', posIdentifier);
            posEndObjectNodeID = text.lastIndexOf('": {', posObjectNodeID);
            posStartObjectNodeID = text.lastIndexOf('"', posEndObjectNodeID-1) + 1;
            ObjectNodeID = text.substring(posStartObjectNodeID, posEndObjectNodeID);
            console.log(ObjectNodeID);
            text = text.substr(0, posStartObjectNodeID) + identifier + text.substr(posEndObjectNodeID);

            console.log(text);
            
            /* replace type:bnode by type:uri in all references */
            while (text.split('"value": "' + ObjectNodeID).length > 1 ) {
                var position = text.indexOf('"value": "' + ObjectNodeID);
                var positionBeginID = text.indexOf(': "', position) + 3;
                var positionEndID = text.indexOf('"', positionBeginID + 1);
                var id = text.substring(positionBeginID, positionEndID);
                console.log("THIIIIIIIIIIIS" + id);
                var positionbnode = text.lastIndexOf('bnode', position);
                text = text.substr(0, positionbnode) + 'uri' + text.substr(positionbnode + 5);
                text = text.replace('"value": "' + ObjectNodeID, '"value": "' + identifier)
            };

        }
    }

    return text;
}

function transformRDFJSONtoEditor(text) {
    var posPublicServiceURI = text.indexOf("http://purl.org/vocab/cpsv#PublicService");
    var posStartRFDSType = text.indexOf('"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"');
    var posEndIdentifier = text.lastIndexOf('"', posStartRFDSType - 1);
    var posStartIdentifier = text.lastIndexOf('"', posEndIdentifier - 1) + 1;
    var identifier = text.substring(posStartIdentifier, posEndIdentifier);

    /* PS has identifier (uri or blank node), or PS is not present (empty dataset) */
    if ( posPublicServiceURI != -1 && posStartRFDSType != -1 && posStartIdentifier != -1 && posEndIdentifier != -1 && posStartIdentifier < posStartRFDSType && posStartRFDSType < posPublicServiceURI ) {
        /*replace with identifier*/
        text = text.replace(identifier, "http://example.com/about");
        text = text.replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://purl.org/dc/terms/identifier");
        /*remove <rdf:type rdf:resource="http://purl.org/vocab/cpsv#PublicService" and insert identifier/>*/
        text = text.replace('"type": "uri",', '"type": "literal",');
        text = text.replace('"value": "http://purl.org/vocab/cpsv#PublicService', '"value": "' + identifier);
    } else {

    }

        var nodeID = 0;
        var indeces = getIndicesOf("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", text, true);
        console.log(indeces);
        for (var i = 0; i < indeces.length; i++) {
            indeces = getIndicesOf("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", text, true);
            /*find identifier*/
            var pos = indeces[i];
            console.log(pos);
            posEnd = text.lastIndexOf('"', pos - 2);
            posStart = text.lastIndexOf('"', posEnd - 1) + 1;
            identifier = text.substring(posStart, posEnd);
            if (isURL(identifier)) {
                /* replace identifier */
                nodeID = nodeID + 1;
                text = text.substr(0, posStart) + '_:n' + nodeID + text.substr(posEnd);
                console.log(identifier);
                /*replace all references to object by identifier by blank node ID*/
                while (text.split('"value": "' + identifier).length > 1 ) {
                    var posReferenceValue = text.indexOf('"value": "' + identifier);
                    var posReferenceType = text.lastIndexOf('uri"', posReferenceValue);
                    text = text.substr(0, posReferenceType) + "bnode" + text.substr(posReferenceType + 3 );
                    text = text.replace('"value": "' + identifier, '"value": "_:n' + nodeID);
                };

                /* add identifier */
                var index = text.indexOf("]", pos);
                text = text.substr(0, index + 1) + "," + "\n" + '    "http://purl.org/dc/terms/identifier": [' + "\n" + '       { ' + "\n" + '        "type": "literal",' + "\n" 
                + '        "value": "' + identifier +'"' + "\n" + '      }' + "\n" + '    ]' + text.substr(index + 1);
            }
            
            console.log(text);
        /*As long as it finds rdf:type, replace them over the whole document*/
        /*while ( text.split("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").length > 1 ) {*/
            
        }

                
    return text;
}


function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?'+ // port
  '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
  '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}


function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
