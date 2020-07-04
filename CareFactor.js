$( function() {
    $( "#sortable1" ).sortable();
} );

$( function() {
    $( "#sortable2" ).sortable();
} );

$( function() {
    $( "#sortable3" ).sortable();
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

$( function() {
    // setup scope sliders
    $( "#scope-slider" ).slider({
      values: [10,40,70,90],
	  min: 0,
	  max: 100,
	  step: 5,
      orientation: "horizontal",
      range: "min",
      animate: true,
	  slide: function( event, ui ) {
        
		h = ui.handleIndex;
		
		// stop the handles crossing
		if(ui.values[h]<ui.values[h-1]) {
			ui.values[h] = ui.values[h-1];
			return false;
		}
		
		if(ui.values[h]>ui.values[h+1]) {
			ui.values[h] = ui.values[h+1];
			return false;
		}
		
		// update the summary underneath the slider
		
		$( "#places1" ).text( ui.values[ 0 ] );
		$( "#places2" ).text( ui.values[ 1 ] - ui.values[ 0 ]);
		$( "#places3" ).text( ui.values[ 2 ] - ui.values[ 1 ] );
		$( "#places4" ).text( ui.values[ 3 ] - ui.values[ 2 ] );
		$( "#places5" ).text( 100 - ui.values[ 3 ]);
		
		// update the labels above the slider
		
		p0 = (ui.values[0])/2;
		p1 = ui.values[0] + (ui.values[1] - ui.values[0])/2;
		p2 = ui.values[1] + (ui.values[2] - ui.values[1])/2;
		p3 = ui.values[2] + (ui.values[3] - ui.values[2])/2;
		p4 = ui.values[3] + (100 - ui.values[3])/2;

		$( "#slider0").css("left",p0.toString()+"%");
		$( "#slider1").css("left",p1.toString()+"%");
		$( "#slider2").css("left",p2.toString()+"%");
		$( "#slider3").css("left",p3.toString()+"%");
		$( "#slider4").css("left",p4.toString()+"%");
      }
    });
}); 



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
	var flex = document.getElementById('FlexSlider').value;

	document.getElementById('SlotsText').innerHTML=slots;
	document.getElementById('FlexText').innerHTML=flex;

	setCell('','Experiment!B2',slots); // callback
	setCell('','Experiment!B3',spend); // callback
	setCell('','Experiment!B4',flex); // callback

    document.getElementById('portfolio-chart-treemap').innerHTML = "<p>Please wait ... recalculating your portfolio</p>"
    setTimeout(drawChart,3000); // wait for spreadsheet to get new values and recalculate
}

google.charts.load('current', {'packages':['treemap']});
google.charts.setOnLoadCallback(drawChart);
portfolioData="";
portfolioTree="";
portfolioOptions={
		minColor: '#cce',
        midColor: '#dda',
        maxColor: '#ee8',
        headerHeight: 20,
        fontColor: 'black',
        showScale: true,
		generateTooltip: showBoost,
		maxPostDepth: 2,
		hintOpacity: 0.0,
		maxDepth: 1
    }
	
// clear care boosts
	for(var i=2; i<29; i++) 
		setCell('','Experiment!L'+i,'0');	
     
CareBoost = getUrlParameter('CareBoost');
	 
function drawChart() {
	var query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1ZB-fGSOy-Z006AW_YZiBUsGsxlW03kuJmQh60PKzG-8/gviz/tq?gid=487731565&headers=1&range=i1:k57');
    query.send(handleQueryResponse);
}


function handleQueryResponse(response) {
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

	portfolioData = response.getDataTable();

    portfolioTree = new google.visualization.TreeMap(document.getElementById('portfolio-chart-treemap'));

    portfolioTree.draw(portfolioData, portfolioOptions);
	
	if (CareBoost) {
		
		rowMax = portfolioData.getNumberOfRows();
		row = -1;
		
		for(var i=0; i<rowMax; i++) {
			if (portfolioData.getValue(i,0)==CareBoost) {
				row=i;
			}
		}
		if(row==-1)
			alert("Warning! CareBoost not applied as " + CareBoost + " is not in your portfolio.");
		else
			doBoost(row);
	CareBoost = "";
	}	
}

function showBoost(row, size, value) {
	
	spend = parseFloat(document.getElementById("SpendText").value);
	
	html = '<div style="background:#eee; padding:10px; border-style:solid">' +
	'<b>' + portfolioData.getValue(row,0) + '</b><br>' +
	'[$'+ (portfolioData.getValue(row,2)*spend).toFixed(2) + ']<br><br>' +

	'Click here to <a href="#" onClick="doBoost('+row+');$(this).parent().hide(); ">CareBoost</a>.</div>';
	
	if (row==0) {
		
		// Flex Fund
		
	html = '<div style="background:#eee; padding:10px; border-style:solid">' +
	'<b>Flex Fund [$'+ (portfolioData.getValue(row,2)*spend).toFixed(2) + ']</b><br><br>' +
	'This amount goes to the shared fund to<br>be matched with new member donations.<br><br>' + 
	'All money is paid out to causes in your portfolio.<br>';
	}
	
	return html;
}

function doBoost(row) {
	
	var val = portfolioData.getValue(row,2)
	
	range='Experiment!L'.concat(2+row);
	
	setCell('',range,val*2);
	portfolioTree.clearChart();
	document.getElementById('portfolio-chart-treemap').innerHTML = "<p>Please wait ... Applying CareBoost to <b>" + portfolioData.getValue(row,0)+ "</b>.</p>"
	//setTimeout(portfolioTree.draw(portfolioData, portfolioOptions),3000);
	setTimeout(drawChart,3000);
	return;
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

//	for(var i=2; i<28; i++) 
//		setCell('','Experiment!L'+i,'0');
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
    
	url = "https://script.google.com/macros/s/AKfycbwARmLZht0rIZHsB61HljietXbQ29BFj0mtxZTeUpXzvAmg0VhLO1uYRsr62_MSDNE/exec?action=get&sheet="+sheetID+"&range="+rangeName+"&callback=?"

	//alert(url);

	$.getJSON(url,function(data){ document.getElementById(htmlID).value=data; });
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

	url = "https://script.google.com/macros/s/AKfycbwARmLZht0rIZHsB61HljietXbQ29BFj0mtxZTeUpXzvAmg0VhLO1uYRsr62_MSDNE/exec?action=set&sheet="+sheetID+"&range="+rangeName+"&value="+val+"&callback=?"

	//alert(url);

	//$.getJSON(url,function(data){ alert(data.updatedRows);});

	$.getJSON(url);

	if (rangeName == "Experiment!B1") { // if setting UserID, reset portfolio parameters		
		setParameters();
	}
  return;

}

  $( function() {
    var availableTags = [
"Abdominal aortic aneurysm ",
"Acne ",
"Acute cholecystitis ",
"Acute lymphoblastic leukaemia ",
"Acute lymphoblastic leukaemia: Children ",
"Acute lymphoblastic leukaemia: Teenagers and young adults ",
"Acute myeloid leukaemia ",
"Acute myeloid leukaemia: Children ",
"Acute myeloid leukaemia: Teenagers and young adults ",
"Acute pancreatitis ",
"Addison's disease ",
"Alcohol-related liver disease ",
"Allergic rhinitis ",
"Allergies ",
"Alzheimer's disease ",
"Anal cancer ",
"Anaphylaxis ",
"Angioedema ",
"Ankylosing spondylitis ",
"Anorexia nervosa ",
"Anxiety ",
"Anxiety disorders in children ",
"Appendicitis ",
"Arthritis ",
"Asbestosis ",
"Asthma ",
"Atopic eczema ",
"Attention deficit hyperactivity disorder (ADHD) ",
"Autistic spectrum disorder (ASD) ",
"Bacterial vaginosis ",
"Benign prostate enlargement ",
"Bile duct cancer (cholangiocarcinoma) ",
"Binge eating ",
"Bipolar disorder ",
"Bladder cancer ",
"Blood poisoning (sepsis) ",
"Bone cancer ",
"Bone cancer: Teenagers and young adults ",
"Bowel cancer ",
"Bowel incontinence ",
"Bowel polyps ",
"Brain stem death ",
"Brain tumours ",
"Brain tumours: Children ",
"Brain tumours: Teenagers and young adults ",
"Breast cancer (female) ",
"Breast cancer (male) ",
"Bronchiectasis ",
"Bronchitis ",
"Bulimia ",
"Bunion ",
"Carcinoid syndrome and carcinoid tumours ",
"Catarrh ",
"Cellulitis ",
"Cervical cancer ",
"Chest infection ",
"Chest pain ",
"Chickenpox ",
"Chilblains ",
"Chronic fatigue syndrome ",
"Chronic kidney disease ",
"Chronic lymphocytic leukaemia ",
"Chronic myeloid leukaemia ",
"Chronic obstructive pulmonary disease ",
"Chronic pancreatitis ",
"Cirrhosis ",
"Clostridium difficile ",
"Coeliac disease ",
"Cold sore ",
"Coma ",
"Common cold ",
"Common heart conditions ",
"Congenital heart disease ",
"Conjunctivitis ",
"Constipation ",
"Coronavirus (COVID-19) ",
"Cough ",
"Crohn's disease ",
"Croup ",
"Cystic fibrosis ",
"Cystitis ",
"Deafblindness ",
"Deep vein thrombosis ",
"Dehydration ",
"Dementia ",
"Dementia with Lewy bodies ",
"Dental abscess ",
"Depression ",
"Dermatitis herpetiformis ",
"Diabetes ",
"Diarrhoea ",
"Discoid eczema ",
"Diverticular disease and diverticulitis ",
"Dizziness (Lightheadedness) ",
"Down's syndrome ",
"Dry mouth ",
"Dysphagia (swallowing problems) ",
"Dystonia ",
"Earache ",
"Earwax build-up ",
"Ebola virus disease ",
"Ectopic pregnancy ",
"Endometriosis ",
"Epilepsy ",
"Erectile dysfunction (impotence) ",
"Escherichia coli (E. coli) O157 ",
"Ewing sarcoma ",
"Ewing sarcoma: Children ",
"Eye cancer ",
"Febrile seizures ",
"Fever in children ",
"Fibroids ",
"Fibromyalgia ",
"Flatulence ",
"Flu ",
"Foetal alcohol syndrome ",
"Food poisoning ",
"Fungal nail infection ",
"Gallbladder cancer ",
"Gallstones ",
"Ganglion cyst ",
"Gastroenteritis ",
"Gastro-oesophageal reflux disease (GORD) ",
"Genital herpes ",
"Genital warts ",
"Germ cell tumours ",
"Glandular fever ",
"Gout ",
"Gum disease ",
"Haemorrhoids (piles) ",
"Hairy cell leukaemia ",
"Hand, foot and mouth disease ",
"Hay fever ",
"Head and neck cancer ",
"Head lice and nits ",
"Headaches ",
"Hearing loss ",
"Heart failure ",
"Hepatitis A ",
"Hepatitis B ",
"Hepatitis C ",
"Hiatus hernia ",
"High cholesterol ",
"HIV ",
"Hodgkin lymphoma ",
"Hodgkin lymphoma: Children ",
"Hodgkin lymphoma: Teenagers and young adults ",
"Huntington's disease ",
"Hyperglycaemia (high blood sugar) ",
"Hyperhidrosis ",
"Hypoglycaemia (low blood sugar) ",
"Idiopathic pulmonary fibrosis ",
"Impetigo ",
"Indigestion ",
"Ingrown toenail ",
"Inherited heart conditions ",
"Insomnia ",
"Iron deficiency anaemia ",
"Irritable bowel syndrome (IBS) ",
"Irritable hip ",
"Itching ",
"Itchy bottom ",
"Kaposi's sarcoma ",
"Kidney cancer ",
"Kidney infection ",
"Kidney stones ",
"Labyrinthitis ",
"Lactose intolerance ",
"Langerhans cell histiocytosis ",
"Laryngeal (larynx) cancer ",
"Laryngitis ",
"Leg cramps ",
"Lichen planus ",
"Liver cancer ",
"Liver disease ",
"Liver tumours ",
"Loss of libido ",
"Lung cancer ",
"Lupus ",
"Lyme disease ",
"Lymphoedema ",
"Malaria ",
"Malignant brain tumour (cancerous) ",
"Malnutrition ",
"Measles ",
"Meningitis ",
"Menopause ",
"Mesothelioma ",
"Middle ear infection (otitis media) ",
"Migraine ",
"Miscarriage ",
"Motor neurone disease (MND) ",
"Mouth cancer ",
"Mouth ulcer ",
"Multiple myeloma ",
"Multiple sclerosis (MS) ",
"Mumps ",
"Meniere's disease ",
"Nasal and sinus cancer ",
"Nasopharyngeal cancer ",
"Neuroblastoma ",
"Neuroblastoma: Children ",
"Neuroendocrine tumours ",
"Non-alcoholic fatty liver disease (NAFLD) ",
"Non-Hodgkin lymphoma ",
"Non-Hodgkin lymphoma: Children ",
"Norovirus ",
"Nosebleed ",
"Obesity ",
"Obsessive compulsive disorder (OCD) ",
"Obstructive sleep apnoea ",
"Oesophageal cancer ",
"Oral thrush in adults ",
"Osteoarthritis ",
"Osteoporosis ",
"Osteosarcoma ",
"Otitis externa ",
"Ovarian cancer ",
"Ovarian cancer: Teenagers and young adults ",
"Ovarian cyst ",
"Overactive thyroid ",
"Paget's disease of the nipple ",
"Pancreatic cancer ",
"Panic disorder ",
"Parkinson's disease ",
"Pelvic organ prolapse ",
"Penile cancer ",
"Peripheral neuropathy ",
"Personality disorder ",
"Pleurisy ",
"Pneumonia ",
"Polymyalgia rheumatica ",
"Post-traumatic stress disorder (PTSD) ",
"Postnatal depression ",
"Pregnancy and baby ",
"Pressure ulcers ",
"Prostate cancer ",
"Psoriasis ",
"Psoriatic arthritis ",
"Psychosis ",
"Rare tumours ",
"Raynaud's phenomenon ",
"Reactive arthritis ",
"Restless legs syndrome ",
"Retinoblastoma ",
"Retinoblastoma: Children ",
"Rhabdomyosarcoma ",
"Rheumatoid arthritis ",
"Ringworm and other fungal infections ",
"Rosacea ",
"Scabies ",
"Scarlet fever ",
"Schizophrenia ",
"Scoliosis ",
"Septic shock ",
"Sexually transmitted infections (STIs) ",
"Shingles ",
"Shortness of breath ",
"Sickle cell disease ",
"Sinusitis ",
"Sjogren's syndrome ",
"Skin cancer (melanoma) ",
"Skin cancer (non-melanoma) ",
"Slapped cheek syndrome ",
"Soft tissue sarcomas ",
"Soft tissue sarcomas: Teenagers and young adults ",
"Sore throat ",
"Spleen problems and spleen removal ",
"Stillbirth ",
"Stomach ache and abdominal pain ",
"Stomach cancer ",
"Stomach ulcer ",
"Stress, anxiety and low mood ",
"Stroke ",
"Sudden infant death syndrome (SIDS) ",
"Suicide ",
"Sunburn ",
"Swollen glands ",
"Testicular cancer ",
"Testicular cancer: Teenagers and young adults ",
"Testicular lumps and swellings ",
"Thirst ",
"Threadworms ",
"Thrush in men ",
"Thyroid cancer ",
"Thyroid cancer: Teenagers and young adults ",
"Tinnitus ",
"Tonsillitis ",
"Tooth decay ",
"Toothache ",
"Transient ischaemic attack (TIA) ",
"Trigeminal neuralgia ",
"Tuberculosis (TB) ",
"Type 1 diabetes ",
"Type 2 diabetes ",
"Ulcerative colitis ",
"Underactive thyroid ",
"Urinary incontinence ",
"Urinary tract infection (UTI) ",
"Urinary tract infection (UTI) in children ",
"Urticaria (hives) ",
"Vaginal cancer ",
"Vaginal thrush ",
"Varicose eczema ",
"Varicose veins ",
"Venous leg ulcer ",
"Vertigo ",
"Vitamin B12 or folate deficiency anaemia ",
"Vomiting in adults ",
"Vulval cancer ",
"Warts and verrucas ",
"Whooping cough ",
"Wilms’ tumour ",
"Womb (uterus) cancer ",
"Yellow fever ",

    ];
    $( "#keyword" ).autocomplete({
      source: availableTags
    });
  } );


