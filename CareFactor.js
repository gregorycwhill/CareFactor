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

   
function updateSlotInput(v) {
    document.getElementById('Slots').value=v;
    document.getElementById('SlotsValue').value=v; 
}

function updateSpendInput(v) {
    document.getElementById('SpendValue').value=v; 
}
        
function updateInput(){
	var v = document.getElementById('Slots').value;
	document.getElementById('SlotsValue').value=v;
    document.getElementById('local-chart').innerHTML = "<p>Please wait ... recalculating your portfolio</p>"
    setTimeout(drawChart,5000);
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
     
     // reads URL parameter
     // if present, loads page inputs with values for that user
     // if not present, selects default and unhides new user DIV and hides existing user DIV
     

	UserID=getUrlParameter('UserID');

	//alert(UserID);

    if (UserID === '') {
		UserID = 5;
		document.getElementById("new-user-intro").style.display = "block";
		//alert(document.getElementById("new-user").style.display);
	}
	else {
		document.getElementById("new-user-salutation").innerHTML="Welcome back, "+UserID+"!";
	}
	
     // set userID in spreadsheet
    setCell('','Experiment!B1',UserID);
     
     // get slots value from spreadsheet
     var slots = getCell('','Experiment!B2');
     
     // get spend value from spreadsheet
     var spendvalue = getCell('','Experiment!B3');
     
     drawChart();
     }
     
	
function getCell(sheetID, rangeName) {

  if(!sheetID)
    sheetID = '1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8';
  if (!rangeName)
    rangeName = 'Experiment!B3';
    
  var values = Sheets.Spreadsheets.Values.get(sheetID, rangeName).values;


  var result = values[0][0];
  
  return result;
}

function setCell(sheetID, rangeName, val) {

  if(!sheetID)
    sheetID = '1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8';
  if (!rangeName)
    rangeName = 'Experiment!B3';
  
  if (!val)
    val = 2;
      
  var valueRange = Sheets.newValueRange();

  valueRange.values = [[val]];
  var result = Sheets.Spreadsheets.Values.update(valueRange, sheetID, rangeName, {
      valueInputOption: "USER_ENTERED"
  });
  
  return result;

}