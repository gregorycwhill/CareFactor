$( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
} );

$( function() {
    $( "#accordion" ).accordion();
} );

$( function() {
    $( "#tabs" ).tabs();
} );

$( function() {
    $( "#dialog" ).dialog();
} );
// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}

// Utility function to fetch key values from query string
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

    
function updateInput(){

	var slots = document.getElementById('SlotsSlider').value;
	var spend = document.getElementById('SpendText').value;

	document.getElementById('SlotsText').innerHTML=slots;

	setCell('','Experiment!B2',slots); // callback
	setCell('','Experiment!B3',spend); // callback

    document.getElementById('portfolio-chart-treemap').innerHTML = "<p>Please wait ... recalculating your portfolio</p>"
    setTimeout(drawChart,5000); // wait for spreadsheet to get new values and recalculate
}

google.charts.load('current', {'packages':['treemap']});
google.charts.setOnLoadCallback(drawChart);
      
function drawChart() {
	var query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8/gviz/tq?gid=487731565&headers=1&range=H1:J10');
    query.send(handleQueryResponse);
}


function handleQueryResponse(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

	var data = response.getDataTable();

    tree = new google.visualization.TreeMap(document.getElementById('portfolio-chart-treemap'));

    tree.draw(data, {
		minColor: '#cce',
        midColor: '#dda',
        maxColor: '#ee8',
        headerHeight: 20,
        fontColor: 'black',
        showScale: true
    });

}
     

function initPortfolio() {
     
     // reads URL parameter to get UserID
     // if present, loads page inputs with values for that user
     // if not present, selects default and unhides new user DIV
     

	UserID=getUrlParameter('UserID');

	//alert(UserID);

    if (UserID === '') {
		UserID = 5;
		document.getElementById("new-user-intro").style.display = "block";
	}
	else {
		document.getElementById("new-user-salutation").innerHTML="Welcome back, "+UserID+"!";
	}
	
     // set userID in spreadsheet
    setCell('','Experiment!B1',UserID); // Wait on callback before completing set parameters
}

function setParameters(){ 
     
     // get slots value from spreadsheet
    getCell('','Experiment!B2', 'SlotsSlider');
     
     // get spend value from spreadsheet
    getCell('','Experiment!B3', 'SpendText');
     
    setTimeout(updateInput(),3000);
}
     
	
function getCell(sheetID, rangeName, htmlID) {

  if(!sheetID)
    sheetID = '1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8';
  if (!rangeName)
    rangeName = 'Experiment!B3';
    
	url = "https://script.google.com/macros/s/AKfycbznMZbVEChkPICRcVc26o8rv-Wg0MQWQTMf7seXM41-/exec?action=get&sheet="+sheetID+"&range="+rangeName+"&callback=?"

	//alert(url);

	$.getJSON(url,function(data){ document.getElementById(htmlID).value=data; alert(htmlID+" = "+data);});
//	$.getJSON(url,function(data){ alert(data[0]);});
  // var values = Sheets.Spreadsheets.Values.get(sheetID, rangeName).values;

 
  return;
}

function setCell(sheetID, rangeName, val) {

  if(!sheetID)
    sheetID = '1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8';
  if (!rangeName)
    rangeName = 'Experiment!B3';
  
  if (!val)
    val = 2;

	url = "https://script.google.com/macros/s/AKfycbznMZbVEChkPICRcVc26o8rv-Wg0MQWQTMf7seXM41-/exec?action=set&sheet="+sheetID+"&range="+rangeName+"&value="+val+"&callback=?"

	//alert(url);

	//$.getJSON(url,function(data){ alert(data.updatedRows);});

	$.getJSON(url);

	if (rangeName == "Experiment!B1") { // if setting UserID, reset portfolio parameters		
		setParameters();
	}
  return;

}