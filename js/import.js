var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    var activeTextField = $(".dijitTabPaneWrapper.dijitTabContainerTop-container.dijitTabPaneWrapperNested.dijitAlignCenter .dijitTabContainerTopChildWrapper.dijitVisible textarea").attr('id');
    dijit.byId(activeTextField).set("value", text);
  };
  reader.readAsText(input.files[0]);
};
