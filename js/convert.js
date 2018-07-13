function includedctermsnamespace (text) {
    setTimeout( function () {
        if (( text.split("rdf:about").length - 1 < 2 )) {
            if (( text.split('xmlns:dcterms="http://purl.org/dc/terms/"').length - 1 < 1 )) {
                xmlns:dcterms="http://purl.org/dc/terms/";
                var textXML = dijit.byId("dijit_form_SimpleTextarea_1").get("value");
                posStartTag = textXML.indexOf("<rdf:RDF ");
                textXML = textXML.substr(0, posStartTag + 9) + 'xmlns:dcterms="http://purl.org/dc/terms/"' + "\n    " + textXML.substr(posStartTag + 9);
                dijit.byId("dijit_form_SimpleTextarea_1").set("value", textXML);
            }
        }
    }, 10);
}


function convertToCPSV () { 
    setTimeout( function () {
        /*Get the value of the text fields*/
        var textXML = dijit.byId("dijit_form_SimpleTextarea_1");
        includedctermsnamespace(textXML.get("value"));   
        textXML.set("value", transformRDFXMLtoCPSV(textXML.get("value")));
    }, 10);
}

function convertToEditor () {
    /*Get the value of the active text field*/
    var textXML = dijit.byId("dijit_form_SimpleTextarea_1");
    textXML.set("value", transformRDFXMLtoEditor(textXML.get("value")));
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

    var posStartNodeID,posEndNodeID = -1;
    var nodeID = null;
    /*As long as it finds identifiers further on in the document, replace them over the whole document*/
    while (text.indexOf("<dcterms:identifier", posEndDescription) != -1 ) {
        /*find identifier value*/
        pos = text.indexOf("dcterms:identifier", posEndDescription);
        posStart = text.indexOf(">", pos) + 1;
        posEnd = text.indexOf("<", posStart);
        identifier = text.substring(posStart, posEnd);
        /*find rdf:nodeID value*/
        posStartNodeID = text.lastIndexOf("nodeID", pos) + 8;
        posEndNodeID = text.indexOf('"', posStartNodeID);
        nodeID = text.substring(posStartNodeID, posEndNodeID);
        posEndDescription = text.indexOf("</rdf:Description>", posEndNodeID);
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
    nodeID = -1;
    /* As long as it finds rdf:about, replace them over the whole document */
     while (text.indexOf("rdf:about", posEndID) != -1 ) {
        /*find rdf:about*/
        posID = text.indexOf("rdf:about", posEndID);
        posStartID = text.indexOf('"', posID) + 1;
        posEndID = text.indexOf('"', posStartID);
        identifier = text.substring(posStartID, posEndID);
        nodeID = nodeID + 1;
        text = text.replace('rdf:about="' + identifier, 'rdf:nodeID="_n' + nodeID);

        /*replace all occurences of rdf:resource=identifier by blank node ID*/
        while (text.indexOf('rdf:resource="' + identifier) != -1) {
            text = text.replace('rdf:resource="' + identifier, 'rdf:nodeID="_n' + nodeID);
        };
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