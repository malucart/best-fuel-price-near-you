# gas-stationAI
Program that identifies the lowest fuel price in the vicinity of the user in Natal/RN
<!DOCTYPE html>
<html>
<head>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<title>Malu</title>

</head>
<body>

<div class="container-fluid" style="padding-top: 10%;">
<div class="col-md-6 offset-md-3 text-center">

<div class="input-group">
<div class="input-group-prepend">
<span class="input-group-text" id="">Coordinates</span>
</div>
<input id="Xinput" type="text" class="form-control" placeholder="X">
<input id="Yinput" type="text" class="form-control" placeholder="Y">
<div class="input-group-append">
<button class="btn btn-outline-primary" type="button" onclick="runScript();">Run!</button>
</div>
</div>
</div>

<div class="col-md-6 offset-md-3 text-center" style="padding-top: 30px;">

<table class="table" id="resultsTable">
<thead>
<tr>
<th scope="col">#</th>
<th scope="col">X</th>
<th scope="col">Y</th>
<th scope="col">Result</th>
</tr>
</thead>
<tbody>
<tr>
<!-- <th scope="row">1</th>
<td>Mark</td>
<td>Otto</td>
<td>@mdo</td> -->
</tr>
</tbody>
</table>

<a href="#" onclick="resetTable();">Clean results</a>

</div>
</div>

</body>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>s
<script type="text/javascript" src="genetic-algorithm.js"></script>
<script type="text/javascript">

function runScript()
{
var table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];


var row = table.insertRow(table.rows.length);

var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);

cell1.innerHTML = table.rows.length;
cell2.innerHTML = document.getElementById("Xinput").value;
cell3.innerHTML = document.getElementById("Yinput").value;
// cell4.innerHTML = ; // THE SHIT IS IN HERE :DDD
}

function resetTable()
{
var table = document.getElementById("resultsTable").getElementsByTagName("tbody")[0];
table.innerHTML = '';
}

</script>
</html>
