// ADMIN LOGIN
function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if (u === "admin" && p === "admin12345") {
    localStorage.setItem("admin", "true");
    window.location = "admin.html";
  } else {
    document.getElementById("error").innerText = "Invalid login";
  }
}

// ADMIN CHECK
if (location.pathname.includes("admin.html")) {
  if (localStorage.getItem("admin") !== "true") {
    window.location = "admin-login.html";
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("admin");
  window.location = "login.html";
}

// ADD TEAM
function addTeam() {
  let name = document.getElementById("teamName").value;
  if (!name) return;

  const newTeam = { name, wins: 0, losses: 0 };
  database.ref('teams').push(newTeam);
  alert("Team Added");
}

// SET NEXT MATCH
function setMatch() {
  const a = document.getElementById("teamA").value;
  const b = document.getElementById("teamB").value;
  const nextMatch = { teamA: a, teamB: b };
  database.ref('nextMatch').set(nextMatch);
  alert("Next Match Saved");
}

// LOAD STANDINGS (Live)
window.onload = function() {
const standingsTable = document.getElementById("standings");
if (standingsTable) {
  database.ref('teams').on('value', (snapshot) => {
    const teams = snapshot.val();
    standingsTable.innerHTML = '';
    for (let id in teams) {
      const t = teams[id];
      standingsTable.innerHTML += `<tr>
        <td>${t.name}</td>
        <td>${t.wins}</td>
        <td>${t.losses}</td>
      </tr>`;
    }
  });
}
}

// LOAD NEXT MATCH (Live)



// Add a new team
function addTeam() {
  const name = document.getElementById("teamName").value.trim();
  if (!name) return alert("Enter a team name!");

  const newTeam = { name, wins: 0, losses: 0 };
  database.ref('teams').push(newTeam);
  document.getElementById("teamName").value = "";
  alert("Team added!");
}

// Load and display teams
window.onload = function() {
const standingsTable = document.getElementById("standings");
if (standingsTable) {
  database.ref('teams').on('value', (snapshot) => {
    const teams = snapshot.val();
    standingsTable.innerHTML = '';
    for (let id in teams) {
      const t = teams[id];
      standingsTable.innerHTML += `<tr>
        <td>${t.name}</td>
        <td>${t.wins}</td>
        <td>${t.losses}</td>
      </tr>`;
    }
  });
}



  const table = document.getElementById("teamsTable");
  database.ref('teams').on('value', snapshot => {
    const teams = snapshot.val();
    table.innerHTML = `
      <tr>
        <th>Team Name</th>
        <th>Wins</th>
        <th>Losses</th>
        <th>Actions</th>
      </tr>`;
    for (let id in teams) {
      const team = teams[id];
      table.innerHTML += `
        <tr>
          <td>${team.name}</td>
          <td><input type="number" min="0" value="${team.wins}" onchange="updateTeam('${id}', 'wins', this.value)"></td>
          <td><input type="number" min="0" value="${team.losses}" onchange="updateTeam('${id}', 'losses', this.value)"></td>
          <td><button onclick="deleteTeam('${id}')">Delete</button></td>
        </tr>
      `;
    }
  });
}

const nextMatchDiv = document.getElementById("nextMatch");
if (nextMatchDiv) {
  database.ref('nextMatch').on('value', (snapshot) => {
    const match = snapshot.val();
    if (match) {
      nextMatchDiv.innerText = `${match.teamA} VS ${match.teamB}`;
    } else {
      nextMatchDiv.innerText = "No match scheduled";
    }
  });
}
// Update wins or losses
function updateTeam(id, field, value) {
  database.ref('teams/' + id).update({ [field]: parseInt(value) || 0 });
}

// Delete a team
function deleteTeam(id) {
  if (confirm("Delete this team?")) {
    database.ref('teams/' + id).remove();
  }
}

// Logout
function logout() {
  localStorage.removeItem("admin");
  window.location = "admin-login.html";
}

// Load teams when page loads
window.onload = loadTeams;
