index = {};

/**
 * Receive messages from websocket connection
 * @param event Event
 * @param  {{id: number, host: string, viz: nnumber[]}}
 *                       json Lightining server configuration
 */
index.onMessage = function(event, json) {
  if (json.jsonClass === "Config") {
    index.onConfig(event, json);

  } else if (json.jsonClass === "Stats") {
    index.onStats(event, json);
  }
};

/**
 * Build graphs with config message
 * @param event Event
 * @param  {{id: number, host: string, viz: nnumber[]}}
 *                       json Lightining server configuration
 */
index.onConfig = function( event, json ) {
  $("#graphs" ).empty();
  $("#count").text("0");
  $("#batch").text("0");
  $("#mse").text("0");
  $("#realStddev").text("0");
  $("#predStddev").text("0");

  if (json.id === 0 || json.host === "")
    return;

  for (i = 0; i < json.viz.length; i++) {
    var vizId = json.viz[i];
    var divId = "graph" + vizId;
    var url = json.host + "/visualizations/" + vizId + "/pym";

    $( "#graphs" ).append( $( "<div id='"+ divId +"'/>" ) );

    new pym.Parent(divId, url, {});
  }
};

/**
 * Update statistics with stats message
 * @param event Event
 * @param  {{count: number},
 *         {batch: number},
 *         {mse: number},
 *         {realStddev: number},
 *         {predStddev: number}} json Statistics data
 */
index.onStats = function( event, json ) {
  $("#count").text(json.count);
  $("#batch").text(json.batch);
  $("#mse").text(json.mse);
  $("#realStddev").text(json.realStddev);
  $("#predStddev").text(json.predStddev);
};

/**
 * starts when page is read
 */
index.init = function() {
  api.bind(index.onMessage);
  api.websocketOn();
};

/**
 * Bind document ready event
 */
$( document ).ready( index.init );