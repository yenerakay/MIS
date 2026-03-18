let allData = [];

fetch("https://opensheet.elk.sh/SPREADSHEET_ID/SoGreen_Projects")
.then(res => res.json())
.then(data => {
  allData = data;
  renderDashboard(data);
  populateFilter(data);
});

function renderDashboard(data){

  // KPI
  document.getElementById("totalProjects").innerText = data.length;

  let totalWomen = data.reduce((a,b)=> a + Number(b.women || 0),0);
  let totalParticipants = data.reduce((a,b)=> a + Number(b.participants || 0),0);

  let ratio = totalParticipants ? ((totalWomen/totalParticipants)*100).toFixed(1) : 0;

  document.getElementById("womenRatio").innerText = ratio;

  let totalEmployment = data.reduce((a,b)=> a + Number(b.employment || 0),0);
  document.getElementById("employment").innerText = totalEmployment;

  // TABLE
  let html = "<tr><th>Agency</th><th>Project</th><th>Province</th><th>Employment</th></tr>";

  data.forEach(d=>{
    html += `<tr>
      <td>${d.agency}</td>
      <td>${d.project}</td>
      <td>${d.province}</td>
      <td>${d.employment}</td>
    </tr>`;
  });

  document.getElementById("table").innerHTML = html;

  // CHART
  let labels = data.map(d=>d.province);
  let values = data.map(d=>Number(d.employment));

  new Chart(document.getElementById("chart"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Employment',
        data: values
      }]
    }
  });
}

function populateFilter(data){
  let agencies = [...new Set(data.map(d=>d.agency))];

  let select = document.getElementById("agencyFilter");

  select.innerHTML = "<option value='all'>All Agencies</option>";

  agencies.forEach(a=>{
    select.innerHTML += `<option value="${a}">${a}</option>`;
  });
}

function filterData(){
  let val = document.getElementById("agencyFilter").value;

  if(val === "all"){
    renderDashboard(allData);
  } else {
    let filtered = allData.filter(d=>d.agency === val);
    renderDashboard(filtered);
  }
}
