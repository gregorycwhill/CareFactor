// initialise tooltips everywhere

function recalc_form() {

	// read in form values
	var d=document.getElementById("donation").value;
	var r=document.getElementById("reinvest").value/100;
	var t=document.getElementById("platform").value/100;
	var p=document.getElementById("payment").value/100;
	var f=document.getElementById("fundraising").value;
	
	//alert("d: "+d+" r: "+r+"p: "+" f: "+f);

	// calculate the geometric mean of the returns (for some reason)

	var ret=1;
	var c=0;

	for(var i=0; i<=5; i++) {
		e = document.getElementById("activities_"+i);	
		if(e.checked) {
			ret *= parseFloat(e.parentElement.parentElement.previousElementSibling.innerText);
			c++;
		}
	}

	ret = c==0 ? 1: Math.pow(ret,1/c);

	//alert(ret);

	// calculate received amounts

	var n = Math.floor(d*(1 - r - t - p) - f);		// receive now
	var l = Math.floor(d * r * ret);				// receive later
	var total = Math.floor(n + l);					// total received

	//alert("n: "+n+" l: "+l+"total: "+total);

	// write back to form

	document.getElementById("rec_now").value = n;
	document.getElementById("rec_later").value = l;
	document.getElementById("rec_total").value = total;

return;
}