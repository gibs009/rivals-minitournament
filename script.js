// --- ADMIN LOGIN ---
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === "admin" && p === "admin12345") {
    localStorage.setItem("admin", "true");
    window.location = "admin.html";
  } else {
    document.getElementById("error").innerText = "Invalid login";
  }
}

// --- ADMIN CHECK ---
if (location.pathname.includes("admin.html")) {
  if (localStorage.getItem("admin") !== "true") {
    window.location = "admin-login.html";
  }
}

// --- LOGOUT ---
function logout() {
  localStorage.removeItem("admin");
  window.location = "admin-login.html";
}

// --- ADD TEAM ---
function addTeam() {
  const name = document.getElementById("teamName").value.trim();
  if (!name) return alert("Enter a team name!");
  const newTeam = { name, wins: 0, losses: 0 };
  database.ref('teams').push(newTeam);
  document.getElementById("teamName").value = "";
  alert("Team added!");
}

// --- SET NEXT MATCH ---
function setMatch() {
  const a = document.getElementById("teamA").value.trim();
  const b = document.getElementById("teamB").value.trim();
  if (!a || !b) return alert("Enter both teams!");
  const nextMatch = { teamA: a, teamB: b };
  database.ref('nextMatch').set(nextMatch);
  alert("Next match saved!");
}

// --- UPDATE / DELETE TEAM ---
function updateTeam(id, field, value) {
  database.ref('teams/' + id).update({ [field]: parseInt(value) || 0 });
}

function deleteTeam(id) {
  if (confirm("Delete this team?")) {
    database.ref('teams/' + id).remove();
  }
}

// --- LOAD EVERYTHING ON PAGE LOAD ---
window.onload = function() {
  // Standings table (if exists)
  const standingsTable = document.getElementById("standings");
  if (standingsTable) {
    database.ref('teams').on('value', snapshot => {
      const teams = snapshot.val();
      standingsTable.innerHTML = '';
      if (!teams) return;
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

  // Admin table (if exists)
  const teamsTable = document.getElementById("teamsTable");
  if (teamsTable) {
    database.ref('teams').on('value', snapshot => {
      const teams = snapshot.val();
      teamsTable.innerHTML = `
        <tr>
          <th>Team Name</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Actions</th>
        </tr>`;
      if (!teams) return;
      for (let id in teams) {
        const team = teams[id];
        teamsTable.innerHTML += `
          <tr>
            <td>${team.name}</td>
            <td><input type="number" min="0" value="${team.wins}" onchange="updateTeam('${id}','wins',this.value)"></td>
            <td><input type="number" min="0" value="${team.losses}" onchange="updateTeam('${id}','losses',this.value)"></td>
            <td><button onclick="deleteTeam('${id}')">Delete</button></td>
          </tr>
        `;
      }
    });
  }

  // Next match display (if exists)
  const nextMatchDiv = document.getElementById("nextMatch");
  if (nextMatchDiv) {
    database.ref('nextMatch').on('value', snapshot => {
      const match = snapshot.val();
      if (match && match.teamA && match.teamB) {
        nextMatchDiv.innerText = `${match.teamA} VS ${match.teamB}`;
      } else {
        nextMatchDiv.innerText = "No match scheduled";
      }
    });
  }
};
