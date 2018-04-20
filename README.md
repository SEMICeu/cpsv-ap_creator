# CPSV-AP Public Service Description Creator

This is a proof of concept editor for editing public service descriptions according to the Core Public Service Vocabulary Application Profile (CPSV-AP) v2.1. The editor is driven by the RDForms library which uses templates to generate HTML Forms to edit RDF. The Public Service Describer will allow European public administrations to create public service descriptions in an easy-to-use web form and export these descriptions in CPSV-AP 2.1 compliant machine-readable formats to store locally on a computer. 

The CPSV-AP Public Service Description Creator uses [RDForms 4.1 by MetaSolutionsAB](https://github.com/MetaSolutionsAB/rdforms/releases/tag/4.1), a JavaScript library that provides a way to declarative describe how the editor and presentation views of RDF should look like. The configuration mechanism eliminates the need for programming once the library has been deployed into an environment. The main task of RDForms is to make it easy to construct form-based RDF editors in a web environment. To accomplish this, RDForms relies on a templating mechanism that both describes how to generate a HTML-form and how to map specific expressions in a RDF graph to corresponding fields. Simply put, RDForm uses a template to construct the input-form for the user and its transformation to RDF. 


## Installation instructions

To install the CPSV-AP Description creator, please follow one of the following methods:
* [automated installation for Windows](#automatedInstallation)
* [Command-line installation instructions for Linux](#commandLineInstallation)

Both methods are explained in more details in the following paragraph.
After installation, make sure to follow the steps provided in the [Configuration section](#configuration) and finaly the [usage instructions](#usageInstructions).

### Automated installation for Windows <a name="automatedInstallation"></a>

Download the content of this GitHub project to your local computer and unzip it.

![How to download the content of a GitHub project](https://github.com/catalogue-of-services-isa/cpsv-ap_rdf_editor/blob/master/images/downloadProjectFromGitHub.png?raw=true)

Double-click the install.bat file in the main folder. The CPSV-AP description Creator will now install.
Next to this, the following programs will be installed which are required to be able to run the Description Creator (default settings apply):
* nodejs
* bower
* Git

If some/all of these programs are already installed on your computer, the installation process will automatically detect this and skip their installation.

It is possible that your computer will need to be restarted during the process. If so, please re-open the install.bat file after restarting to continue the installation process.

### Command-line installation instructions for Linux <a name="commandLineInstallation"></a>

The CPSV-AP Public Service Description Creator uses [RDForms 4.1 by MetaSolutionsAB](https://github.com/MetaSolutionsAB/rdforms/releases/tag/4.1), a JavaScript library that provides a way to declarative describe how the editor and presentation views of RDF should look like. Before you can use the editor you need to make sure all the dependencies for RDForms are loaded and RDForms is build. To load the dependencies, simply run:

    $ cd path_to_cpsv-ap_creator
    $ npm   install
    $ bower install

This requires that you have [nodejs](http://nodejs.org/), [npm](https://www.npmjs.org/) and [bower](http://bower.io/) installed. Note: npm installs nodejs libraries used by converters and a small webserver used by the formulator (to be introduced below) while bower installs the client libraries such as dojo and rdfjson that RDForms builds upon. 

After having installed the dependencies, build RDForms. This is done by:

    $ cd path_to_cpsv-ap_creator/build
    $ ./build.sh

## Configuration <a name="configuration"></a>

Due to the AJAX approach for loading dependencies you first have to allow your browser to do AJAX request from a file url,

in Firefox this is done by:
* Going into the config mode by typing about:config in the location bar
* Searching for and changing the security.fileuri.strict_origin_policy to false

In Chrome this is done by starting the browser with the following flag: --allow-file-access-from-files

## Usage instructions <a name="usageInstructions"></a>

Open the publicserviceCreator.html file in your standard web browser. 

Edit your description in the editor tab, see the results in the present tab and download the resulting RDF in the RDF tab. Any changes you make in the editor will be reflected in the other tabs. Created descriptions can be imported into the RDF tab and then viewed (and possibly changed) in the editor tab. The tool allows to make a description for one public service and to export the created description.

## License

This software is released with the LGPL-3.0 license.
